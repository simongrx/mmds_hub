import type { NextFunction, Request, Response } from "express";

export function notFound(_req: Request, res: Response) {
  res.status(404).json({ error: "Ruta no encontrada." });
}

// Middleware de error central. Debe registrarse al final de todas las rutas.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.error("[error]", err);
  const message = err instanceof Error ? err.message : "Error interno del servidor.";
  res.status(500).json({ error: message });
}
