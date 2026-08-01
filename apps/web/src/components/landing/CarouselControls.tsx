"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

// Los dos botones redondos de un carrusel, y los puntos.
//
// Sin estado propio: todo llega del hook (useSnapCarousel). Están aquí juntos
// porque comparten el vocabulario visual y porque así el día que los use el
// mosaico de casos no hay que reinventarlos.
//
// `disabled` de verdad y no `aria-disabled`: en un extremo el botón no hace
// nada, y no hay nada que anunciar al respecto — el estado deshabilitado ya lo
// dice todo.

const btn =
  "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-300 " +
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "disabled:cursor-default disabled:opacity-35";

export function CarouselArrows({
  atStart,
  atEnd,
  onPrev,
  onNext,
  controls,
  labels,
  tone = "light",
  className,
}: {
  atStart: boolean;
  atEnd: boolean;
  onPrev: () => void;
  onNext: () => void;
  /** id de la pista que gobiernan. */
  controls: string;
  /** Textos accesibles. Genéricos no: "anterior" a secas no dice de qué. */
  labels: { prev: string; next: string };
  tone?: "light" | "dark";
  className?: string;
}) {
  const skin =
    tone === "light"
      ? "border-ink/15 bg-white/70 text-ink hover:enabled:border-ink/35 hover:enabled:bg-white focus-visible:outline-ink"
      : "border-white/25 bg-white/10 text-white hover:enabled:border-white/50 hover:enabled:bg-white/20 focus-visible:outline-white";

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <button
        type="button"
        onClick={onPrev}
        disabled={atStart}
        aria-controls={controls}
        aria-label={labels.prev}
        className={`${btn} ${skin}`}
      >
        <ArrowLeftIcon className="h-[1.15rem] w-[1.15rem]" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={atEnd}
        aria-controls={controls}
        aria-label={labels.next}
        className={`${btn} ${skin}`}
      >
        <ArrowRightIcon className="h-[1.15rem] w-[1.15rem]" />
      </button>
    </div>
  );
}

export function CarouselDots({
  count,
  active,
  onGo,
  label,
  controls,
  className,
}: {
  count: number;
  active: number;
  onGo: (i: number) => void;
  /** Nombre de cada destino ("Ir a Desarrollo Web"). */
  label: (i: number) => string;
  controls: string;
  className?: string;
}) {
  return (
    <ul className={`flex shrink-0 items-center gap-1 ${className ?? ""}`}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          {/* El punto mide 8px pero el botón mide 36 de alto: zona táctil
              suficiente sin engordar el diseño. */}
          <button
            type="button"
            onClick={() => onGo(i)}
            aria-controls={controls}
            aria-label={label(i)}
            aria-current={i === active ? "true" : undefined}
            className="grid h-9 w-5 place-items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <span
              aria-hidden
              className={`block h-2 w-2 rounded-full transition-colors duration-300 ${
                i === active ? "bg-honey-ink" : "bg-ink/25"
              }`}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
