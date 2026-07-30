import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth } from "../middleware/auth.js";

export const statsRouter = Router();
statsRouter.use(requireAuth);

// GET /api/stats — métricas del dashboard.
statsRouter.get("/", async (_req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [totalProjects, activeProjects, deliveredThisMonth, totalClients] =
      await Promise.all([
        prisma.project.count(),
        prisma.project.count({ where: { status: "in_development" } }),
        prisma.project.count({
          where: { status: "delivered", updatedAt: { gte: startOfMonth } },
        }),
        prisma.client.count(),
      ]);

    res.json({ totalProjects, activeProjects, deliveredThisMonth, totalClients });
  } catch (err) {
    next(err);
  }
});
