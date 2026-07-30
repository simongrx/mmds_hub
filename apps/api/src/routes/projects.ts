import { randomBytes } from "node:crypto";
import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../utils/validate.js";

export const projectsRouter = Router();
projectsRouter.use(requireAuth);

const VALID_STATUS = ["pending", "in_development", "delivered"] as const;

const projectSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  clientId: z.string().min(1, "El cliente es obligatorio."),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(VALID_STATUS).optional(),
  startDate: z.string().datetime().optional().or(z.literal("")),
  endDate: z.string().datetime().optional().or(z.literal("")),
  deliveryDate: z.string().datetime().optional().or(z.literal("")),
  serviceIds: z.array(z.string()).optional(),
});

function toDate(value?: string): Date | null {
  return value ? new Date(value) : null;
}

// Fase 2: el acceso del cliente expira a los 30 días.
export const TOKEN_TTL_DAYS = 30;
export function tokenExpiry(): Date {
  return new Date(Date.now() + TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
}

// GET /api/projects — lista con cliente y servicios; filtro opcional ?status=
projectsRouter.get("/", async (req, res, next) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const projects = await prisma.project.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      include: { client: true, services: true },
    });
    res.json({ projects });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id — detalle con relaciones.
projectsRouter.get("/:id", async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: { client: true, services: true, deliverables: true, documents: true },
    });
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado." });
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects
projectsRouter.post("/", async (req, res, next) => {
  try {
    const data = validate(projectSchema, req.body, res);
    if (!data) return;

    const project = await prisma.project.create({
      data: {
        name: data.name,
        clientId: data.clientId,
        description: data.description || null,
        status: data.status ?? "pending",
        startDate: toDate(data.startDate),
        endDate: toDate(data.endDate),
        deliveryDate: toDate(data.deliveryDate),
        tokenExpiresAt: tokenExpiry(),
        services: data.serviceIds?.length
          ? { connect: data.serviceIds.map((id) => ({ id })) }
          : undefined,
      },
      include: { client: true, services: true },
    });
    res.status(201).json({ project });
  } catch (err) {
    next(err);
  }
});

// PUT /api/projects/:id
projectsRouter.put("/:id", async (req, res, next) => {
  try {
    const data = validate(projectSchema, req.body, res);
    if (!data) return;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name: data.name,
        clientId: data.clientId,
        description: data.description || null,
        status: data.status ?? "pending",
        startDate: toDate(data.startDate),
        endDate: toDate(data.endDate),
        deliveryDate: toDate(data.deliveryDate),
        services: { set: (data.serviceIds ?? []).map((id) => ({ id })) },
      },
      include: { client: true, services: true },
    });
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/deliverables
projectsRouter.get("/:id/deliverables", async (req, res, next) => {
  try {
    const deliverables = await prisma.deliverable.findMany({
      where: { projectId: req.params.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ deliverables });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/documents
projectsRouter.get("/:id/documents", async (req, res, next) => {
  try {
    const documents = await prisma.document.findMany({
      where: { projectId: req.params.id },
      orderBy: { order: "asc" },
    });
    res.json({ documents });
  } catch (err) {
    next(err);
  }
});

// POST /api/projects/:id/regenerate-token — genera un nuevo accessToken de cliente.
projectsRouter.post("/:id/regenerate-token", async (req, res, next) => {
  try {
    const accessToken = randomBytes(24).toString("hex");
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: { accessToken, tokenExpiresAt: tokenExpiry() },
      select: { id: true, accessToken: true, tokenExpiresAt: true },
    });
    res.json({ project });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/projects/:id
projectsRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.project.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
