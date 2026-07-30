// Cabecera común de las secciones del tramo oscuro. Antes cada sección repetía
// el mismo bloque `text-center` con h2 + lead; ahora comparten esta pieza y lo
// que las diferencia es el número de capítulo, que es lo que da la sensación de
// recorrido.
//
// El número va en Agdasima (la display del lettering del hero) para que el
// tramo oscuro herede algo tipográfico del hero y no sólo la paleta.

export default function SectionHeading({
  index,
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  /** Número de capítulo, ya formateado ("01"). */
  index: string;
  /** Etiqueta corta en versales ("INGREDIENTES"). */
  eyebrow: string;
  title: string;
  lead: string;
  align?: "left" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    <div className={`${centered ? "text-center" : ""} ${className ?? ""}`}>
      <p
        className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      >
        <span className="font-display text-sm leading-none text-honey">{index}</span>
        <span aria-hidden className="h-px w-8 bg-honey/40" />
        <span className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-white/55">
          {eyebrow}
        </span>
      </p>
      {/* Bastante mayor que el 3xl/4xl de antes: en un fondo oscuro y con tanto
          aire alrededor, un titular pequeño se lee como un subtítulo. */}
      <h2 className="mt-5 font-heading text-[clamp(2rem,4.6vw,3.4rem)] font-bold leading-[1.08] text-white/95">
        {title}
      </h2>
      <p
        className={`mt-4 max-w-xl text-[1.0625rem] leading-relaxed text-white/60 ${centered ? "mx-auto" : ""}`}
      >
        {lead}
      </p>
    </div>
  );
}
