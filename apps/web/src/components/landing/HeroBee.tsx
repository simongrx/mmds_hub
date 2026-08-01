"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { HERO_ASSETS } from "@/content/hero";
import { usePointerLerp } from "@/hooks/usePointerLerp";

// Desplazamiento máximo del parallax de cursor, en px.
const MAX_SHIFT = 16;

// Abeja del hero. CUATRO capas anidadas, cada una con su propio `transform`,
// para que no se pisen entre ellas:
//   1. exterior — posicionamiento (las clases que llegan por `className`, que
//      incluyen el -translate-*-1/2 de centrado);
//   2. vuelo    — el descenso dirigido por el scroll del hero (framer-motion);
//   3. parallax — cursor (JS + rAF, ver `usePointerLerp`);
//   4. interior — flotación en bucle (keyframes CSS, ver globals.css).
// Si el parallax escribiera sobre la capa 1 borraría el centrado, y si el vuelo
// compartiera capa con el parallax se pisarían a cada frame.
//
// ── El vuelo ──
//
// El hero lleva `overflow-hidden`, así que la abeja NO puede salirse de él para
// entrar en la sección de ingredientes: desciende dentro del hero y se apaga
// antes del cambio de sección. Quien la releva es la abeja del tarro que ya está
// pintada en `fondo2.webp`, justo debajo. La entrega se lee igual y no hay que
// tocar el carril anclado del arco de servicios para conseguirla.
//
// Sólo de `lg` en adelante: por debajo la abeja va en flujo, encima del copy, y
// moverla desmontaría el apilado en vez de contar nada.

export default function HeroBee({
  className,
  progress,
}: {
  className?: string;
  /** Progreso del scroll del hero (0 arriba del todo, 1 cuando ya ha pasado).
      Sin él la abeja se queda quieta, que es lo que hace en cualquier otro sitio. */
  progress?: MotionValue<number>;
}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const read = () => setDesktop(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  usePointerLerp((x, y) => {
    const el = parallaxRef.current;
    if (!el) return;
    el.style.transform = `translate3d(${(x * MAX_SHIFT).toFixed(2)}px, ${(y * MAX_SHIFT).toFixed(2)}px, 0)`;
  });

  const flying = Boolean(progress) && desktop && !reduced;
  // Los hooks van fuera del condicional; `progress` puede no existir, así que se
  // les da un valor constante y el resultado sencillamente no se usa.
  const flat = useMotionValue(0);
  const source = progress ?? flat;
  const y = useTransform(source, [0, 1], [0, 300]);
  const x = useTransform(source, [0, 1], [0, 96]);
  const rotate = useTransform(source, [0, 1], [0, 14]);
  const scale = useTransform(source, [0, 1], [1, 0.76]);
  // Se apaga bastante antes del final: si llegara viva al canto, se vería
  // desaparecer de golpe contra la unión con la foto.
  const opacity = useTransform(source, [0, 0.42, 0.72], [1, 1, 0]);

  const bee = (
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
  );

  return (
    <div className={className}>
      {flying ? (
        <motion.div style={{ x, y, rotate, scale, opacity }}>{bee}</motion.div>
      ) : (
        <div>{bee}</div>
      )}
    </div>
  );
}
