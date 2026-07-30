import path from "node:path";
import archiver from "archiver";
import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import type { Deliverable } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { UPLOADS_DIR } from "../lib/upload.js";
import { validate } from "../utils/validate.js";

export const publicRouter = Router();

// Rate limiting general para las rutas públicas (portal + landing).
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  limit: 100, // 100 peticiones por IP por ventana
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos.", code: "rate_limited" },
});
publicRouter.use(generalLimiter);

// Rate limiting estricto anti-spam para el formulario de contacto.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Has enviado demasiados mensajes. Intenta más tarde.", code: "rate_limited" },
});

// Busca un proyecto por accessToken y valida vigencia.
// Devuelve { project } o un objeto { status, body } de error.
async function resolveProject(accessToken: string) {
  const project = await prisma.project.findUnique({
    where: { accessToken },
    include: {
      client: true,
      services: { orderBy: { order: "asc" } },
      deliverables: { orderBy: { createdAt: "desc" } },
      documents: { orderBy: { order: "asc" } },
    },
  });

  if (!project) {
    return { error: { status: 404, body: { error: "Proyecto no encontrado.", code: "not_found" } } };
  }
  if (project.tokenExpiresAt && project.tokenExpiresAt.getTime() < Date.now()) {
    return { error: { status: 410, body: { error: "Este enlace ha expirado.", code: "expired" } } };
  }
  return { project };
}

// GET /api/public/proyecto/:accessToken — datos del proyecto (sin auth).
publicRouter.get("/proyecto/:accessToken", async (req, res, next) => {
  try {
    const result = await resolveProject(req.params.accessToken);
    if (result.error) {
      return res.status(result.error.status).json(result.error.body);
    }

    // Logging de acceso: consola + marca de tiempo en el proyecto.
    const ip = req.headers["x-forwarded-for"] ?? req.socket.remoteAddress;
    console.log(`[portal] acceso a "${result.project!.name}" desde ${ip} @ ${new Date().toISOString()}`);
    await prisma.project.update({
      where: { id: result.project!.id },
      data: { lastAccessedAt: new Date() },
    });

    return res.json({ project: result.project });
  } catch (err) {
    return next(err);
  }
});

// GET /api/public/proyecto/:accessToken/download-all — zip con los archivos.
publicRouter.get("/proyecto/:accessToken/download-all", async (req, res, next) => {
  try {
    const result = await resolveProject(req.params.accessToken);
    if (result.error) {
      return res.status(result.error.status).json(result.error.body);
    }

    const files = (result.project!.deliverables ?? []).filter((d: Deliverable) =>
      d.fileUrl?.startsWith("/uploads/")
    );
    if (files.length === 0) {
      return res.status(404).json({ error: "No hay archivos descargables.", code: "no_files" });
    }

    const safeName = result.project!.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    res.attachment(`${safeName}-entregables.zip`);

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => next(err));
    archive.pipe(res);

    for (const d of files) {
      const filePath = path.join(UPLOADS_DIR, path.basename(d.fileUrl!));
      const ext = path.extname(d.fileUrl!);
      archive.file(filePath, { name: `${d.name}${ext}` });
    }
    await archive.finalize();
  } catch (err) {
    return next(err);
  }
});

// ----------------------------------------------------------------------------
// Landing pública (Fase 3)
// ----------------------------------------------------------------------------

// GET /api/public/servicios — lista de servicios para la landing.
publicRouter.get("/servicios", async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json({ services });
  } catch (err) {
    next(err);
  }
});

// GET /api/public/portfolio — proyectos marcados como showcase (shape público).
publicRouter.get("/portfolio", async (_req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: { showcase: true },
      orderBy: { deliveryDate: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        deliveryDate: true,
        url: true,
        services: { select: { name: true, icon: true, slug: true } },
        client: { select: { name: true, company: true } },
      },
    });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

const contactSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("Email inválido."),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  interest: z.array(z.string()).optional(),
  message: z.string().min(1, "Escribe un mensaje."),
});

// POST /api/public/contact — guarda el mensaje del formulario en la BD.
publicRouter.post("/contact", contactLimiter, async (req, res, next) => {
  try {
    const data = validate(contactSchema, req.body, res);
    if (!data) return;

    const created = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        interest: data.interest?.length ? data.interest.join(", ") : null,
        message: data.message,
      },
    });

    console.log(`[contacto] nuevo mensaje de ${created.name} <${created.email}> @ ${created.createdAt.toISOString()}`);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});
