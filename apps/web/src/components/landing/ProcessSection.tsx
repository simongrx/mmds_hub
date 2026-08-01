"use client";

import type { CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRightIcon, HexOutline } from "@/components/icons";
import { ChipIcon, PaletteIcon, TrendIcon } from "@/components/icons/serviceIcons";
import { PROCESS_STEPS } from "@/lib/landingContent";
import HoneyDrip from "./HoneyDrip";
import SectionHeading from "./SectionHeading";

// 02 — Nuestro proceso.
//
// Esta sección NO ocupa una banda propia: es una HOJA SUPERPUESTA que pisa el
// final del cielo de ingredientes y el principio del de casos. Ella misma es la
// unión entre las dos fotos.
//
// Antes tenía un degradado crema de fondo que la envolvía, y ese margen crema se
// leía como relleno muerto entre dos fotos. Ahora no hay fondo: hay márgenes
// negativos que la meten dentro de sus vecinas, y una hoja blanca curvada que se
// pinta encima.
//
// ── Lo que sostiene esto, y que no se ve desde aquí ──
//
// La hoja tapa la unión en el centro, pero su borde curvado sube en las esquinas
// y ahí la unión SE VE. Por eso Ingredientes y Casos tienen que tocarse solas y
// en el mismo color (#F0EADC), cosa que hacen con el `trail` de la primera y el
// `align="top"` de la segunda. Si alguien toca eso, aparece una raya a los lados
// de esta hoja.
//
// ── Por qué -mb-[11vw] y no un número redondo ──
//
// La foto de casos trae su propio goteo de miel pintado en el canto superior, y
// ocupa 136/1566 = 8,7vw. Esta hoja tiene que solaparse MÁS que eso para taparlo,
// o se verían dos goteos seguidos: el de la foto y el que dibuja HoneyDrip.
//
// ⚠ Ni esta sección ni Impacto pueden llevar `overflow-hidden`: desbordan la
// abeja y el goteo a propósito.

/** Iconos ya existentes; no hace falta dibujar ninguno para esta sección. */
const ICONS = {
  hex: HexOutline, // el hexágono de marca ES "tu esencia"
  palette: PaletteIcon,
  chip: ChipIcon,
  trend: TrendIcon,
} as const;

/** `inset: 0` porque la hoja ya no va metida dentro de un fondo: la hoja ES la
    sección. Sólo queda la curva de los cantos.

    Va en la <section> y no en el div de la hoja porque HoneyDrip también las
    necesita: dibuja el MISMO arco que el canto de la hoja y para eso tiene que
    poder medir `--sheet-curve`. Las custom properties heredan, así que la hoja
    las sigue viendo igual. */
const SHEET = {
  "--sheet-inset": "0px",
  "--sheet-curve": "clamp(1.25rem, 3.6vw, 4rem)",
} as CSSProperties;

export default function ProcessSection() {
  const reduced = useReducedMotion();
  const last = PROCESS_STEPS.length - 1;

  return (
    // El `pt`/`pb` tiene que superar la curva o la primera línea de texto cae
    // sobre el arco; y además tiene que absorber el margen negativo, porque lo
    // que se solapa es la hoja entera, no sólo su borde.
    // `z-20` la pinta por encima de las dos fotos, que se quedan en z-auto.
    <section
      id="proceso"
      style={SHEET}
      className="relative isolate z-20 -mt-[8vw] -mb-[11vw] pt-[max(8rem,13vw)] pb-[max(9rem,15vw)]"
    >
      <div aria-hidden className="sky-sheet -z-10" />

      {/* El goteo escurre del canto curvado de la hoja: comparte su arco y se
          coloca solo a partir de `--sheet-curve`. No lleva clases de posición. */}
      <HoneyDrip />

      {/* La abeja se apoya en el canto superior de la hoja. Es el mismo fichero
          que ya trae cacheado el hero, y `<img>` en vez de next/image por lo
          mismo que documenta HeroBee: viene pre-dimensionado. */}
      <img
        src="/images/bee-static.png"
        width={892}
        height={835}
        alt=""
        aria-hidden
        decoding="async"
        loading="lazy"
        className="pointer-events-none absolute -top-6 right-[6%] hidden w-[clamp(88px,11vw,190px)] drop-shadow-[0_24px_36px_rgba(120,90,20,0.28)] md:block"
      />

      <div className="mx-auto max-w-[88rem] px-6 lg:grid lg:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:gap-14">
        <SectionHeading
          tone="light"
          index="02"
          eyebrow="Receta probada"
          title="Nuestro proceso"
          display
          lead="Un proceso claro, ágil y colaborativo. Así convertimos ideas en soluciones digitales que generan impacto."
          action={{ href: "/preguntas-frecuentes", label: "Conocer más" }}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon];
            return (
              <motion.li
                key={step.title}
                className="sky-glass sky-spot relative flex flex-col rounded-2xl p-6"
                initial={reduced ? undefined : { opacity: 0, y: 24 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.06 }}
              >
                <span
                  aria-hidden
                  className="grid h-12 w-12 place-items-center rounded-xl bg-honey/15 text-honey-ink"
                >
                  <Icon className="h-6 w-6" />
                </span>

                <p className="mt-6 font-display text-sm leading-none text-honey-ink">
                  {String(i + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-2 font-heading text-lg font-bold leading-[1.2] text-ink">
                  {step.title}
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.detail}</p>

                {/* El chevron va DENTRO del <li> y posicionado sobre el hueco.
                    Un <span> suelto entre los <li> de una <ol> es HTML inválido,
                    y esto se lee igual: marca continuidad, no navegación, así
                    que es puramente decorativo. */}
                {i < last && (
                  <span
                    aria-hidden
                    className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-mustard-dark lg:block"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </span>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
