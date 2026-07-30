"use client";

import { ServiceIcon } from "@/components/icons/serviceIcons";
import { HexOutline } from "@/components/icons";
import type { PortfolioItem } from "@/lib/serverApi";

// Visual de reserva de cada caso del portfolio.
//
// El modelo de datos no tiene imágenes (ver PortfolioItem en lib/serverApi.ts) y
// no vamos a inventar contenido, así que el visual se genera: un panel de vidrio
// oscuro con el icono del servicio principal a gran tamaño, baldosas
// hexagonales y trazas de circuito. Es el mismo lenguaje del podio del hero.
//
// Desde el rediseño en mosaico esto es el plan B: si hay una foto en
// public/images/casos (ver lib/caseImages.ts) manda la foto, y este panel cubre
// a los proyectos que aún no la tienen. Por eso admite `className`: dentro de
// una celda del bento tiene que llenarla, no imponer su propia proporción.
//
// La variación entre casos es determinista a partir del id: así cada proyecto
// tiene su propia composición pero no cambia entre renders (ni entre servidor y
// cliente, que con Math.random daría error de hidratación).

/** Hash estable de una cadena → entero pequeño. */
function seedFrom(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Tres composiciones de trazas. Se elige una por caso con el hash.
const TRACES = [
  "M0 60h58l16-16h46M0 128h40l18 20h64M0 186h74l14-14h44",
  "M0 44h70l14 16h52M0 112h30l22-22h70M0 172h52l20 20h56",
  "M0 74h44l20 20h60M0 134h72l14-14h40M0 196h34l18-18h62",
];

export default function CaseVisual({
  project,
  /** Sustituye a la caja por defecto (proporción 4:3 a ancho completo) cuando
      el visual va dentro de una celda que ya tiene su propia forma. */
  className = "tech-glass tech-glow aspect-[4/3] w-full",
}: {
  project: PortfolioItem;
  className?: string;
}) {
  const seed = seedFrom(project.id);
  const primary = project.services[0];
  const trace = TRACES[seed % TRACES.length];
  // Rotación del anillo: sólo cambia el ángulo de partida, no hay animación.
  const ringTilt = (seed % 5) * 9 - 18;

  return (
    <div aria-hidden className={`relative isolate overflow-hidden ${className}`}>
      {/* Baldosas hexagonales de fondo, herencia directa del suelo del podio.
          La rejilla es de paso fijo (88px) y no de cuatro columnas: desde que
          el visual vive dentro de una celda del bento, la caja va de 21:9 a
          4:3 según el sitio, y con un número fijo de columnas la textura se
          quedaba en cuatro hexágonos perdidos en una banda ancha. Sobran
          baldosas a propósito; las que no caben las recorta el overflow. */}
      <div className="absolute inset-0 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] auto-rows-[88px] place-items-center gap-2 p-6 opacity-[0.13]">
        {Array.from({ length: 48 }).map((_, i) => (
          <HexOutline
            key={i}
            className={`h-full w-full text-honey ${(i + seed) % 3 === 0 ? "opacity-100" : "opacity-40"}`}
          />
        ))}
      </div>

      {/* Trazas de circuito: misma paleta y grosor que HeroDecorations. */}
      <svg
        viewBox="0 0 200 240"
        className="absolute inset-0 h-full w-full"
        fill="none"
        stroke="#D99B11"
        preserveAspectRatio="none"
        focusable="false"
      >
        <path
          d={trace}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>

      {/* Anillo elíptico + halo: el "escenario" donde se apoya el icono, que es
          la cita más literal del podio del hero. */}
      <div
        className="absolute left-1/2 top-1/2 h-[62%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-honey/25"
        style={{ transform: `translate(-50%, -50%) rotate(${ringTilt}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,196,48,0.28),transparent_68%)] blur-xl" />

      {/* Icono del servicio principal. El fallback a emoji del ServiceIcon
          también funciona a este tamaño porque hereda font-size. */}
      <div className="absolute inset-0 grid place-items-center">
        {primary ? (
          <ServiceIcon
            slug={primary.slug}
            icon={primary.icon}
            className="h-[38%] w-[38%] text-[5rem] text-honey drop-shadow-[0_0_28px_rgba(244,196,48,0.5)]"
          />
        ) : (
          <HexOutline className="h-[34%] w-[34%] text-honey/70" />
        )}
      </div>

      {/* Viñeteado inferior para que el panel no se corte en seco. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
    </div>
  );
}
