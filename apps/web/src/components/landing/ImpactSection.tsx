"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { IMPACT_STATS } from "@/lib/landingContent";
import HoneyDrip from "./HoneyDrip";
import SectionHeading from "./SectionHeading";

// Impacto que se ve — las cifras.
//
// Como "Proceso", es una HOJA SUPERPUESTA: no ocupa banda propia, pisa el final
// del cielo de los casos y el principio del del cierre, y ella misma es la unión
// entre las dos fotos.
//
// Va SIN número de capítulo, y no por descuido: las cifras pueden vaciarse, así
// que la sección puede desaparecer. Con número, la serie de la home quedaría
// 01, 02, 03, —, 05. Sin él, el recorrido se lee igual en ambos casos.
//
// ── Sin cifras ahora SÍ desaparece, y eso es nuevo ──
//
// Antes tenía que quedarse como banda de costura, porque era quien llevaba el
// pie del cielo de casos (#D0C4BA) hasta el techo del del cierre (#DBD3CA). Ya
// no: eso lo hace el `trail` de la propia foto de casos. Así que aquí basta con
// no renderizar nada, como en cualquier otra sección sin datos.
//
// La hoja va más plana que la de Proceso a propósito: la foto de casos muere en
// un podio blanco curvado y la del cierre nace con una curva blanca, y tres
// curvas seguidas son ruido.
//
// ⚠ Esta sección no puede llevar `overflow-hidden`: desbordan la abeja y el goteo.

/** `inset: 0` porque la hoja ES la sección, no una capa dentro de un fondo. Van
    en la <section> porque HoneyDrip mide `--sheet-curve` para dibujar el mismo
    arco que el canto de la hoja (ver ProcessSection). */
const SHEET = {
  "--sheet-inset": "0px",
  "--sheet-curve": "clamp(1rem, 3vw, 3.25rem)",
} as CSSProperties;

export default function ImpactSection() {
  const reduced = useReducedMotion();

  if (IMPACT_STATS.length === 0) return null;

  return (
    <section
      id="impacto"
      style={SHEET}
      className="relative isolate z-20 -mt-[8vw] -mb-[8vw] pt-[max(7rem,11vw)] pb-[max(8rem,13vw)]"
    >
      <div aria-hidden className="sky-sheet -z-10" />

      <HoneyDrip />

      <img
        src="/images/bee-static.png"
        width={892}
        height={835}
        alt=""
        aria-hidden
        decoding="async"
        loading="lazy"
        className="pointer-events-none absolute -top-4 right-[4%] hidden w-[clamp(80px,9.5vw,164px)] drop-shadow-[0_24px_36px_rgba(120,90,20,0.28)] md:block"
      />

      <div className="mx-auto max-w-[88rem] px-6 lg:grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-14">
        <SectionHeading
          tone="light"
          eyebrow="Resultados"
          title="Impacto que se ve"
          display
          lead="Nuestras soluciones generan crecimiento, eficiencia y conexiones reales."
          action={{ href: "/casos-de-exito", label: "Ver resultados" }}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
          {IMPACT_STATS.map((stat, i) => (
            <motion.li
              key={stat.label}
              className="sky-glass sky-spot flex flex-col justify-center rounded-2xl p-7 text-center"
              initial={reduced ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
            >
              <p className="font-display leading-[0.9] text-ink text-[clamp(2.4rem,3.6vw,3.6rem)]">
                {stat.value}
              </p>
              <p className="mt-3 text-[0.8rem] leading-snug text-ink/65">{stat.label}</p>
              {stat.detail && (
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{stat.detail}</p>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
