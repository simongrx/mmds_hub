import type { Metadata } from "next";
import ContactSection from "@/components/landing/ContactSection";
import DarkSeam from "@/components/landing/DarkSeam";
import Hero from "@/components/landing/Hero";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import PortfolioSection from "@/components/landing/PortfolioSection";
import ScrollProgress from "@/components/landing/ScrollProgress";
import ServicesSection from "@/components/landing/ServicesSection";
import SmoothScroll from "@/components/landing/SmoothScroll";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import { resolveCaseImages } from "@/lib/caseImages";
import { getPortfolio, getServices } from "@/lib/serverApi";

export const metadata: Metadata = {
  title: "Miel Mostaza — La receta para crecer digitalmente",
  description:
    "Agencia digital en Cali: desarrollo web, apps, IA, Meta Ads, automatizaciones, branding y contenido. Vamos a cocinar algo grande para tu negocio.",
  openGraph: {
    title: "Miel Mostaza — La receta para crecer digitalmente",
    description: "Soluciones digitales hechas a tu medida.",
    type: "website",
  },
};

export default async function HomePage() {
  const [services, portfolio] = await Promise.all([getServices(), getPortfolio()]);
  // Qué casos tienen foto en public/images/casos. Se mira aquí, en servidor,
  // porque el resolver usa `node:fs`; los que no la tengan caen al visual
  // generado. Ver lib/caseImages.ts y el README de esa carpeta.
  const caseImages = resolveCaseImages(portfolio);

  return (
    // `bg-void` en vez de `bg-mist`: a partir del hero la página es oscura, y
    // este es el color que se ve si una sección no llena su hueco. El hero trae
    // su propio fondo (video) y no se ve afectado.
    <div className="min-h-screen bg-void">
      {/* Scroll con inercia y rail de progreso: sólo en la landing, no en el
          panel (ver SmoothScroll). */}
      <SmoothScroll />
      <ScrollProgress />
      {/* overlay: el navbar flota transparente sobre el hero a sangre. */}
      <Navbar overlay />
      <main>
        <Hero />
        {/* El recorrido: descenso a oscuro, dos mosaicos (ingredientes y
            casos), el único tramo horizontal que queda —los testimonios en
            deriva— y cierre. */}
        <DarkSeam />
        <ServicesSection services={services} />
        <PortfolioSection projects={portfolio} images={caseImages} />
        <TestimonialsSection />
        <ContactSection services={services} />
      </main>
      <LandingFooter />
    </div>
  );
}
