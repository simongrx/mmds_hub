"use client";

import { useCallback, useId, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { ArrowRightIcon, HexOutline } from "@/components/icons";
import { ServiceIcon } from "@/components/icons/serviceIcons";
import { usePointerVars } from "@/hooks/usePointerVars";
import { INGREDIENTS_NOTE } from "@/lib/landingContent";
import type { Service } from "@/lib/types";
import { CarouselArrows, CarouselDots } from "./CarouselControls";
import { useSnapCarousel } from "./useSnapCarousel";

// El arco de servicios: las tarjetas salen del borde derecho de la pantalla en
// abanico, con una sola al frente, y el scroll de la página las va pasando.
//
// ── La rueda ──
//
// Las tarjetas van sobre el borde de una rueda cuyo centro está fuera de
// pantalla, a la derecha. No hace falta trigonometría: el truco es rotar
// alrededor de un pivote lejano,
//
//     translateX(R) rotate(θ) translateX(-R)
//
// que lleva el origen de giro R píxeles a la derecha, gira, y vuelve. La tarjeta
// con θ=0 se queda quieta en el frente y las demás describen el arco.
//
// ── El scroll de la página es la ÚNICA fuente de verdad ──
//
// El índice no es estado que se pueda escribir desde dos sitios: sale del
// progreso del scroll sobre el carril. Las flechas y el foco de teclado no
// tocan el índice — mueven la PÁGINA, y el índice cae solo. Si además hubiera un
// `setActive` en las flechas, el siguiente evento de scroll lo pisaría y la
// tarjeta daría un salto hacia atrás.
//
// ── Por debajo de lg, otra cosa ──
//
// Un abanico en 375px son siete tarjetas amontonadas. Ahí vuelve la fila
// horizontal con scroll-snap, que ya existe y ya es accesible. Se renderizan las
// dos y se conmutan con `lg:hidden` / `hidden lg:block`; el carril y el anclaje
// están en CSS (.arc-runway / .arc-pin en globals.css) porque así la anulación
// por `prefers-reduced-motion` gana por cascada sin `!important`.

/** Radio de la rueda, en px. Cuanto mayor, más plano el arco. */
const R = 560;
/** Grados entre tarjetas consecutivas. */
const STEP = 15;
/** A partir de esta distancia la tarjeta ya no se pinta. */
const VISIBLE = 3;

function CardFace({ service }: { service: Service }) {
  const onPointerMove = usePointerVars();

  return (
    <Link
      href={`/servicios/${service.slug}`}
      onPointerMove={onPointerMove}
      className="sky-glass sky-spot group flex h-full flex-col rounded-3xl p-6 transition-colors duration-300 hover:bg-white/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span
        aria-hidden
        className="grid h-11 w-11 place-items-center rounded-xl bg-honey/20 text-honey-ink transition-colors duration-300 group-hover:bg-honey/35"
      >
        <ServiceIcon slug={service.slug} icon={service.icon} className="h-5 w-5 text-base" />
      </span>

      <h3 className="mt-6 font-heading text-[1.05rem] font-bold leading-[1.2] text-ink">
        {service.name}
      </h3>

      {service.description && (
        <p className="mt-2 line-clamp-3 text-[0.82rem] leading-[1.45] text-ink/70">
          {service.description}
        </p>
      )}

      {/* `mt-auto` va en el envoltorio y no en la píldora: sobre un inline-flex
          dentro de un flex-col no empuja. Y es un <span> con pinta de botón, no
          un <button>: un botón dentro de un enlace es HTML inválido. */}
      <span className="mt-auto pt-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/[0.06] px-3.5 py-2 font-heading text-[0.78rem] font-semibold text-ink transition-colors duration-300 group-hover:bg-ink group-hover:text-white">
          Más info
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none" />
        </span>
      </span>
    </Link>
  );
}

export default function ServiceArc({
  services,
  heading,
  backdrop,
}: {
  services: Service[];
  /** Ya renderizados en servidor y pasados como props: así `SectionHeading` y
      `SkyBackdrop` siguen siendo componentes de servidor aunque el carril tenga
      que ser cliente para leer el scroll. */
  heading: React.ReactNode;
  /** Va DENTRO de la capa anclada, no fuera: así mide siempre una pantalla y la
      foto no se estira a lo largo de los 280vh del carril. */
  backdrop: React.ReactNode;
}) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();
  const arcId = useId();
  const last = services.length - 1;

  // El carril entero: de cuando su techo toca el techo de la ventana a cuando su
  // pie lo hace. Es exactamente el tramo en el que la capa anclada está quieta.
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.round(v * last);
    setActive(Math.min(last, Math.max(0, i)));
  });

  /** Lleva la PÁGINA a la posición de scroll que corresponde a esa tarjeta. No
      toca `active`: eso lo hace el propio scroll al llegar. */
  const goTo = useCallback(
    (i: number) => {
      const el = runwayRef.current;
      if (!el || last <= 0) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const target = top + (Math.min(last, Math.max(0, i)) / last) * travel;
      window.scrollTo({ top: target, behavior: reduced ? "auto" : "smooth" });
    },
    [last, reduced]
  );

  // Al tabular hasta una tarjeta, la página se mueve para traerla al frente. Sin
  // esto, el foco iría a una tarjeta que está detrás y no se ve.
  const onCardFocus = useCallback(
    (i: number) => {
      if (i !== active) goTo(i);
    },
    [active, goTo]
  );

  // La fila de móvil tiene su propio estado, independiente del arco.
  const row = useSnapCarousel(services.length);
  const rowId = useId();

  return (
    <div ref={runwayRef} className="arc-runway relative isolate">
      <div className="arc-pin relative flex flex-col justify-center py-20 lg:py-0">
        {backdrop}

        <div className="mx-auto grid w-full max-w-[88rem] items-center gap-8 px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
          {/* Columna izquierda: titular y flechas. Queda a la izquierda de la
              abeja, que es el hueco central de la foto. */}
          <div>
            {heading}
            <CarouselArrows
              className="mt-9"
              atStart={active === 0}
              atEnd={active === last}
              onPrev={() => goTo(active - 1)}
              onNext={() => goTo(active + 1)}
              controls={arcId}
              labels={{ prev: "Ingrediente anterior", next: "Ingrediente siguiente" }}
            />
          </div>

          {/* ── El arco, sólo en escritorio ── */}
          <div
            id={arcId}
            role="group"
            aria-roledescription="carrusel"
            aria-label="Nuestros ingredientes"
            className="relative hidden h-[26rem] lg:block"
          >
            {services.map((service, i) => {
              const offset = i - active;
              const far = Math.min(Math.abs(offset), VISIBLE);
              return (
                <motion.div
                  key={service.id}
                  onFocus={() => onCardFocus(i)}
                  className="absolute right-0 top-1/2 h-[19rem] w-[17.5rem] -translate-y-1/2"
                  animate={{
                    // El pivote lejano: ida al centro de la rueda, giro, y vuelta.
                    x: R - R * Math.cos((offset * STEP * Math.PI) / 180),
                    y: -R * Math.sin((offset * STEP * Math.PI) / 180),
                    rotate: offset * STEP,
                    scale: 1 - far * 0.08,
                    opacity: Math.abs(offset) > VISIBLE ? 0 : 1 - far * 0.22,
                  }}
                  transition={
                    reduced ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 30 }
                  }
                  style={{ zIndex: 20 - Math.abs(offset) }}
                >
                  <CardFace service={service} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── La fila, por debajo de escritorio ── */}
        <ul
          ref={row.trackRef}
          id={rowId}
          tabIndex={0}
          aria-label="Ingredientes"
          className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-6 pb-4 scroll-pl-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink lg:hidden"
        >
          {services.map((service) => (
            <li
              key={service.id}
              className="min-h-[16rem] shrink-0 basis-[78%] snap-start sm:basis-[46%] md:basis-[34%]"
            >
              <CardFace service={service} />
            </li>
          ))}
        </ul>

        {/* Píldora de cierre. Un punto por servicio: los puntos "por página"
            cambian de número al cambiar el breakpoint, y un indicador que cambia
            de cardinalidad al redimensionar no es un indicador. */}
        <div className="mx-auto mt-10 w-full max-w-[88rem] px-6">
          <div className="sky-glass mx-auto flex max-w-[46rem] flex-col items-center gap-4 rounded-3xl px-5 py-4 text-center sm:flex-row sm:rounded-full sm:py-3 sm:text-left">
            <HexOutline aria-hidden className="h-5 w-5 shrink-0 text-honey-ink" />
            <p className="min-w-0 flex-1 text-[0.85rem] leading-snug text-ink/75">
              {INGREDIENTS_NOTE}
            </p>
            <CarouselDots
              className="hidden lg:flex"
              count={services.length}
              active={active}
              onGo={goTo}
              controls={arcId}
              label={(i) => `Ir a ${services[i]?.name ?? `ingrediente ${i + 1}`}`}
            />
            <CarouselDots
              className="lg:hidden"
              count={services.length}
              active={row.active}
              onGo={row.goTo}
              controls={rowId}
              label={(i) => `Ir a ${services[i]?.name ?? `ingrediente ${i + 1}`}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
