"use client";

import type { ReactNode } from "react";
import { usePointerGlow } from "./usePointerGlow";

// Tarjeta de vidrio del bloque de copy. Tres capas anidadas, cada una con una
// responsabilidad, para que los transforms no se pisen (mismo criterio que
// HeroBee):
//   1. exterior — posicionamiento (el `className` que llega de Hero) + perspectiva;
//   2. media    — rotación 3D: ángulo base fijo + inclinación según el cursor;
//   3. interior — la superficie de vidrio y sus reflejos.
//
// El velo cálido que antes cubría la izquierda del hero ya no existe: el
// contraste del titular y el lead sobre el video lo aporta esta superficie
// (blanco translúcido + tinte miel), así que su opacidad no es sólo decorativa.
export default function HeroGlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = usePointerGlow<HTMLDivElement>();

  return (
    <div ref={ref} className={`hero-glass-card ${className ?? ""}`}>
      <div className="hero-glass-card__tilt">
        <div className="hero-glass-card__surface">
          {/* Banda diagonal fija: es lo que hace que se lea como vidrio incluso
              con el cursor quieto (o ausente, en táctil). */}
          <span aria-hidden className="hero-glass-card__sheen" />
          {/* Reflejo especular que sigue al puntero. */}
          <span aria-hidden className="hero-glass-card__glare" />
          {/* El contenido flota sobre la superficie para que el 3D se lea. */}
          <div className="hero-glass-card__content">{children}</div>
        </div>
      </div>
    </div>
  );
}
