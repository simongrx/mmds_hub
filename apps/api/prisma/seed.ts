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

// Proyectos demo para el portfolio público (showcase).
const showcaseProjects = [
  {
    name: "Tienda online La Espiga",
    description: "E-commerce completo con pasarela de pago y catálogo autogestionable para una panadería artesanal.",
    serviceSlugs: ["desarrollo-web", "branding"],
  },
  {
    name: "Campaña Meta Ads Sabor Local",
    description: "Estrategia de anuncios que triplicó los pedidos en 3 meses para un restaurante de comida regional.",
    serviceSlugs: ["meta-ads", "contenido"],
  },
  {
    name: "Asistente IA para Clínica Sonrisa",
    description: "Chatbot con IA que agenda citas y responde dudas frecuentes 24/7, integrado a WhatsApp.",
    serviceSlugs: ["ia", "automatizaciones"],
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

  // Cliente demo + proyectos showcase para el portfolio de la landing.
  const demoClient = await prisma.client.upsert({
    where: { id: "demo-showcase-client" },
    update: {},
    create: {
      id: "demo-showcase-client",
      name: "Casos Miel Mostaza",
      company: "Portfolio demo",
    },
  });

  for (const p of showcaseProjects) {
    const existing = await prisma.project.findFirst({ where: { name: p.name } });
    if (existing) continue;
    await prisma.project.create({
      data: {
        name: p.name,
        description: p.description,
        clientId: demoClient.id,
        status: "delivered",
        showcase: true,
        deliveryDate: new Date(),
        services: { connect: p.serviceSlugs.map((slug) => ({ slug })) },
      },
    });
  }
  console.log(`✅ ${showcaseProjects.length} proyectos showcase sembrados.`);
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
