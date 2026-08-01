"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { HexOutline } from "@/components/icons";
import HoneyDrip, { GATE_TOP } from "./HoneyDrip";

// El portal entre el hero y "01 — Nuestros ingredientes".
//
// Lo que había antes era continuo: el hero descendía en degradado hasta el azul
// con el que arranca `fondo2.webp` y la sección siguiente empezaba sin más. Se
// leía bien, pero no se leía como un CAMBIO DE CAPÍTULO. Esto sí: la miel
// inunda la pantalla, se sostiene con el rótulo, y se retira dejando la sección.
//
// ── Por qué el fondo de la <section> es #74858D y no puede ser otra cosa ──
//
// Meter una sección nueva entre el hero y la foto rompe la cadena de costuras
// que documenta `skyBackdrops.ts`: el hero muere en #74858D porque esa es la
// primera fila de `fondo2.webp`. Con el fondo de la sección puesto en ese mismo
// color, su primera y su última fila pintadas son exactamente el color de sus
// dos vecinas y la cadena sigue intacta. Un fondo crema, o transparente, mete
// una raya a cada lado.
//
// Eso vale además para el estado anclado: lo que queda detrás de la miel cuando
// se retira es este mismo color, así que la foto de abajo entra sin salto.
//
// ── Por qué el carril es corto ──
//
// 170vh de carril sobre un pin de 100svh son 70vh de recorrido útil: una
// pantalla escasa. En esta misma página ya se quitó un tramo anclado por costar
// "tres pantallas de scroll secuestrado" (cabecera de PortfolioSection), y esto
// es el mismo patrón. Las medidas viven en globals.css (`.honey-gate-runway` /
// `.honey-gate-pin`) para que la anulación por `prefers-reduced-motion` —que lo
// borra ENTERO del recorrido— gane por cascada sin `!important`.

/** El bloque de miel muere en el mismo tono con el que arranca su fleco, o se
    vería la juntura entre el degradado del bloque y el SVG del goteo. */
const MASS = `linear-gradient(to bottom, #7A4A05 0%, #B9760A 26%, #E2A016 62%, ${GATE_TOP} 100%)`;

export default function HoneyGate() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // El reloj de las tres fases. `end end` y no `end start`: el recorrido termina
  // cuando el pie del carril alcanza el pie de la ventana, que es exactamente
  // cuando la capa anclada deja de estar quieta.
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 1) inundación · 2) sostenido · 3) retirada.
  // El bloque entra desde arriba y sale por abajo; los dos valores del medio son
  // iguales porque ahí es donde se queda quieto, cubriendo.
  const flood = useTransform(p, [0, 0.42, 0.62, 1], ["-100%", "0%", "0%", "108%"]);

  // El rótulo se apaga antes de que la miel se haya ido: si aguantara, se
  // quedaría flotando sobre el azul pelado.
  const titleOpacity = useTransform(p, [0.34, 0.45, 0.6, 0.7], [0, 1, 1, 0]);
  const titleY = useTransform(p, [0.34, 0.45, 0.7], [48, 0, -28]);

  // El barrido de luz. Sin él, una pantalla entera de miel se lee como un
  // rectángulo naranja plano — el problema es justo que no tiene canto donde
  // pueda brillar, así que la luz tiene que cruzarla por dentro.
  const sheenX = useTransform(p, [0.38, 0.66], ["-55%", "155%"]);

  // Detrás de la miel, el halo cálido se abre a la vez que ella se va.
  const haloScale = useTransform(p, [0.6, 1], [0.7, 1.15]);

  return (
    <section ref={ref} className="honey-gate-runway relative isolate z-30 bg-[#74858D]">
      <div className="honey-gate-pin">
        {/* Lo que queda detrás cuando la miel se retira: el color de costura con
            un halo cálido que lo saca de plano. */}
        <motion.div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_62%,rgba(244,196,48,0.18),transparent_72%)]"
          style={reduced ? undefined : { scale: haloScale }}
        />

        {/* ── La masa de miel ──
            Sin alto explícito: el bloque sólido mide una pantalla y el fleco va
            detrás en flujo normal. Así el `-100%` del `y` se mide sobre el alto
            real y no hay que adivinar cuánto ocupa el goteo — que en `vw` no
            cuadraría, porque `vw` incluye la barra de scroll y el SVG no. */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 top-0"
          style={reduced ? undefined : { y: flood }}
        >
          {/* El canto de FUGA, del revés. Sin esto la retirada deja una raya
              horizontal perfecta —el lomo del bloque, que nunca estuvo pensado
              para verse— y el gesto se rompe justo al final. Con el goteo
              invertido, la miel se va dejando hilos, que es lo que hace.

              Va en `absolute` colgado de `bottom-full` y no en flujo: así no
              suma al alto del envoltorio, y por tanto durante el sostenido
              (`y: 0`) queda entero por encima de la ventana en vez de comerse
              una franja de la pantalla llena. */}
          <div className="absolute inset-x-0 bottom-full -scale-y-100">
            <HoneyDrip curve={0} tone="gate" />
          </div>

          <div className="relative h-[100svh] w-full overflow-hidden" style={{ background: MASS }}>
            {/* El barrido, dentro del bloque para que viaje con él. `screen` es
                el mismo recurso que el reflejo de la card del hero. */}
            <motion.div
              className="absolute inset-y-0 w-[42%] bg-[linear-gradient(105deg,transparent,rgba(255,246,214,0.55),transparent)] mix-blend-screen"
              style={reduced ? undefined : { x: sheenX }}
            />
          </div>

          {/* El canto de ataque: el mismo goteo que remata las hojas, aquí
              haciendo de frente de la ola. `curve={0}` porque no cuelga de
              ninguna hoja curvada. */}
          <HoneyDrip curve={0} tone="gate" />
        </motion.div>

        {/* ── El rótulo ──
            `aria-hidden`: repite el SectionHeading de la sección de abajo, y
            anunciar "01 Nuestros Ingredientes" dos veces seguidas es ruido. */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid place-items-center px-6 text-center"
          style={reduced ? undefined : { opacity: titleOpacity, y: titleY }}
        >
          <div>
            <p className="flex items-center justify-center gap-3 font-heading text-[0.72rem] font-semibold uppercase tracking-[0.32em] text-[#7A4E05]">
              <HexOutline className="h-4 w-4" />
              01 — Ingredientes
            </p>
            <p className="mt-4 font-display uppercase leading-[0.92] text-[#4A2C01] text-[clamp(2.6rem,9vw,7rem)]">
              Nuestros
              <br />
              Ingredientes
            </p>
            <p className="mx-auto mt-5 max-w-[34rem] text-[0.95rem] leading-relaxed text-[#5A3A02]">
              Cada servicio es un ingrediente. Los combinamos para cocinar la solución perfecta.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
