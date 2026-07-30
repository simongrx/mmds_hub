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
 * El `name` tiene que coincidir con el del seed además de leerse bien: la foto
 * de cada caso se busca en public/images/casos con ese nombre en kebab-case
 * (ver caseImages.ts). "Cali Enamora" → cali-enamora.png. Si se cambia uno,
 * hay que cambiar el otro.
 *
 * Se omite `client` a propósito: ese campo se pinta como antetítulo y en estos
 * casos el nombre del proyecto ya es la marca, así que sobra.
 *
 * Los `id` alimentan el hash de CaseVisual: tienen que ser estables, no
 * importa su forma.
 */
export const FALLBACK_PORTFOLIO: PortfolioItem[] = [
  {
    id: "fallback-cali-enamora",
    name: "Cali Enamora",
    description:
      "Sitio de la corporación ciudadana que promueve el turismo sostenible en Cali y el Valle del Cauca: rutas, sabores, eventos y afiliación.",
    url: "https://calienamoravalle.vercel.app",
    services: [{ name: "Desarrollo Web", slug: "desarrollo-web", icon: "🌐" }],
  },
  {
    id: "fallback-cali-rent-a-car",
    name: "Cali Rent a Car",
    description:
      "Web de alquiler de autos con catálogo de flota filtrable por categoría y transmisión, y reserva directa por WhatsApp.",
    url: "https://calirenting.vercel.app",
    services: [{ name: "Desarrollo Web", slug: "desarrollo-web", icon: "🌐" }],
  },
  {
    id: "fallback-apex-debt-solutions",
    name: "Apex Debt Solutions",
    description:
      "Sitio en inglés para una consultora estadounidense que orienta a deudores sobre los programas federales de pago de préstamos estudiantiles.",
    url: "https://www.apexdebtsolutions.net",
    services: [{ name: "Desarrollo Web", slug: "desarrollo-web", icon: "🌐" }],
  },
];
