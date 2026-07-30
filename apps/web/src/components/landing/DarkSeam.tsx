"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ChevronDownIcon } from "@/components/icons/serviceIcons";
import { CircuitsLeft, CircuitsRight } from "./HeroDecorations";

// Puente entre el hero luminoso y el tramo oscuro. Existe para que el cambio de
// atmósfera sea un descenso y no un corte: el hero ya funde a `mist` por abajo
// (Hero.tsx), así que esta sección arranca en ese mismo gris y desciende a
// `void`. Así el hero no se toca en absoluto.
//
// Los circuitos del hero reaparecen aquí a baja opacidad: son la pieza formal
// que dice "seguimos en el mismo sitio, sólo se ha apagado la luz".

export default function DarkSeam() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // La rejilla técnica "se enciende" a medida que entramos: es el primer aviso
  // de que el lenguaje visual cambia.
  const gridOpacity = useTransform(scrollYProgress, [0.15, 0.7], [0, 1]);
  // El indicador de scroll se apaga en cuanto se ha entendido el gesto.
  const hintOpacity = useTransform(scrollYProgress, [0.1, 0.45], [1, 0]);
  const circuitsY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative isolate h-[46vh] min-h-[280px] overflow-hidden bg-gradient-to-b from-mist via-[#1B1B1D] to-void"
    >
      {/* Rejilla: se monta con opacidad 0 y sube con el scroll. Sin
          reduced-motion queda fija y visible, que es el estado final. */}
      <motion.div
        style={{ opacity: reduced ? 1 : gridOpacity }}
        className="tech-grid absolute inset-0"
      />

      {/* Trazas del hero, muy tenues y con parallax suave en direcciones
          opuestas para que el descenso tenga profundidad. */}
      <motion.div style={{ y: reduced ? 0 : circuitsY }} className="absolute inset-0">
        <CircuitsLeft className="absolute left-0 top-[30%] w-[16%] opacity-25" />
        <CircuitsRight className="absolute right-0 top-[18%] w-[15%] opacity-25" />
      </motion.div>

      {/* Halo miel en el punto de transición: el "horizonte" del descenso. */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-honey/35 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-40 w-[60%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(244,196,48,0.16),transparent_70%)]" />

      <motion.div
        style={{ opacity: reduced ? 0 : hintOpacity }}
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 text-white/45"
      >
        <span className="font-display text-[0.7rem] uppercase tracking-[0.42em]">
          Sigue bajando
        </span>
        {/* Deriva vertical corta y lenta: es un indicador, no una animación de
            adorno, y desaparece sola al avanzar. */}
        <motion.span
          animate={reduced ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDownIcon className="h-5 w-5" />
        </motion.span>
      </motion.div>
    </div>
  );
}
