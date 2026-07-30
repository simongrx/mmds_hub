"use client";

import { motion, useReducedMotion } from "framer-motion";
import CaseCard, { type CaseVariant } from "./CaseCard";
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
    <section id="portfolio" className="tech-grid relative isolate bg-carbon py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3">
            <span className="font-display text-sm leading-none text-honey">02</span>
            <span aria-hidden className="h-px w-8 bg-honey/40" />
            <span className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-white/55">
              Casos
            </span>
          </p>
          <h2 className="mt-5 font-heading text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.08] text-white/95">
            Casos que hemos cocinado
          </h2>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/60">
            Proyectos reales con resultados que dan hambre de más.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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
