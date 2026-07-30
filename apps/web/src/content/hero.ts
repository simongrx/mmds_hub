// Contenido del hero de Miel Mostaza.
// Todo el texto visible va en español. Los valores marcados como TODO-CONTENIDO
// son placeholders razonables para poder construir; deben confirmarse con el cliente.

import { whatsappLink } from "@/lib/brand";

// ─────────────────────────────────────────────────────────────────────────────
// Título gigante de fondo (detrás de la abeja): dos palabras en mayúsculas a los
// lados, con una etiqueta pequeña debajo de cada una empujada hacia el centro.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_TITLE = {
  leftBig: "CREATIVIDAD",
  leftSmall: "ESTRATEGIA",
  rightBig: "TECNOLOGÍA",
  rightSmall: "RESULTADOS",
};

// Titular real de la página (el <h1>). `highlight` va en color miel.
export const HERO_HEADLINE = {
  pre: "La receta para ",
  highlight: "crecer",
  post: " digitalmente",
};

// Bloque de texto de apoyo.
export const HERO_LEAD =
  "Combinamos creatividad, estrategia y tecnología para impulsar marcas que quieren destacar.";

// ─────────────────────────────────────────────────────────────────────────────
// CTA principal → WhatsApp (objetivo de conversión de toda la página).
// ─────────────────────────────────────────────────────────────────────────────

// El número sale de lib/brand.ts, que es donde viven los datos de contacto.
//
// Antes se declaraba aquí otra vez, y se quedó con un marcador de posición
// (570000000000) mientras brand.ts ya tenía el real: el botón de WhatsApp de
// la barra superior —el CTA principal de la página— llevaba a un número que no
// existe. Con una sola fuente eso no puede volver a pasar.
export const WHATSAPP_MESSAGE = "Hola, quiero más información sobre sus servicios.";

export const WHATSAPP_URL = whatsappLink(WHATSAPP_MESSAGE);

export const CTA_PRIMARY_LABEL = "Hablemos";
export const CTA_SECONDARY_LABEL = "Ver servicios";

// ─────────────────────────────────────────────────────────────────────────────
// Barra de features inferior.
// ─────────────────────────────────────────────────────────────────────────────

// Identificador de icono; se resuelve a un SVG en components/icons. No usamos
// emoji: dependen de la fuente del sistema y no se pueden tematizar.
export type HeroFeatureIcon = "bolt" | "chart" | "heart";

export interface HeroFeature {
  icon: HeroFeatureIcon;
  /** Se renderiza en dos líneas, una por entrada. */
  text: [string, string];
  /** Círculo miel sobre texto oscuro, o al revés. */
  tone: "honey" | "ink";
}

export const HERO_FEATURES: HeroFeature[] = [
  { icon: "bolt", text: ["Estrategias que", "conectan"], tone: "honey" },
  { icon: "chart", text: ["Soluciones que", "transforman"], tone: "ink" },
  { icon: "heart", text: ["Resultados que", "perduran"], tone: "honey" },
];

// ─────────────────────────────────────────────────────────────────────────────
// Assets (servidos desde apps/web/public).
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_ASSETS = {
  videoWebm: "/video/hero-bg.webm",
  videoMp4: "/video/hero-bg.mp4",
  poster: "/video/hero-poster.png",
  // Recorte con alfa de beestatic.png. Las dimensiones son las reales del
  // archivo: van literales en el <img> para reservar el espacio y evitar CLS.
  bee: "/images/bee-static.png",
  beeWidth: 892,
  beeHeight: 835,
};
