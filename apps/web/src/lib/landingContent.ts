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
 * Con la lista vacía, TestimonialsSection no renderiza nada y el capítulo 03
 * desaparece de la home. Para recuperarlo basta añadir testimonios de verdad,
 * con permiso de quien los firma:
 *
 *   { name: "Nombre real", company: "Su empresa", quote: "Lo que dijeron",
 *     rating: 5, avatar: "🙂" }
 */
export const TESTIMONIALS: Testimonial[] = [];

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
