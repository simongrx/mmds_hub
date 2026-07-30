import { randomBytes } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";

// Fase 1: almacenamiento en disco local (fallback sin Cloudinary).
// Los archivos se sirven estáticamente desde /uploads (ver index.ts).
export const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;
    cb(null, unique);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});

// Ruta pública (relativa) para un archivo guardado.
export function publicUrl(filename: string): string {
  return `/uploads/${filename}`;
}

// Elimina un archivo del disco dado su ruta pública (/uploads/<file>).
export function removeFileByUrl(fileUrl?: string | null) {
  if (!fileUrl) return;
  const filename = path.basename(fileUrl);
  const full = path.join(UPLOADS_DIR, filename);
  fs.promises.unlink(full).catch(() => {
    /* ignora si no existe */
  });
}
