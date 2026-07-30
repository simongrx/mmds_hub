import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../utils/validate.js";

export const documentsRouter = Router();
documentsRouter.use(requireAuth);

const documentSchema = z.object({
  projectId: z.string().min(1, "projectId es obligatorio."),
  title: z.string().min(1, "El título es obligatorio."),
  content: z.string().optional().or(z.literal("")),
  category: z.enum(["guide", "contract", "specs"]).optional(),
  order: z.number().int().optional(),
});

// POST /api/documents
documentsRouter.post("/", async (req, res, next) => {
  try {
    const data = validate(documentSchema, req.body, res);
    if (!data) return;

    const project = await prisma.project.findUnique({ where: { id: data.projectId } });
    if (!project) return res.status(404).json({ error: "Proyecto no encontrado." });

    const document = await prisma.document.create({
      data: {
        projectId: data.projectId,
        title: data.title,
        content: data.content || null,
        category: data.category ?? "guide",
        order: data.order ?? 0,
      },
    });
    res.status(201).json({ document });
  } catch (err) {
    next(err);
  }
});

// PUT /api/documents/:id
documentsRouter.put("/:id", async (req, res, next) => {
  try {
    const data = validate(documentSchema, req.body, res);
    if (!data) return;

    const document = await prisma.document.update({
      where: { id: req.params.id },
      data: {
        title: data.title,
        content: data.content || null,
        category: data.category ?? "guide",
        order: data.order ?? 0,
      },
    });
    res.json({ document });
  } catch (err) {
    next(err);
  }
});

// GET /api/documents?projectId=...
documentsRouter.get("/", async (req, res, next) => {
  try {
    const projectId = typeof req.query.projectId === "string" ? req.query.projectId : undefined;
    const documents = await prisma.document.findMany({
      where: projectId ? { projectId } : undefined,
      orderBy: { order: "asc" },
    });
    res.json({ documents });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/documents/:id
documentsRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.document.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
