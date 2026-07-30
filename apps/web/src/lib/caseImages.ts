import fs from "node:fs";
import path from "node:path";
import { CASE_IMAGE_DIR, CASE_IMAGE_EXTENSIONS, caseImageBase } from "./slug";
import type { PortfolioItem } from "./serverApi";

// Resolución de las fotos de los casos. SÓLO SERVIDOR: importa `node:fs`, así
// que no puede colarse en ningún componente con "use client".
//
// El modelo de datos no tiene campo de imagen (ver PortfolioItem) y no queríamos
// tocar Prisma ni la API para esto, así que la convención es el nombre del
// fichero: el proyecto "Tienda online La Espiga" busca
// public/images/casos/tienda-online-la-espiga.webp. La carpeta lleva su propio
// README con las reglas.
//
// Se comprueba la existencia aquí y no en el cliente con un onError porque
// entregarle al optimizador de next/image una ruta que no existe da un 400 y un
// parpadeo; sabiéndolo de antemano, el caso sin foto va directo al visual
// generado. Como la home se renderiza en cada petición (serverApi usa
// cache: "no-store"), una imagen recién soltada aparece al refrescar.

/** Carpeta física correspondiente a CASE_IMAGE_DIR. */
const PUBLIC_DIR = path.join(process.cwd(), "public", ...CASE_IMAGE_DIR.split("/").filter(Boolean));

/**
 * projectId → ruta pública de su foto. Los proyectos sin fichero simplemente no
 * aparecen en el mapa.
 *
 * Se lista el directorio una vez en lugar de hacer un `existsSync` por
 * proyecto: son N syscalls contra una, y de paso permite comparar en minúsculas
 * (Windows no distingue mayúsculas pero el Linux del despliegue sí, y una foto
 * que funciona en local y no en producción es un fallo caro de encontrar).
 */
export function resolveCaseImages(projects: PortfolioItem[]): Record<string, string> {
  let files: Set<string>;
  try {
    files = new Set(fs.readdirSync(PUBLIC_DIR).map((f) => f.toLowerCase()));
  } catch {
    // La carpeta puede no existir (despliegue que no copió public/): sin fotos,
    // todos los casos usan el visual generado y la sección sigue en pie.
    return {};
  }

  const out: Record<string, string> = {};
  for (const project of projects) {
    const base = caseImageBase(project.name);
    // El primero de la lista que exista: el orden de CASE_IMAGE_EXTENSIONS es
    // la preferencia si alguien deja el mismo caso en dos formatos.
    const ext = CASE_IMAGE_EXTENSIONS.find((e) => files.has(`${base}${e}`));
    if (ext) out[project.id] = `${CASE_IMAGE_DIR}/${base}${ext}`;
  }
  return out;
}
