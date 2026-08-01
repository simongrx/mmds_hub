"use client";

import { motion, useReducedMotion } from "framer-motion";
import CaseCard, { type CaseVariant } from "./CaseCard";
import SectionHeading from "./SectionHeading";
import SkyBackdrop from "./SkyBackdrop";
import { SKY } from "./skyBackdrops";
import type { PortfolioItem } from "@/lib/serverApi";

// 02 — Casos que hemos cocinado.
//
// Antes: tramo horizontal anclado. La sección medía n×100vh y el scroll
// vertical arrastraba una pista en horizontal. Se leía bien pero costaba tres
// pantallas de scroll secuestrado enseñar tres casos, y no había forma de ver
// el conjunto del trabajo de un vistazo — que es justo lo que se le pide a un
// portafolio.
//
// Ahora: mosaico. Un caso destacado a ancho completo y el resto emparejados,
// cada uno con su foto (public/images/casos, ver lib/caseImages.ts) o con el
// visual generado de siempre. Sin pin, sin carrusel, sin overflow horizontal:
// el mismo marcado en escritorio y en móvil, sólo cambian las columnas.

/**
 * Reparto de anchos en un grid de 6 columnas, según cuántos casos haya.
 *
 * Los proyectos vienen de la BD y el panel los crea y despublica, así que el
 * recuento es cualquier número. La clave para que no se rompa: sólo se reparten
 * COLUMNAS, con la altura fijada por proporción. Los `row-span` son lo que deja
 * huecos y filas colapsadas al cambiar N; una proporción no puede.
 *
 *   1 → [6]              4 → [6,3,3,6]
 *   2 → [3,3]            5 → [6,3,3,3,3]
 *   3 → [6,3,3]          6 → [6,3,3,3,3,6]
 *
 * Regla: destacado arriba, el resto por parejas, y si la cola queda impar el
 * último se estira a ancho completo para cerrar sin media celda huérfana.
 */
function caseSpans(count: number): number[] {
  if (count === 1) return [6];
  if (count === 2) return [3, 3];

  const rest = count - 1;
  const out = [6, ...Array<number>(rest).fill(3)];
  if (rest % 2 === 1) out[out.length - 1] = 6;
  return out;
}

/** Ancho → clases. Literales completos: una clase construida en tiempo de
    ejecución no la genera el escáner de Tailwind. */
const SPAN_CLS: Record<number, string> = {
  6: "md:col-span-2 lg:col-span-6 aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]",
  3: "md:col-span-1 lg:col-span-3 aspect-[4/3]",
};

export default function PortfolioSection({
  projects,
  images = {},
}: {
  projects: PortfolioItem[];
  /** projectId → ruta de su foto. Lo resuelve el servidor en app/page.tsx. */
  images?: Record<string, string>;
}) {
  const reduced = useReducedMotion();

  if (projects.length === 0) return null;

  const spans = caseSpans(projects.length);

  return (
    // El padding sigue siendo generoso por una razón concreta: esta foto trae
    // la ola de miel con goteo pintada en su canto de arriba y el podio blanco
    // en el de abajo, y en panorámico se ven ENTEROS. El contenido tiene que
    // dejarlos respirar o se le monta encima. `min-h-[64.1vw]` es el alto de la
    // banda (100vw ÷ 1566/1004).
    <section
      id="portfolio"
      className="relative isolate overflow-hidden pt-[max(7rem,13vw)] pb-[max(9rem,20vw)] lg:min-h-[64.1vw]"
    >
      {/* `align="top"`: la foto se pega al techo de la sección. Su primera fila
          es #F0EADC, que es exactamente donde muere la foto de ingredientes, así
          que las dos se tocan sin escalón — que es lo que hace falta ahora que
          "Proceso" flota por encima de esa unión en vez de rellenarla.
          El goteo que esta foto trae pintado en su canto queda TAPADO por la
          hoja de Proceso, que se solapa 11vw sobre ella. Ése es el goteo que
          ahora dibuja HoneyDrip.
          `trail`: por abajo el relleno lleva la foto hasta #DBD3CA, el techo de
          la foto del cierre, por el mismo motivo. */}
      <SkyBackdrop sky={SKY.casos} align="top" trail="#DBD3CA" />

      {/* Velo lateral. En su franja media el cielo de fondo3 es azul medio y ahí
          el texto de tinta se queda por debajo del contraste mínimo. El velo lo
          sube de sobra y, al ir de izquierda a derecha y no como una caja, se
          lee como luz de sol entrando por ese lado. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full bg-[linear-gradient(to_right,rgba(255,252,244,0.86),rgba(255,252,244,0.4)_58%,transparent)] lg:w-[52%]"
      />

      <div className="mx-auto max-w-[88rem] px-6 lg:grid lg:grid-cols-[minmax(16rem,20rem)_minmax(0,1fr)] lg:gap-14">
        <SectionHeading
          tone="light"
          index="03"
          eyebrow="Casos reales"
          title="Proyectos que han despegado"
          lead="Resultados que hablan. Historias que inspiran."
          display
          action={{ href: "/casos-de-exito", label: "Ver todos los proyectos" }}
          className="lg:sticky lg:top-28 lg:self-start"
        />

        {/* ── El mosaico no se toca: caseSpans, SPAN_CLS y las proporciones
              siguen igual. Sólo `lg:mt-0`, porque ya no va debajo de la
              cabecera sino a su lado. ── */}
        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-0 lg:grid-cols-6">
          {projects.map((project, i) => {
            const span = spans[i] ?? 3;
            return (
              <motion.li
                key={project.id}
                className={SPAN_CLS[span]}
                initial={reduced ? undefined : { opacity: 0, y: 28 }}
                whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: "easeOut", delay: (i % 2) * 0.08 }}
              >
                <CaseCard
                  project={project}
                  index={i}
                  variant={(span === 6 ? "hero" : "half") satisfies CaseVariant}
                  image={images[project.id]}
                />
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
