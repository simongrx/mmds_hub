import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Los 7 servicios (ingredientes) de Miel Mostaza — ver docs/SPEC.md.
const services = [
  { name: "Desarrollo Web", slug: "desarrollo-web", icon: "🌐", order: 1, description: "Sitios y plataformas web rápidas, seguras y hechas a tu medida." },
  { name: "Apps", slug: "apps", icon: "📱", order: 2, description: "Aplicaciones móviles que tus clientes van a querer usar todos los días." },
  { name: "IA", slug: "ia", icon: "🤖", order: 3, description: "Automatiza y potencia tu negocio con inteligencia artificial aplicada." },
  { name: "Meta Ads", slug: "meta-ads", icon: "📈", order: 4, description: "Campañas en Facebook e Instagram que convierten, no que gastan." },
  { name: "Automatizaciones", slug: "automatizaciones", icon: "⚡", order: 5, description: "Conecta tus herramientas y deja que el trabajo repetitivo se haga solo." },
  { name: "Branding", slug: "branding", icon: "🎨", order: 6, description: "Una marca con sabor propio: identidad, logo y voz que se recuerdan." },
  { name: "Contenido", slug: "contenido", icon: "🎥", order: 7, description: "Video, foto y copy que cuentan tu historia y enamoran a tu audiencia." },
];

// Casos reales del portfolio público.
//
// El `name` no es sólo un rótulo: la foto de cada caso se busca en
// apps/web/public/images/casos con ese nombre pasado a kebab-case (ver
// caseImages.ts y el README de esa carpeta). Si se renombra un proyecto aquí,
// hay que renombrar también su archivo o la tarjeta se queda sin foto.
const showcaseProjects = [
  {
    name: "Cali Enamora",
    description:
      "Sitio de la corporación ciudadana que promueve el turismo sostenible en Cali y el Valle del Cauca: rutas, sabores, eventos y afiliación.",
    url: "https://calienamoravalle.vercel.app",
    serviceSlugs: ["desarrollo-web"],
  },
  {
    name: "Cali Rent a Car",
    description:
      "Web de alquiler de autos con catálogo de flota filtrable por categoría y transmisión, y reserva directa por WhatsApp.",
    url: "https://calirenting.vercel.app",
    serviceSlugs: ["desarrollo-web"],
  },
  {
    name: "Apex Debt Solutions",
    description:
      "Sitio en inglés para una consultora estadounidense que orienta a deudores sobre los programas federales de pago de préstamos estudiantiles.",
    url: "https://www.apexdebtsolutions.net",
    serviceSlugs: ["desarrollo-web"],
  },
];

async function main() {
  // Usuario admin semilla (Fase 1: contraseña hasheada con bcrypt).
  const passwordHash = bcrypt.hashSync("mielmostaza123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mielmostaza.com" },
    update: { password: passwordHash },
    create: {
      email: "admin@mielmostaza.com",
      password: passwordHash,
      name: "Admin Miel Mostaza",
      role: "owner",
    },
  });
  console.log(`✅ Usuario admin: ${admin.email} (password: mielmostaza123)`);

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { description: s.description },
      create: s,
    });
  }
  console.log(`✅ ${services.length} servicios sembrados.`);

  // Cliente al que cuelgan los casos del portfolio.
  //
  // `company` se deja vacío a propósito: ese campo se pinta como antetítulo de
  // cada tarjeta, y antes decía "Portfolio demo", que en una web real se lee
  // como que el trabajo es de mentira. En estos casos el nombre del proyecto ya
  // es la marca, así que un antetítulo sobra.
  const showcaseClient = await prisma.client.upsert({
    where: { id: "demo-showcase-client" },
    update: { name: "Casos Miel Mostaza", company: null },
    create: {
      id: "demo-showcase-client",
      name: "Casos Miel Mostaza",
      company: null,
    },
  });

  for (const p of showcaseProjects) {
    const existing = await prisma.project.findFirst({ where: { name: p.name } });
    const common = {
      description: p.description,
      url: p.url,
      status: "delivered",
      showcase: true,
    };
    const connect = p.serviceSlugs.map((slug) => ({ slug }));

    // Se actualiza en lugar de saltar el que ya existe: antes, cambiar una
    // descripción o un enlace aquí no tenía ningún efecto sobre una base de
    // datos ya sembrada, y el seed dejaba de ser la fuente de verdad sin que
    // nada lo dijera.
    if (existing) {
      await prisma.project.update({
        where: { id: existing.id },
        // `set: []` antes de conectar deja exactamente los servicios de la
        // lista, sin arrastrar los que tuviera de una siembra anterior. No
        // vale en `create`, que parte de cero: de ahí que no se comparta.
        data: { ...common, services: { set: [], connect } },
      });
    } else {
      await prisma.project.create({
        data: {
          ...common,
          name: p.name,
          clientId: showcaseClient.id,
          deliveryDate: new Date(),
          services: { connect },
        },
      });
    }
  }

  // Retira del portfolio los casos que ya no están en la lista (los tres de
  // demostración que hubo antes). No se borran: pueden tener entregables o
  // documentos colgando, así que sólo se ocultan.
  const names = showcaseProjects.map((p) => p.name);
  const retired = await prisma.project.updateMany({
    where: { showcase: true, name: { notIn: names } },
    data: { showcase: false },
  });

  console.log(`✅ ${showcaseProjects.length} casos del portfolio sembrados.`);
  if (retired.count > 0) {
    console.log(`   (${retired.count} caso(s) antiguo(s) retirado(s) del portfolio)`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
