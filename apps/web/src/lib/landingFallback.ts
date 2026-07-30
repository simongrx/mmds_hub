import type { PortfolioItem } from "./serverApi";
import type { Service } from "./types";

// Contenido de reserva de la landing.
//
// La home es la cara pública y se renderiza en cada petición contra la API
// (serverApi.ts). Si esa API no responde —porque aún no está desplegada, o se
// cayó— la alternativa era enseñar las secciones 01 y 02 vacías: una web de
// agencia sin servicios ni casos. Un fallo silencioso y muy caro de detectar,
// porque el build pasa igual y nada avisa.
//
// Así que la web trae empaquetada una copia de los 7 ingredientes y los casos.
// Es un espejo de apps/api/prisma/seed.ts: si allí se cambian los servicios,
// hay que reflejarlo aquí. Se acepta esa duplicación a propósito — son datos
// que cambian una vez al año y el coste de que no cuadren es cosmético,
// mientras que el de no tenerlos es una landing rota en producción.
//
// Esto NO sustituye a la API: en cuanto responde, mandan sus datos (los edita
// el panel). Sólo cubre el hueco cuando no hay nadie al otro lado.

/** Los 7 ingredientes. Refleja `services` en apps/api/prisma/seed.ts. */
export const FALLBACK_SERVICES: Service[] = [
  {
    id: "fallback-desarrollo-web",
    name: "Desarrollo Web",
    slug: "desarrollo-web",
    icon: "🌐",
    order: 1,
    description: "Sitios y plataformas web rápidas, seguras y hechas a tu medida.",
  },
  {
    id: "fallback-apps",
    name: "Apps",
    slug: "apps",
    icon: "📱",
    order: 2,
    description: "Aplicaciones móviles que tus clientes van a querer usar todos los días.",
  },
  {
    id: "fallback-ia",
    name: "IA",
    slug: "ia",
    icon: "🤖",
    order: 3,
    description: "Automatiza y potencia tu negocio con inteligencia artificial aplicada.",
  },
  {
    id: "fallback-meta-ads",
    name: "Meta Ads",
    slug: "meta-ads",
    icon: "📈",
    order: 4,
    description: "Campañas en Facebook e Instagram que convierten, no que gastan.",
  },
  {
    id: "fallback-automatizaciones",
    name: "Automatizaciones",
    slug: "automatizaciones",
    icon: "⚡",
    order: 5,
    description: "Conecta tus herramientas y deja que el trabajo repetitivo se haga solo.",
  },
  {
    id: "fallback-branding",
    name: "Branding",
    slug: "branding",
    icon: "🎨",
    order: 6,
    description: "Una marca con sabor propio: identidad, logo y voz que se recuerdan.",
  },
  {
    id: "fallback-contenido",
    name: "Contenido",
    slug: "contenido",
    icon: "🎥",
    order: 7,
    description: "Video, foto y copy que cuentan tu historia y enamoran a tu audiencia.",
  },
];

/**
 * Casos del portafolio. Refleja `showcaseProjects` en el seed.
 *
 * Se omite `client` a propósito: en el seed esos proyectos cuelgan de un cliente
 * llamado "Portfolio demo", y ese texto se pinta como antetítulo de cada
 * tarjeta. Publicar "PORTFOLIO DEMO" sobre los casos de una web real queda a
 * medio hacer, y no corresponde inventar nombres de clientes. Sin `client` el
 * antetítulo sencillamente no se renderiza (ver CaseCard).
 *
 * Los `id` alimentan el hash de CaseVisual y la búsqueda de fotos en
 * public/images/casos: tienen que ser estables, no importa su forma.
 */
export const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    id: "fallback-asistente-ia-clinica-sonrisa",
    name: "Asistente IA para Clínica Sonrisa",
    description:
      "Chatbot con IA que agenda citas y responde dudas frecuentes 24/7, integrado a WhatsApp.",
    services: [
      { name: "IA", slug: "ia", icon: "🤖" },
      { name: "Automatizaciones", slug: "automatizaciones", icon: "⚡" },
    ],
  },
  {
    id: "fallback-campana-meta-ads-sabor-local",
    name: "Campaña Meta Ads Sabor Local",
    description:
      "Estrategia de anuncios que triplicó los pedidos en 3 meses para un restaurante de comida regional.",
    services: [
      { name: "Meta Ads", slug: "meta-ads", icon: "📈" },
      { name: "Contenido", slug: "contenido", icon: "🎥" },
    ],
  },
  {
    id: "fallback-tienda-online-la-espiga",
    name: "Tienda online La Espiga",
    description:
      "E-commerce completo con pasarela de pago y catálogo autogestionable para una panadería artesanal.",
    services: [
      { name: "Desarrollo Web", slug: "desarrollo-web", icon: "🌐" },
      { name: "Branding", slug: "branding", icon: "🎨" },
    ],
  },
];
