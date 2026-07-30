"use client";

import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";
import { IngredientArt } from "@/components/icons/ingredientIcons";
import { ServiceIcon } from "@/components/icons/serviceIcons";
import { usePointerVars } from "@/hooks/usePointerVars";
import { getIngredient } from "@/lib/ingredients";
import { SERVICE_DETAILS } from "@/lib/landingContent";
import type { Service } from "@/lib/types";

// Una celda del bento de ingredientes.
//
// La tarjeta es la "ventana interactiva": en reposo enseña el ingrediente
// (ilustración + nombre grande) y al acercarse abre una hoja inferior con el
// detalle del servicio. Toda la celda es el enlace, así que hay una sola parada
// de tabulación por servicio y el revelado también responde al teclado.
//
// Reglas que no se pueden relajar:
//   · el revelado NUNCA usa `hidden`/`display:none`, sólo alto y opacidad: el
//     lector de pantalla y el indexador reciben siempre el copy completo.
//   · en táctil no hay hover, así que la rama `(hover: none)` lo deja abierto.
//   · no es un disclosure widget (no hay control que lo alterne por sí solo):
//     nada de aria-expanded.

/** Tamaño de la celda dentro del mosaico. Cambia jerarquía, no contenido. */
export type BentoVariant = "hero" | "wide" | "cell";

/** Escalas por variante. En un `cell` de 13.5rem el titular del `hero` no cabe,
    y el detalle largo tampoco: la celda grande es la única que se permite
    desplegar los bullets. */
const SCALE: Record<BentoVariant, { art: string; title: string; pad: string }> = {
  hero: {
    art: "-bottom-6 -right-4 h-[62%] w-[62%]",
    title: "text-[clamp(2.6rem,4.4vw,4.2rem)]",
    pad: "p-7 sm:p-8",
  },
  wide: {
    art: "-bottom-5 -right-3 h-[86%] w-[42%]",
    title: "text-[clamp(1.9rem,3vw,2.6rem)]",
    pad: "p-6 sm:p-7",
  },
  cell: {
    art: "-bottom-5 -right-4 h-[54%] w-[54%]",
    title: "text-[clamp(1.75rem,2.6vw,2.4rem)]",
    pad: "p-6",
  },
};

// Los tres disparadores del revelado, siempre juntos: puntero encima, foco de
// teclado dentro, y pantalla sin hover (donde queda abierto de forma
// permanente porque no hay gesto que lo abra).
//
// Se extraen a constantes porque son doce utilidades por elemento y repetidas
// en dos sitios: en línea, el JSX dejaba de leerse.

/** De cerrado a abierto. */
const EXPAND =
  "transition-all duration-500 ease-out motion-reduce:transition-none " +
  "group-hover:mt-4 group-hover:grid-rows-[1fr] group-hover:opacity-100 " +
  "group-focus-visible:mt-4 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 " +
  "[@media(hover:none)]:mt-4 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100";

/** De abierto a cerrado: lo que se retira para dejar sitio. */
const COLLAPSE =
  "transition-all duration-500 ease-out motion-reduce:transition-none " +
  "group-hover:mt-0 group-hover:grid-rows-[0fr] group-hover:opacity-0 " +
  "group-focus-visible:mt-0 group-focus-visible:grid-rows-[0fr] group-focus-visible:opacity-0 " +
  "[@media(hover:none)]:mt-0 [@media(hover:none)]:grid-rows-[0fr] [@media(hover:none)]:opacity-0";

