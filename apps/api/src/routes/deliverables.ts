import path from "node:path";
import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { UPLOADS_DIR, publicUrl, removeFileByUrl, upload } from "../lib/upload.js";
import { requireAuth } from "../middleware/auth.js";

export const deliverablesRouter = Router();

const VALID_TYPES = ["video", "link", "document", "image", "other"];

// GET /api/deliverables/:id/download — descarga pública con contador.
// (Sin auth: se usará también desde el portal cliente en Fase 2.)
deliverablesRouter.get("/:id/download", async (req, res, next) => {
  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: req.params.id },
    });
    if (!deliverable?.fileUrl) {
      return res.status(404).json({ error: "Archivo no encontrado." });
    }

    await prisma.deliverable.update({
      where: { id: deliverable.id },
      data: { downloadCount: { increment: 1 } },
    });

    const filePath = path.join(UPLOADS_DIR, path.basename(deliverable.fileUrl));
    return res.download(filePath, deliverable.name);
  } catch (err) {
    return next(err);
  }
});

// A partir de aquí, todo requiere autenticación.
deliverablesRouter.use(requireAuth);

// POST /api/deliverables — subir archivo (multipart) o registrar enlace.
deliverablesRouter.post("/", upload.single("file"), async (req, res, next) => {
  try {
    const { projectId, name, type, description, linkUrl } = req.body as Record<
      string,
      string | undefined
    >;

    if (!projectId) return res.status(400).json({ error: "projectId es obligatorio." });
    if (!name) return res.status(400).json({ error: "El nombre es obligatorio." });

    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado." });

    const resolvedType = type && VALID_TYPES.includes(type) ? type : "other";

    // Un deliverable puede ser un archivo subido o un enlace externo (tipo "link").
    const fileUrl = req.file ? publicUrl(req.file.filename) : linkUrl || null;
    const fileSize = req.file ? req.file.size : null;

    if (!fileUrl) {
      return res.status(400).json({ error: "Adjunta un archivo o proporciona un enlace." });
    }

    const deliverable = await prisma.deliverable.create({
      data: {
        projectId,
        name,
        description: description || null,
        type: resolvedType,
        fileUrl,
        fileSize,
      },
    });

    res.status(201).json({ deliverable });
  } catch (err) {
    next(err);
  }
});

// GET /api/projects/:id/deliverables se monta aparte; aquí listamos por query.
// GET /api/deliverables?projectId=...
deliverablesRouter.get("/", async (req, res, next) => {
  try {
    const projectId = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
    const deliverables = await prisma.deliverable.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { createdAt: "desc" },
    });
    res.json({ deliverables });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/deliverables/:id — elimina registro y archivo del disco.
deliverablesRouter.delete("/:id", async (req, res, next) => {
  try {
    const deliverable = await prisma.deliverable.findUnique({
      where: { id: req.params.id },
    });
    if (!deliverable) return res.status(404).json({ error: "Deliverable no encontrado." });

    // Solo borra del disco si es un archivo servido localmente.
    if (deliverable.fileUrl?.startsWith("/uploads/")) {
      removeFileByUrl(deliverable.fileUrl);
    }
    await prisma.deliverable.delete({ where: { id: deliverable.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
