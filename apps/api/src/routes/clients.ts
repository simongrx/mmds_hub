import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../utils/validate.js";

export const clientsRouter = Router();
clientsRouter.use(requireAuth);

const clientSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio."),
  email: z.string().email("Email inválido.").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  company: z.string().optional().or(z.literal("")),
  logoUrl: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
});

// Normaliza cadenas vacías a null para campos opcionales.
function clean(data: z.infer<typeof clientSchema>) {
  return {
    name: data.name,
    email: data.email || null,
    phone: data.phone || null,
    company: data.company || null,
    logoUrl: data.logoUrl || null,
    notes: data.notes || null,
  };
}

// GET /api/clients — lista con conteo de proyectos.
clientsRouter.get("/", async (_req, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { projects: true } } },
    });
    res.json({ clients });
  } catch (err) {
    next(err);
  }
});

// GET /api/clients/:id — detalle con proyectos.
clientsRouter.get("/:id", async (req, res, next) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.params.id },
      include: { projects: true },
    });
    if (!client) return res.status(404).json({ error: "Cliente no encontrado." });
    res.json({ client });
  } catch (err) {
    next(err);
  }
});

// POST /api/clients
clientsRouter.post("/", async (req, res, next) => {
  try {
    const data = validate(clientSchema, req.body, res);
    if (!data) return;
    const client = await prisma.client.create({ data: clean(data) });
    res.status(201).json({ client });
  } catch (err) {
    next(err);
  }
});

// PUT /api/clients/:id
clientsRouter.put("/:id", async (req, res, next) => {
  try {
    const data = validate(clientSchema, req.body, res);
    if (!data) return;
    const client = await prisma.client.update({
      where: { id: req.params.id },
      data: clean(data),
    });
    res.json({ client });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/clients/:id
clientsRouter.delete("/:id", async (req, res, next) => {
  try {
    await prisma.client.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});