export default function ServiceBentoCard({
  service,
  index,
  variant,
}: {
  service: Service;
  index: number;
  variant: BentoVariant;
}) {
  // Escribe --px/--py, que es lo que consume `.tech-spot` desde globals.css.
  // Mismo contrato que el vidrio del hero y que las filas de testimonios.
  const onPointerMove = usePointerVars();

  const ingredient = getIngredient(service.slug);
  const detail = SERVICE_DETAILS[service.slug];
  const scale = SCALE[variant];

  // Sin ingrediente mapeado (servicio nuevo creado desde el panel) el titular
  // pasa a ser el nombre del servicio y el arte cae al icono pequeño: misma
  // filosofía que el fallback a emoji de ServiceIcon, nunca un hueco.
  const title = ingredient?.name ?? service.name;
  const kicker = ingredient ? service.name : "Servicio";
  const rest = ingredient?.tagline ?? service.description ?? "";

  return (
    <Link
      href={`/servicios/${service.slug}`}
      onPointerMove={onPointerMove}
      className={`tech-spot group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] transition-colors duration-300 hover:border-honey/35 hover:bg-white/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey ${scale.pad}`}
    >
      {/* Hairline superior que se enciende al acercarse: el mismo "cursor" que
          tenía la fila activa del catálogo anterior. */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-honey to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      {/* Ilustración del ingrediente. Sangra por el borde inferior derecho a
          propósito: recortada se lee como textura de la tarjeta y no como un
          icono pegado en una esquina. */}
      <span aria-hidden className={`pointer-events-none absolute ${scale.art}`}>
        {ingredient ? (
          <IngredientArt
            slug={service.slug}
            className="h-full w-full text-honey/55 transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04] group-hover:text-honey/75 motion-reduce:transform-none"
          />
        ) : (
          <ServiceIcon
            slug={service.slug}
            icon={service.icon}
            className="h-full w-full text-honey/45 text-[3rem]"
          />
        )}
      </span>

      <span className="relative min-w-0">
        <span className="flex items-center gap-3">
          <span className="font-display text-sm leading-none text-honey">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="h-px w-6 bg-honey/40" />
          <span className="font-heading text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-white/60">
            {kicker}
          </span>
        </span>

        <span
          className={`mt-3 block font-display leading-[0.92] text-white/95 ${scale.title}`}
        >
          {title}
        </span>

        {/* La línea de sabor cede su sitio al detalle en las celdas pequeñas.
            Medido: una celda de 13.5rem deja 166px útiles y el estado abierto
            pide 215; sin este canje el titular se recortaba por arriba. En la
            celda grande hay sitio de sobra para las dos, así que ahí se queda.
            Además el canje se lee bien: primero el sabor, luego el detalle. */}
        {rest && (
          <span
            className={
              variant === "hero"
                ? "mt-2 block max-w-[22ch] text-sm leading-relaxed text-white/55"
                : `mt-2 grid grid-rows-[1fr] ${COLLAPSE}`
            }
          >
            {variant === "hero" ? (
              rest
            ) : (
              <span className="min-h-0 max-w-[22ch] overflow-hidden text-sm leading-relaxed text-white/55">
                {rest}
              </span>
            )}
          </span>
        )}

        {/* ── Hoja de revelado ──
            `grid-rows-[0fr] → [1fr]` con un hijo `min-h-0 overflow-hidden` es
            lo único que anima un alto automático de verdad; con max-height
            habría que adivinar un tope y el easing se rompe al fallar. Como la
            tarjeta es `justify-end`, la hoja empuja el titular hacia arriba
            dentro de la celda: se abre como una ventana, sin mover a los
            vecinos (el alto de la fila lo fija el grid). */}
        <span className={`mt-0 grid grid-rows-[0fr] opacity-0 ${EXPAND}`}>
          <span className="min-h-0 overflow-hidden">
            {/* `block` sólo en la variante sin recorte: `line-clamp-2` fija su
                propio `display` y encadenar las dos utilidades de display deja
                el resultado a merced del orden del CSS generado. */}
            {detail?.intro && (
              <span
                className={`text-sm leading-relaxed text-white/70 ${
                  variant === "hero" ? "block" : "line-clamp-2"
                }`}
              >
                {detail.intro}
              </span>
            )}

            {/* Los bullets sólo caben en la celda grande. */}
            {variant === "hero" && detail?.what && (
              <span className="mt-3 flex flex-col gap-1.5">
                {detail.what.slice(0, 3).map((item) => (
                  <span key={item} className="flex items-start gap-2.5 text-sm text-white/60">
                    <span
                      aria-hidden
                      className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-honey"
                    />
                    {item}
                  </span>
                ))}
              </span>
            )}

            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-honey">
              Más info
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            </span>
          </span>
        </span>
      </span>
    </Link>
  );
}
