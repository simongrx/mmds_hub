"use client";

import { useReducedMotion } from "framer-motion";
import { StarIcon } from "@/components/icons/serviceIcons";
import { usePointerVars } from "@/hooks/usePointerVars";
import SectionHeading from "./SectionHeading";
import { TESTIMONIALS, type Testimonial } from "@/lib/landingContent";

// 03 — Lo que dicen nuestros clientes. El segundo tramo horizontal.
//
// Sólo hay tres testimonios, así que un track anclado como el de proyectos
// estaría desproporcionado: se pinarían tres pantallas para tres frases. En su
// lugar, dos filas de marquee que derivan en direcciones opuestas — el
// movimiento horizontal es continuo y ambiental, no un recorrido que el usuario
// tenga que completar.
//
// El bucle es CSS puro sobre `transform` (ver .tech-marquee en globals.css), no
// JS: no hay listener de scroll ni rAF, y se pausa solo al leer.

/** Iniciales del nombre, para la placa hexagonal. */
function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function QuoteCard({
  testimonial,
  className,
  duplicate,
}: {
  testimonial: Testimonial;
  className?: string;
  /** Copia decorativa del marquee: no debe llegar al lector de pantalla. */
  duplicate?: boolean;
}) {
  const onPointerMove = usePointerVars();

  return (
    <figure
      onPointerMove={onPointerMove}
      aria-hidden={duplicate || undefined}
      className={`tech-glass tech-spot flex w-[min(88vw,26rem)] shrink-0 flex-col justify-between gap-6 p-7 ${className ?? ""}`}
    >
      <div>
        {/* La puntuación va con estrellas SVG y además con texto para el lector
            de pantalla: la valoración no puede depender sólo de la forma. */}
        <div className="flex items-center gap-1 text-honey" role="img" aria-label={`${testimonial.rating} de 5 estrellas`}>
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <StarIcon key={i} className="h-4 w-4" />
          ))}
        </div>
        <blockquote className="mt-5 text-[1.0625rem] leading-relaxed text-white/85">
          “{testimonial.quote}”
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-3.5">
        {/* Antes era el emoji del dato. Se sustituye por una placa hexagonal con
            las iniciales: el mismo motivo que el resto del tramo oscuro, y el
            nombre y la empresa siguen siendo la información real. */}
        <span
          aria-hidden
          className="grid h-11 w-11 shrink-0 place-items-center [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-honey/15 font-display text-sm text-honey"
        >
          {initials(testimonial.name)}
        </span>
        <span>
          <span className="block font-heading font-semibold text-white/95">{testimonial.name}</span>
          <span className="block text-sm text-white/55">{testimonial.company}</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Una fila del marquee. El contenido va duplicado y la animación desplaza -50%,
 * así que al acabar el ciclo el segundo juego está exactamente donde arrancó el
 * primero: el bucle no tiene costura.
 *
 * La separación va como `mr-5` en cada tarjeta y NO como `gap` del flex: con
 * `gap`, el track mide 6 tarjetas + 5 huecos y la mitad cae a mitad de un hueco,
 * así que el bucle daría un salto de 10px por ciclo. Con el margen en la
 * tarjeta, la unidad repetida es "tarjeta + hueco" y el -50% es exacto.
 *
 * La copia es decorativa: va aria-hidden para que el lector de pantalla no lea
 * seis testimonios donde hay tres.
 */
function MarqueeRow({
  items,
  reverse,
  duration,
}: {
  items: Testimonial[];
  reverse?: boolean;
  duration: string;
}) {
  return (
    <div className="tech-marquee-row overflow-hidden">
      <div
        className={`tech-marquee flex w-max ${reverse ? "tech-marquee--reverse" : ""}`}
        style={{ ["--marquee-duration" as string]: duration }}
      >
        {items.map((t) => (
          <QuoteCard key={t.name} testimonial={t} className="mr-5" />
        ))}
        {items.map((t) => (
          <QuoteCard key={`copia-${t.name}`} testimonial={t} className="mr-5" duplicate />
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const reduced = useReducedMotion();
  // La segunda fila arranca por el final para que las dos no muestren lo mismo
  // a la vez. Es el mismo contenido, no información nueva.
  const reversed = [...TESTIMONIALS].reverse();

  // Sin testimonios no hay sección. Mismo criterio que el portfolio vacío: es
  // preferible que el capítulo 03 no exista a que exista con un hueco o con
  // relleno. Ver landingContent.ts para por qué la lista está vacía.
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section id="testimonios" className="tech-grid relative isolate bg-void py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          index="03"
          eyebrow="Testimonios"
          title="Lo que dicen nuestros clientes"
          lead="Historias con final feliz (y digital)."
          align="center"
        />
      </div>

      {reduced ? (
        /* Sin movimiento: las tres tarjetas en un grid estático. Un
           desplazamiento infinito es justo lo que esta preferencia pide
           desactivar, así que no se ralentiza: se retira. */
        <div className="mx-auto mt-14 grid max-w-7xl gap-5 px-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <QuoteCard key={t.name} testimonial={t} />
          ))}
        </div>
      ) : (
        /* A sangre: el marquee necesita salir por los dos bordes para que se lea
           como un flujo y no como una tira que empieza y acaba en el margen. */
        <div className="mt-14 flex flex-col gap-5">
          <MarqueeRow items={TESTIMONIALS} duration="58s" />
          <MarqueeRow items={reversed} duration="72s" reverse />
        </div>
      )}
    </section>
  );
}
