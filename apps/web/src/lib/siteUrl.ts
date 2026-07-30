// Origen público del sitio, para sitemap.xml y robots.txt.
//
// Antes cada uno resolvía `NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"`, y
// esa variable no estaba declarada en producción: el sitemap se publicaba
// anunciando URLs de localhost y robots.txt apuntaba el sitemap al mismo sitio.
// Para un buscador eso equivale a no tener sitemap, y no lo avisa nadie — la
// web se ve perfecta mientras tanto.
//
// Por eso se deduce en cascada en lugar de depender de que alguien se acuerde:
//
//   1. NEXT_PUBLIC_SITE_URL — el dominio propio, cuando lo haya. Manda siempre.
//   2. VERCEL_PROJECT_PRODUCTION_URL — lo inyecta Vercel solo, y es el dominio
//      de producción del proyecto (no el de cada despliegue), que es justo el
//      canónico que quiere un buscador.
//   3. localhost — desarrollo.
//
// Sólo se usa desde código de servidor (robots.ts, sitemap.ts), así que las
// variables de Vercel no necesitan el prefijo NEXT_PUBLIC_.

function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  // Vercel la entrega sin protocolo ("mi-proyecto.vercel.app").
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
