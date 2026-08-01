// Contenido de la landing (copy con tono Miel Mostaza). Datos de prueba.

export const HERO = {
  title: "Vamos a cocinar algo grande para tu negocio",
  subtitle: "Soluciones digitales hechas a tu medida, con la receta justa de estrategia y creatividad.",
};

export interface Testimonial {
  name: string;
  company: string;
  quote: string;
  rating: number;
  avatar: string;
}

/**
 * Testimonios de clientes. Vacío hasta que haya reales.
 *
 * Aquí había tres inventados —Laura Gómez de "Panadería La Espiga", Andrés Ruiz
 * de "Sabor Local" y "Clínica Sonrisa"—, con nombre, empresa, cita y cinco
 * estrellas. Nacieron como relleno para construir la sección, pero acabaron
 * publicándose: personas que no existen recomendando un servicio, junto a
 * casos que sí son reales, que es justo lo que los hace creíbles.
 *
 * El componente que los pintaba ya no existe: al pasar la home a claro se quedó
 * con el vocabulario del tramo oscuro y montarlo habría metido una banda negra
 * entre dos cielos. El array se queda porque la decisión editorial —no publicar
 * testimonios inventados— es lo que hay que poder revisitar, no el componente,
 * que se rehace en un rato.
 *
 * Para recuperar la sección: testimonios de verdad aquí, con permiso de quien
 * los firma, y un componente nuevo con el vocabulario claro (`sky-glass`,
 * `text-ink/*`). Formato:
 *
 *   { name: "Nombre real", company: "Su empresa", quote: "Lo que dijeron",
 *     rating: 5, avatar: "🙂" }
 */
export const TESTIMONIALS: Testimonial[] = [];

// ── 02 · Nuestro proceso ─────────────────────────────────────────────────────
// Los cuatro pasos son de la propia agencia, no datos de nadie: van aquí como
// copy y no en la BD porque no cambian por cliente ni por proyecto.

export interface ProcessStep {
  /** Id de icono. Se resuelve en ProcessSection contra los iconos que ya
      existen en components/icons: no hay que dibujar ninguno nuevo. */
  icon: "hex" | "palette" | "chip" | "trend";
  title: string;
  detail: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: "hex",
    title: "Descubrimos tu esencia",
    detail: "Entendemos tu negocio, tus objetivos y a tu público.",
  },
  {
    icon: "palette",
    title: "Diseñamos la estrategia",
    detail: "Creamos el plan perfecto para lograr resultados reales.",
  },
  {
    icon: "chip",
    title: "Desarrollamos con precisión",
    detail: "Construimos tu solución con tecnología moderna y escalable.",
  },
  {
    icon: "trend",
    title: "Lanzamos y optimizamos",
    detail: "Medimos, aprendemos y mejoramos para seguir creciendo.",
  },
];

// ── Impacto · las cifras ─────────────────────────────────────────────────────

export interface ImpactStat {
  /** Cifra ya formateada ("+120", "98 %", "2,5 M"). Se pinta en Agdasima. */
  value: string;
  label: string;
  detail?: string;
}

/**
 * Cifras de impacto.
 *
 * ┌────────────────────────────────────────────────────────────────────────┐
 * │ TODO(datos): ESTAS CIFRAS SON UN MARCADOR. NO SON REALES.              │
 * │ Están publicadas porque el diseño de la sección necesita cuatro cifras │
 * │ para poder verse terminado, no porque alguien las haya medido.         │
 * │ Antes de publicar: sustituirlas por datos verificables, o devolver el  │
 * │ array a [] (la sección se degrada sola a banda de costura y la página  │
 * │ no se rompe).                                                          │
 * │ Es la MISMA regla que TESTIMONIALS, y aquí se incumple a sabiendas y   │
 * │ de forma temporal.                                                     │
 * └────────────────────────────────────────────────────────────────────────┘
 *
 * Con la lista vacía, ImpactSection no desaparece: se queda reducida a la banda
 * que une el cielo de los casos con el del cierre, porque además de capítulo es
 * la junta entre esas dos fotos. Ver la nota de ese componente.
 */
export const IMPACT_STATS: ImpactStat[] = [
  { value: "+120", label: "Proyectos completados" },
  { value: "+98 %", label: "Clientes satisfechos" },
  { value: "+2,5 M", label: "Usuarios impactados" },
  { value: "+30 %", label: "Crecimiento promedio" },
];

/** La frase que remata el carrusel de ingredientes, junto a los puntos. */
export const INGREDIENTS_NOTE =
  "Combinamos creatividad, estrategia y tecnología para resultados que se notan.";

