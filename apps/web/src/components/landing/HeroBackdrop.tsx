"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { usePointerLerp } from "@/hooks/usePointerLerp";
import HeroVideoBackground from "./HeroVideoBackground";
import HoneyDrip from "./HoneyDrip";

// El fondo del hero y, sobre todo, LA TRANSICIÓN al cielo de ingredientes.
//
// Antes esto eran tres divs sueltos dentro de `Hero`: el vídeo de nubes, el
// resplandor solar y un degradado fijo que bajaba hasta #74858D. Funcionaba —el
// color de la última fila pintada es exactamente el de la primera fila de
// `fondo2.webp`, así que la unión no se ve— pero al cruzarlo no pasaba nada.
//
// Ahora es una escena dirigida por el scroll del hero, con tres piezas:
//
//   · las nubes se abren  — el vídeo sube y crece mientras el velo de descenso
//     se estira hacia arriba, así que el cielo de abajo asoma en vez de
//     limitarse a pasar de largo;
//   · el goteo de miel    — el canto del hero suelta miel, que es el mismo
//     motivo que remata las hojas de Proceso e Impacto (ver HoneyDrip);
//   · la abeja            — no está aquí: vuela en `HeroBee`, con el mismo
//     progreso de scroll.
//
// ── El invariante que NO se puede romper ──
//
// La última fila pintada del hero tiene que seguir siendo #74858D pase lo que
// pase durante el scroll, o aparece una raya donde empieza la foto de abajo (la
// tabla de costuras está en skyBackdrops.ts).
//
// Por eso el velo se estira con `scaleY` y origen ABAJO, en vez de moverse: el
// canto inferior se queda clavado donde está y lo que crece es la rampa. Y por
// eso el vídeo, que sí se mueve, sólo puede moverse por DEBAJO del velo.

/** Desplazamiento máximo del parallax de cursor sobre el cielo, en px. */
const SKY_SHIFT = 14;
/** Radio de influencia del cursor sobre un goterón, en fracción del ancho. */
const DROP_REACH = 0.22;

export default function HeroBackdrop({ progress }: { progress: MotionValue<number> }) {
  const reduced = useReducedMotion();
  const skyRef = useRef<HTMLDivElement>(null);
  const dripRef = useRef<HTMLDivElement>(null);
  const dropsRef = useRef<SVGGElement[]>([]);

  // El vídeo sube y crece; el velo lo tapa por abajo, así que el canto que deja
  // libre al subir no se ve.
  const skyY = useTransform(progress, [0, 1], [0, -90]);
  const skyScale = useTransform(progress, [0, 1], [1.04, 1.14]);
  // El resplandor se retira antes: es lo primero que deja de tener sentido
  // cuando el hero se va.
  const glow = useTransform(progress, [0, 0.6], [1, 0]);
  // El velo crece hacia arriba. Origen abajo (ver arriba).
  const veil = useTransform(progress, [0, 1], [1, 1.5]);
  // La miel aparece al empezar a irse, no de entrada.
  const honey = useTransform(progress, [0.04, 0.26], [0, 1]);

  // El estiramiento de los goterones con el scroll va por custom property y no
  // por estado: es un valor por frame y pasar por React sería un render por
  // frame. Lo lee `.honey-drop-stretch` (ver globals.css).
  useMotionValueEvent(progress, "change", (p) => {
    const el = dripRef.current;
    if (el) el.style.setProperty("--honey-stretch", (1 + p * 0.45).toFixed(3));
  });

  // Los tres <g> de los goterones, cacheados: el bucle de puntero los toca en
  // cada frame y no vale hacer un querySelectorAll ahí dentro.
  useEffect(() => {
    const el = dripRef.current;
    if (!el) return;
    dropsRef.current = Array.from(el.querySelectorAll<SVGGElement>("[data-honey-drop]"));
  }, []);

  usePointerLerp((x, y) => {
    const sky = skyRef.current;
    if (sky) {
      sky.style.transform = `translate3d(${(x * SKY_SHIFT).toFixed(2)}px, ${(y * SKY_SHIFT * 0.5).toFixed(2)}px, 0)`;
    }
    // El goterón que tiene el cursor encima se alarga. `data-x` viene ya
    // normalizado a 0..1 desde HoneyDrip, y el puntero llega en -1..1.
    const pointer = (x + 1) / 2;
    for (const drop of dropsRef.current) {
      const distance = Math.abs(Number(drop.dataset.x) - pointer);
      const near = Math.max(0, 1 - distance / DROP_REACH);
      // Los tres factores se multiplican entre sí (scroll × puntero × el bucle
      // de `.honey-drop`), así que ninguno puede ser generoso por su cuenta: el
      // techo conjunto ronda 2,1× y por encima de eso el goterón deja de leerse
      // como miel y pasa a hilo.
      drop.style.setProperty("--drop-stretch", (1 + near * 0.28).toFixed(3));
    }
  });

  return (
    <div className="absolute inset-0 -z-10">
      {/* Capa de parallax de cursor por fuera de la de scroll: si compartieran
          elemento, el rAF del puntero pisaría el transform de framer-motion en
          cada frame. */}
      <div ref={skyRef} className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { y: skyY, scale: skyScale }}
        >
          <HeroVideoBackground />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(circle_at_5%_10%,rgba(255,250,225,0.9),rgba(255,242,200,0.3)_30%,transparent_58%)]"
        style={reduced ? undefined : { opacity: glow }}
      />

      {/* Ya no hay velo cálido sobre la izquierda: el fondo queda limpio con el
          video y el contraste del copy lo aporta la superficie de vidrio de la
          card (ver HeroGlassCard). */}

      {/* El descenso al cielo de la sección siguiente, entero DENTRO del hero.
          fondo2 arranca en un azul pizarra (#74858D) y el hero es todo nubes
          claras: ese salto hay que recorrerlo en algún sitio. Se hace aquí, y
          no en el relleno de la sección de abajo, por dos razones: el vídeo de
          nubes tiene textura y disimula la rampa, y este alto es fijo mientras
          que el relleno de allí depende del contenido y no se puede controlar.
          La última fila pintada es exactamente el color con el que arranca la
          foto de abajo, así que en la unión no hay nada que ver. */}
      <motion.div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-56 origin-bottom bg-[linear-gradient(to_bottom,transparent_0%,#F3E9D4_42%,#A9AAA1_78%,#74858D_100%)] sm:h-80"
        style={reduced ? undefined : { scaleY: veil }}
      />

      {/* El goteo se apoya en la línea crema del descenso, que es donde el velo
          se lee como horizonte. `curve={0}`: aquí no hay hoja curvada de la que
          escurrir, el canto del hero es recto.

          El envoltorio calca la caja del velo (`h-56 sm:h-80`) para poder
          colocar la miel en PORCENTAJE de él: así el goteo sigue al crema en los
          dos breakpoints sin repetir el número a mano. Va en 36% y no en el 42%
          exacto de la parada crema porque los goterones estirados tienen que
          caber: el hero lleva `overflow-hidden` y los cortaría justo sobre la
          unión con la foto. */}
      <motion.div
        ref={dripRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 sm:h-80"
        style={reduced ? undefined : { opacity: honey }}
      >
        {/* `beadFall` corto: el hero recorta con `overflow-hidden` y el goteo
            está a ~119 px de su canto, así que una gota con la caída larga se
            cortaría en el aire justo sobre la unión con la foto. */}
        <HoneyDrip
          curve={0}
          tone="hero"
          beadFall={46}
          stretchMax={2.2}
          className="absolute inset-x-0 top-[36%]"
        />
      </motion.div>
    </div>
  );
}
