// Utilidades de slug. Aisladas y sin dependencias porque las usan tanto el
// servidor (resolución de imágenes de casos en lib/caseImages.ts) como el
// cliente (CaseCard), y meterlas en un módulo con `node:fs` las contaminaría.

/**
 * "Panadería La Espiga" → "panaderia-la-espiga".
 *
 * NFD separa la letra de su tilde y el rango U+0300–U+036F borra los
 * diacríticos sueltos, así que ñ→n y á→a sin necesidad de una tabla de
 * sustituciones. Lo que quede fuera de [a-z0-9] colapsa a un solo guion.
 *
 * Se usa \p{Diacritic} y no un rango de code points literal: las marcas
 * combinantes son invisibles en el editor y cualquier reguardado en otra
 * codificación las destruye sin avisar.
 */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Carpeta pública donde se dejan las fotos de los casos. */
export const CASE_IMAGE_DIR = "/images/casos";

/**
 * Extensiones que se aceptan, en orden de preferencia si hubiera varias con el
 * mismo nombre.
 *
 * Se aceptan todas y no sólo .webp porque la carpeta la llena una persona con
 * lo que tenga a mano: un JPG de cámara o un PNG de un export. El optimizador
 * de next/image reconvierte a AVIF/WebP de todas formas, así que exigir un
 * formato concreto sólo servía para que la foto no apareciera y nadie supiera
 * por qué.
 */
export const CASE_IMAGE_EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png"] as const;

/** Nombre de fichero, sin extensión, que se busca para un caso. */
export function caseImageBase(projectName: string): string {
  return slugify(projectName);
}
