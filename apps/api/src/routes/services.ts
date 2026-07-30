import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const servicesRouter = Router();
servicesRouter.use(requireAuth);

// GET /api/services — lista de servicios (para checkboxes del modal de proyecto).
servicesRouter.get("/", async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    res.json({ services });
  } catch (err) {
    next(err);
  }
});
