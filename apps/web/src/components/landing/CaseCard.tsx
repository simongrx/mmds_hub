"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpRight } from "@/components/icons";
import { ServiceIcon } from "@/components/icons/serviceIcons";
import { usePointerVars } from "@/hooks/usePointerVars";
import CaseVisual from "./CaseVisual";
import type { PortfolioItem } from "@/lib/serverApi";

// Una celda del mosaico de casos.
//
// Es pulsable sólo si el caso tiene sitio publicado (`project.url`): abre esa
// web en otra pestaña. Los que no lo tengan siguen siendo un `article` inerte,
// porque no hay ruta pública de detalle de caso (/proyecto/[accessToken] es el
// portal privado del cliente) y una tarjeta que parece pulsable y no lleva a
// ningún sitio es peor que una que no lo parece.

/** La celda ancha manda: se permite el índice gigante y la descripción. Las
    medianas comparten fila y ahí ese peso tipográfico las ahoga. */
export type CaseVariant = "hero" | "half";

function Chips({ project, max }: { project: PortfolioItem; max: number }) {
  const shown = project.services.slice(0, max);
  const extra = project.services.length - shown.length;

  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {shown.map((s) => (
        <li
          key={s.slug}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 py-1.5 pl-2 pr-3.5 text-xs font-medium text-white/80 backdrop-blur-sm"
        >
          <span
            aria-hidden
            className="grid h-6 w-6 place-items-center [clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)] bg-honey/20 text-honey"
          >
            <ServiceIcon slug={s.slug} icon={s.icon} className="h-3.5 w-3.5 text-[0.7rem]" />
          </span>
          {s.name}
        </li>
      ))}
      {extra > 0 && (
        <li className="inline-flex items-center rounded-full border border-white/12 bg-black/40 px-3 py-1.5 text-xs font-medium text-white/60 backdrop-blur-sm">
          +{extra}
        </li>
      )}
    </ul>
  );
}

export default function CaseCard({
  project,
  index,
  variant,
  image,
}: {
  project: PortfolioItem;
  index: number;
  variant: CaseVariant;
  /** Ruta pública de la foto, ya verificada en servidor (lib/caseImages.ts). */
  image?: string;
}) {
  const onPointerMove = usePointerVars();
  // Red de seguridad: la existencia se comprueba en servidor, pero el fichero
  // puede borrarse entre el render y la carga, o estar corrupto.
  const [broken, setBroken] = useState(false);
  const hero = variant === "hero";
  const hasPhoto = Boolean(image) && !broken;
  const url = project.url?.trim();

  // El contenedor cambia de etiqueta según haya sitio que visitar, pero no de
  // aspecto: las clases son las mismas para que el mosaico no se descuadre
  // cuando unos casos tengan enlace y otros no.
  const Tag = url ? "a" : "article";
  const linkProps = url
    ? {
        href: url,
        // Se abre fuera: el visitante está recorriendo la landing y no
        // queremos sacarlo de ella. `noreferrer` incluye el comportamiento de
        // `noopener`, que es lo que evita que la pestaña destino pueda
        // manipular la de origen.
        target: "_blank" as const,
        rel: "noreferrer" as const,
      }
    : {};

  return (
    <Tag
      {...linkProps}
      onPointerMove={onPointerMove}
      // La tarjeta sigue siendo oscura aunque la página sea clara, y a propósito:
      // foto + velo + texto blanco sobre cielo azul es el mejor contraste de
      // toda la home. Lo que sí cambia por el fondo nuevo: el borde tenue de
      // antes era invisible contra un cielo brillante, y sin sombra las
      // tarjetas flotaban sin apoyarse en nada. `.tech-spot` se queda porque el
      // interior de la tarjeta es oscuro y ahí el halo miel es el correcto.
      className={`tech-spot group relative isolate flex h-full flex-col justify-end overflow-hidden rounded-2xl border border-white/30 shadow-[0_28px_60px_-24px_rgba(70,55,15,0.55)] ${
        url
          ? "transition-colors duration-300 hover:border-honey/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          : ""
      }`}
    >
      {hasPhoto && image ? (
        <Image
          src={image}
          alt=""
          fill
          // La celda ancha ocupa el contenedor entero en escritorio y las
          // medianas la mitad; por debajo de lg todas van a ancho completo.
          sizes={hero ? "(min-width: 1024px) 1280px, 100vw" : "(min-width: 1024px) 640px, 100vw"}
          onError={() => setBroken(true)}
          className="-z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
        />
      ) : (
        <CaseVisual project={project} className="absolute inset-0 -z-10 h-full w-full" />
      )}

      {/* Velo. Con foto tiene que ser opaco: el texto blanco se pierde en
          cualquier imagen clara. Con el visual generado se queda en la mitad,
          porque ese panel ya nace oscuro y trae su propio viñeteado — al
          aplicarle el velo completo se comía las trazas y el anillo, y la
          tarjeta quedaba plana. */}
      <div
        aria-hidden
        className={`absolute inset-0 -z-10 bg-gradient-to-t to-transparent ${
          hasPhoto ? "from-black/85 via-black/40 via-45%" : "from-black/70 via-transparent via-55%"
        }`}
      />

      <div className="relative p-6 sm:p-7">
        {/* Índice gigante en contorno: mismo recurso que el lettering del hero
            (relleno transparente, la letra la dibuja el canto). Sólo en la
            celda ancha. */}
        {hero && (
          <p
            aria-hidden
            className="font-display text-[clamp(3rem,6vw,5.5rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1.5px_rgba(244,196,48,0.45)]"
          >
            {String(index + 1).padStart(2, "0")}
          </p>
        )}

        {project.client?.company && (
          <p
            className={`font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-honey ${
              hero ? "mt-6" : ""
            }`}
          >
            {project.client.company}
          </p>
        )}

        <h3
          className={`mt-2 font-heading font-bold leading-[1.15] text-white/95 ${
            hero ? "text-[clamp(1.6rem,3vw,2.5rem)]" : "text-[clamp(1.25rem,2vw,1.6rem)]"
          }`}
        >
          {project.name}
        </h3>

        {project.description && (
          <p
            className={`mt-3 max-w-xl text-[0.95rem] leading-relaxed text-white/70 ${
              hero ? "line-clamp-3" : "line-clamp-2"
            }`}
          >
            {project.description}
          </p>
        )}

        <Chips project={project} max={hero ? 4 : 2} />

        {/* Señal de que la tarjeta lleva a algún sitio. Sin esto la única pista
            sería el cursor, que no existe en táctil ni al navegar con teclado.
            El texto dice el destino ("Visitar el sitio") en lugar de un "ver
            más" genérico, y el aviso de que abre fuera va en un span sólo para
            lectores de pantalla. */}
        {/* Botón redondo de la celda ancha. Es DECORATIVO: la tarjeta entera ya
            es el enlace y el aviso de que abre fuera ya está más abajo. Meterlo
            como <a> anidado sería HTML inválido y una segunda parada de
            tabulación para el mismo destino. */}
        {hero && url && (
          <span
            aria-hidden
            className="absolute bottom-6 right-6 grid h-12 w-12 place-items-center rounded-full bg-honey text-ink shadow-[0_10px_24px_rgba(60,38,4,0.35)] transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transform-none"
          >
            <ArrowUpRight className="h-5 w-5" />
          </span>
        )}

        {url && (
          <p className="mt-5 inline-flex items-center gap-1.5 font-heading text-sm font-semibold text-honey">
            Visitar el sitio
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
            <span className="sr-only">(se abre en una pestaña nueva)</span>
          </p>
        )}
      </div>
    </Tag>
  );
}
