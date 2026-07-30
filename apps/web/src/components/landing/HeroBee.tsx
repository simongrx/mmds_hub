"use client";

import { useEffect, useRef } from "react";
import { HERO_ASSETS } from "@/content/hero";

// Desplazamiento máximo del parallax de cursor, en px.
const MAX_SHIFT = 16;
// Factor de interpolación por frame: cuanto más bajo, más "pesada" la abeja.
const LERP = 0.06;

// Abeja del hero. Tres capas anidadas, cada una con su propio `transform`, para
// que no se pisen entre ellas:
//   1. exterior — posicionamiento (las clases que llegan por `className`, que
//      incluyen el -translate-*-1/2 de centrado);
//   2. media    — parallax de cursor (JS + rAF);
//   3. interior — flotación en bucle (keyframes CSS, ver globals.css).
// Si el parallax escribiera sobre la capa 1 borraría el centrado.
export default function HeroBee({ className }: { className?: string }) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    // Sin parallax si el usuario pidió menos movimiento o si el puntero es
    // táctil (ahí el listener apenas se dispararía y sólo gastaría batería).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = ((e.clientX / window.innerWidth) * 2 - 1) * MAX_SHIFT;
      target.y = ((e.clientY / window.innerHeight) * 2 - 1) * MAX_SHIFT;
    };

    const tick = () => {
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className={className}>
      <div ref={parallaxRef}>
        <div className="hero-bee-float">
          {/* <img> en vez de next/image: el asset ya viene recortado al tamaño de
              render y `sharp` no está instalado, así que el optimizador de Next
              no aportaría nada aquí. width/height reales evitan el CLS. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_ASSETS.bee}
            width={HERO_ASSETS.beeWidth}
            height={HERO_ASSETS.beeHeight}
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-auto w-full drop-shadow-[0_30px_45px_rgba(120,90,20,0.3)]"
          />
        </div>
      </div>
    </div>
  );
}