// ── Preguntas frecuentes ─────────────────────────────────────────────────────
// Se pintan con <details>/<summary> nativos: cero JS, accesibles de fábrica y
// funcionan sin hidratar. Los precios salen de SERVICE_DETAILS (más abajo), así
// que si allí cambian hay que revisarlos aquí.

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "¿Qué servicios ofrecen exactamente?",
    answer:
      "Desarrollo web, apps móviles, inteligencia artificial aplicada, campañas de Meta Ads, automatizaciones, branding y contenido. Cada uno es un ingrediente: lo normal es combinar varios en una misma receta.",
  },
  {
    question: "¿Cuánto cuesta un proyecto?",
    answer:
      "Depende del alcance, pero hay suelos orientativos: una web desde $1.500.000 COP, una app desde $4.000.000 COP, campañas desde $800.000 COP al mes. En la ficha de cada servicio está el detalle. Tras la primera conversación pasamos una propuesta cerrada.",
  },
  {
    question: "¿Cuánto tardan en entregar?",
    answer:
      "Una landing suele estar en dos o tres semanas; una web corporativa, entre cuatro y seis; una app o una plataforma a medida, a partir de dos meses. El plazo se cierra por escrito antes de empezar.",
  },
  {
    question: "¿Cómo es el proceso de trabajo?",
    answer:
      "Cuatro pasos: entendemos tu negocio, diseñamos la estrategia, desarrollamos con precisión, y lanzamos midiendo para seguir mejorando. Vas viendo avances durante todo el camino, no sólo al final.",
  },
  {
    question: "¿Trabajan sólo en Cali?",
    answer:
      "Estamos en Cali, Colombia, y trabajamos en remoto con clientes de donde sea. Parte de los proyectos publicados son de fuera del país.",
  },
  {
    question: "¿Qué pasa después de la entrega?",
    answer:
      "El proyecto se entrega funcionando y documentado. A partir de ahí puedes seguir por tu cuenta o quedarte con nosotros para mantenimiento, mejoras y medición. No hay permanencia.",
  },
  {
    question: "¿Cómo empiezo?",
    answer:
      "Escríbenos por WhatsApp o por correo y cuéntanos qué necesitas. La primera conversación no cuesta nada, y de ahí sale una propuesta concreta.",
  },
];

// ── Blog ─────────────────────────────────────────────────────────────────────

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
}

/**
 * Entradas del blog. Vacío hasta que haya alguna de verdad.
 *
 * Mismo criterio que TESTIMONIALS: el pie sólo enlaza "Blog" si este array
 * tiene algo, y el sitemap sólo incluye /blog en ese caso. Un blog vacío
 * enlazado desde el pie es prometer contenido que no existe — la versión pasiva
 * del mismo problema que los testimonios inventados.
 */
export const POSTS: Post[] = [];

// Detalle por servicio (keyed por slug) para /servicios/[slug].
export interface ServiceDetail {
  intro: string;
  what: string[];
  why: string;
  price: string;
}

export const SERVICE_DETAILS: Record<string, ServiceDetail> = {
  "desarrollo-web": {
    intro: "Tu sitio web es tu mejor vendedor: trabaja 24/7 y nunca se cansa.",
    what: ["Landing pages y sitios corporativos", "Tiendas online (e-commerce)", "Plataformas y paneles a medida", "Optimización SEO y velocidad"],
    why: "Diseñamos pensando en tus clientes y en convertir visitas en ventas.",
    price: "Desde $1.500.000 COP",
  },
  apps: {
    intro: "Lleva tu negocio al bolsillo de tus clientes.",
    what: ["Apps iOS y Android", "Progressive Web Apps", "Integración con tus sistemas", "Notificaciones y fidelización"],
    why: "Apps rápidas y fáciles de usar que la gente quiere abrir cada día.",
    price: "Desde $4.000.000 COP",
  },
  ia: {
    intro: "La inteligencia artificial, aplicada a lo que de verdad mueve tu negocio.",
    what: ["Chatbots y asistentes", "Automatización con IA", "Análisis y predicción", "Integración con WhatsApp"],
    why: "Ahorra tiempo y atiende mejor sin multiplicar tu equipo.",
    price: "Desde $2.000.000 COP",
  },
  "meta-ads": {
    intro: "Publicidad en Facebook e Instagram que convierte, no que gasta.",
    what: ["Estrategia y segmentación", "Creativos que enganchan", "Optimización continua", "Reportes claros"],
    why: "Cada peso invertido trabaja para traerte clientes reales.",
    price: "Desde $800.000 COP/mes",
  },
  automatizaciones: {
    intro: "Deja que el trabajo repetitivo se haga solo.",
    what: ["Flujos con Zapier / Make / n8n", "Integración de herramientas", "CRM y correos automáticos", "Reportes automatizados"],
    why: "Recupera horas de tu semana y reduce errores.",
    price: "Desde $1.000.000 COP",
  },
  branding: {
    intro: "Una marca con sabor propio que la gente recuerda.",
    what: ["Naming e identidad visual", "Logo y manual de marca", "Voz y tono", "Papelería y plantillas"],
    why: "Destaca en un mercado lleno de opciones genéricas.",
    price: "Desde $1.200.000 COP",
  },
  contenido: {
    intro: "Cuenta tu historia con contenido que enamora.",
    what: ["Video y reels", "Fotografía de producto", "Copywriting", "Calendario de contenidos"],
    why: "Contenido consistente que construye comunidad y confianza.",
    price: "Desde $900.000 COP/mes",
  },
};
