"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// Rail de progreso de la página, justo debajo del navbar. El recorrido de la
// home pasa por un tramo anclado (el track de proyectos) donde el scroll
// vertical mueve contenido horizontal: sin un indicador global, ahí se pierde
// la referencia de cuánto queda.
//
// Decorativo: el progreso ya lo comunica la propia página, así que va fuera del
// árbol de accesibilidad en vez de anunciarse como progressbar.

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  // El muelle quita el nerviosismo del valor crudo sin llegar a retrasarlo.
  const width = useSpring(scrollYProgress, { stiffness: 320, damping: 42, mass: 0.4 });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[72px] z-40 h-[2px] bg-white/5"
    >
      <motion.div
        style={{ scaleX: width }}
        className="h-full origin-left bg-gradient-to-r from-mustard-dark via-honey to-mustard shadow-[0_0_12px_rgba(244,196,48,0.7)]"
      />
    </div>
  );
}
