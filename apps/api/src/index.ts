import "dotenv/config";
import cors from "cors";
import express from "express";
import { UPLOADS_DIR } from "./lib/upload.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { authRouter } from "./routes/auth.js";
import { clientsRouter } from "./routes/clients.js";
import { deliverablesRouter } from "./routes/deliverables.js";
import { documentsRouter } from "./routes/documents.js";
import { projectsRouter } from "./routes/projects.js";
import { publicRouter } from "./routes/public.js";
import { servicesRouter } from "./routes/services.js";
import { statsRouter } from "./routes/stats.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const WEB_ORIGIN = process.env.WEB_ORIGIN ?? "http://localhost:3000";

app.use(cors({ origin: WEB_ORIGIN, credentials: true }));
app.use(express.json());

// Archivos subidos (Fase 1: disco local).
app.use("/uploads", express.static(UPLOADS_DIR));

// Health check — usado por el frontend para verificar la conexión.
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "miel-mostaza-api", time: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/clients", clientsRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/deliverables", deliverablesRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/stats", statsRouter);
app.use("/api/public", publicRouter);

// Manejo de 404 y errores (siempre al final).
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🍯 API Miel Mostaza escuchando en http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});
