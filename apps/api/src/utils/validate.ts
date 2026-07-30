import type { Response } from "express";
import type { z } from "zod";

// Corre un schema zod sobre `data`. Si falla, responde 400 con el primer mensaje
// y devuelve null. Si pasa, devuelve los datos tipados.
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown,
  res: Response
): T | null {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0].message });
    return null;
  }
  return parsed.data;
}
