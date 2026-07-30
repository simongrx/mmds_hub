// El mapa servicio → ingrediente.
//
// La metáfora está en docs/SPEC.md ("cada servicio es un ingrediente") pero
// hasta ahora sólo existía como palabra en el titular de la sección. Aquí vive
// el dato: nombre del ingrediente y su media línea de sabor.
//
// Va en su propio módulo y no dentro de landingContent.ts porque aquello es
// copy de la ficha /servicios/[slug] (SERVICE_DETAILS); esto es identidad
// visual de la landing y lo consumen el bento y su ilustración.
//
// Las claves son los slugs sembrados en la API (apps/api/prisma/seed.ts). Un
// servicio creado desde el panel con otro slug no rompe nada: el bento cae al
// icono de servicio y al nombre del servicio (ver ServiceBentoCard).

export interface Ingredient {
  /** Nombre del ingrediente. Es el titular grande de la tarjeta. */
  name: string;
  /** Media línea de sabor bajo el titular. */
  tagline: string;
}

export const INGREDIENTS: Record<string, Ingredient> = {
  "desarrollo-web": { name: "Pan", tagline: "La base sobre la que se monta todo." },
  apps: { name: "Papas", tagline: "Lo que engancha y hace volver." },
  ia: { name: "Ají", tagline: "El toque que lo despierta todo." },
  "meta-ads": { name: "Pimienta", tagline: "Intensidad justo donde hace falta." },
  automatizaciones: { name: "Limón", tagline: "Corta el trabajo repetitivo." },
  branding: { name: "Miel", tagline: "El sabor por el que te recuerdan." },
  contenido: { name: "Especias", tagline: "Carácter en cada pieza." },
};

export function getIngredient(slug: string): Ingredient | undefined {
  return INGREDIENTS[slug];
}
