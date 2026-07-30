"use client";

import { motion, useReducedMotion } from "framer-motion";
import ServiceBentoCard, { type BentoVariant } from "./ServiceBentoCard";
import type { Service } from "@/lib/types";

// 01 — Nuestros ingredientes.
//
// Historia de la sección, por si vuelve la tentación:
//
//   · grid de tres columnas con tarjetas cuadradas → con siete servicios dejaba
//     una fila coja y los siete pesaban igual.
//   · catálogo vertical con columna de índice fija → resolvía la jerarquía pero
//     seguía sin enseñar el ingrediente: la metáfora de la marca vivía sólo en
//     el titular de la sección.
//   · ahora, bento: celdas de tamaños distintos donde el ingrediente es el
//     protagonista (ilustración + nombre grande) y el servicio queda como
//     subtítulo. Cada celda abre su ficha al acercarse.
//
// El recorrido sigue siendo vertical: el tramo horizontal es el de testimonios.

/** Reparto de celdas para los siete servicios sembrados.
 *
 * En lg son 4 columnas × 3 filas = 12 celdas y este mapa ocupa las 12: la
 * grande 2×2 arriba a la izquierda, cuatro sueltas a su derecha y dos anchas
 * cerrando abajo. Sin hueco huérfano, que es justo lo que fallaba en el grid
 * original.
 *
 * Las clases van como literales completos y nunca interpoladas: el escáner de
 * Tailwind lee el fichero como texto y una clase construida en tiempo de
 * ejecución no llega a generarse. */
const BENTO_7: { span: string; variant: BentoVariant }[] = [
  { span: "md:col-span-2 lg:col-span-2 lg:row-span-2", variant: "hero" },
  { span: "lg:col-span-1", variant: "cell" },
  { span: "lg:col-span-1", variant: "cell" },
  { span: "lg:col-span-1", variant: "cell" },
  { span: "lg:col-span-1", variant: "cell" },
  { span: "md:col-span-2 lg:col-span-2", variant: "wide" },
  { span: "md:col-span-2 lg:col-span-2", variant: "wide" },
];

/** Celdas 1×1 uniformes. Los servicios vienen de la BD y el panel puede crear
    más: cuando el recuento no es siete se cae a un grid regular en vez de
    inventar un reparto que dejaría huecos. `grid-flow-row-dense` remata. */
const PLAIN = { span: "", variant: "cell" as BentoVariant };

export default function ServicesSection({ services }: { services: Service[] }) {
  const reduced = useReducedMotion();
  const total = services.length;
  const layout = total === BENTO_7.length ? BENTO_7 : null;

  return (
    <section id="servicios" className="tech-grid relative isolate bg-void py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Cabecera a ancho completo. La columna de índice pegajosa se fue con
            el catálogo vertical: aquí el recorrido lo marcan las propias
            celdas, y un bloque fijo al lado sólo robaría ancho al mosaico. */}
        <div className="max-w-3xl">
          <p className="flex items-center gap-3">
            <span className="font-display text-sm leading-none text-honey">01</span>
            <span aria-hidden className="h-px w-8 bg-honey/40" />
            <span className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-white/55">
              Ingredientes
            </span>
          </p>
          <h2 className="mt-5 font-heading text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.08] text-white/95">
            Nuestros ingredientes
          </h2>
          <p className="mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/60">
            Cada servicio es un ingrediente. Los combinamos para cocinar la solución perfecta
            para ti.
          </p>
        </div>

        {total === 0 ? (
          /* La API se traga sus errores y devuelve [] (lib/serverApi.ts), así
             que este caso es real en producción si el backend está caído: mejor
             un mensaje honesto que un mosaico vacío. */
          <div className="tech-glass mt-14 grid place-items-center px-6 py-16 text-center">
            <p className="text-white/60">
              Estamos afinando la carta de servicios. Escríbenos y te contamos qué podemos
              cocinar.
            </p>
          </div>
        ) : (
          <ul className="mt-14 grid grid-flow-row-dense auto-rows-[15rem] grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[13.5rem] lg:grid-cols-4">
            {services.map((service, i) => {
              const cell = layout?.[i] ?? PLAIN;
              return (
                <motion.li
                  key={service.id}
                  className={cell.span}
                  initial={reduced ? undefined : { opacity: 0, y: 24 }}
                  whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.04 }}
                >
                  <ServiceBentoCard service={service} index={i} variant={cell.variant} />
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
