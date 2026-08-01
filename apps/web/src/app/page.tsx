import type { Metadata } from "next";
import CtaSection from "@/components/landing/CtaSection";
import Hero from "@/components/landing/Hero";
import HoneyGate from "@/components/landing/HoneyGate";
import ImpactSection from "@/components/landing/ImpactSection";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import PortfolioSection from "@/components/landing/PortfolioSection";
import ProcessSection from "@/components/landing/ProcessSection";
import ScrollProgress from "@/components/landing/ScrollProgress";
import ServicesSection from "@/components/landing/ServicesSection";
import SmoothScroll from "@/components/landing/SmoothScroll";
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
    // Crema y no `void`: es el color que se ve si una sección no llena su hueco,
    // y a partir del hero la página es un cielo, así que un hueco tiene que
    // enseñar cielo y no negro. El hero trae su propio fondo (video).
    <div className="min-h-screen bg-[#EFE7D8]">
      {/* Scroll con inercia y rail de progreso: sólo en la landing, no en el
          panel (ver SmoothScroll). */}
      <SmoothScroll />
      <ScrollProgress />
      {/* overlay: el navbar flota transparente sobre el hero a sangre. */}
      <Navbar overlay />
      <main>
        <Hero />
        {/* El portal: una pantalla de miel que inunda, se sostiene con el rótulo
            del capítulo y se retira. Va AQUÍ y no dentro de ninguna de sus dos
            vecinas porque es un tramo de scroll propio (carril + capa anclada).
            Su fondo es #74858D, el mismo con el que muere el hero y con el que
            arranca fondo2, así que no rompe la cadena de costuras de abajo — y
            bajo `prefers-reduced-motion` mide 0 y desaparece del recorrido. */}
        <HoneyGate />
        {/* El recorrido es un solo cielo del hero al pie, encadenado por tres
            fotos y dos secciones blancas. Las blancas no van entre las fotos por
            casualidad: SON las transiciones, y arrancan y terminan en los
            colores exactos con los que muere cada foto (ver skyBackdrops.ts).
            El orden no se puede alterar sin rehacer las costuras.

            Proceso e Impacto NO son bandas entre las fotos: son hojas blancas
            que se superponen a las uniones con márgenes negativos. Las tres
            fotos se tocan solas y en el mismo color (ver skyBackdrops.ts); las
            hojas sólo tapan esa unión por el centro y rematan con el goteo. */}
        <ServicesSection services={services} />
        <ProcessSection />
        <PortfolioSection projects={portfolio} images={caseImages} />
        <ImpactSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
