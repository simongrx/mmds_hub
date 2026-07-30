// Contenido del hero de Miel Mostaza.
// Todo el texto visible va en español. Los valores marcados como TODO-CONTENIDO
// son placeholders razonables para poder construir; deben confirmarse con el cliente.

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

// TODO-CONTENIDO: número de WhatsApp destino (formato internacional sin '+', ej. 57XXXXXXXXXX).
export const WHATSAPP_NUMBER = "570000000000";

// TODO-CONTENIDO: mensaje precargado del chat.
export const WHATSAPP_MESSAGE = "Hola, quiero más información sobre sus servicios.";

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

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
