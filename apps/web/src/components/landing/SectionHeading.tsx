import Link from "next/link";
import { ArrowUpRight } from "@/components/icons";

// Cabecera común de las secciones de la home. Antes cada sección repetía el
// mismo bloque con h2 + lead; ahora comparten esta pieza y lo que las diferencia
// es el número de capítulo, que es lo que da la sensación de recorrido.
//
// El número va en Agdasima (la display del lettering del hero) para que las
// secciones hereden algo tipográfico del hero y no sólo la paleta.
//
// ── `tone` ──
// El tramo bajo el hero pasó de oscuro a luminoso, pero /contacto y la sección
// de testimonios siguen sobre fondo oscuro. De ahí las dos versiones. El default
// es `dark` para no tener que tocar a quien ya la usaba.
//
// En claro la miel NO puede ser `honey`: sobre blanco da 1,7:1 y no se lee. Va
// `honey-ink`, que es el mismo tono bajado en luminancia (ver tailwind.config).
//
// ── `action` ──
// En el tramo luminoso la cabecera vive en su propia columna a la izquierda y
// lleva el botón de la sección debajo del lead, así que el botón es parte de la
// cabecera y no algo que cada sección monte por su cuenta.

export interface HeadingAction {
  href: string;
  label: string;
  /** Enlace externo: sale en pestaña nueva y no pasa por el router. */
  external?: boolean;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  titleAccent,
  lead,
  align = "left",
  tone = "dark",
  display = false,
  action,
  className,
  children,
}: {
  /** Número de capítulo, ya formateado ("01"). Opcional: la sección de cifras
      va sin número porque puede no renderizarse y dejaría un hueco en la serie. */
  index?: string;
  /** Etiqueta corta en versales ("INGREDIENTES"). */
  eyebrow: string;
  title: string;
  /** Segunda línea del titular, con relleno dorado. Sin ella el titular es un
      string desnudo y el marcado queda exactamente igual que antes de existir
      esta prop — de ahí que ninguno de los llamantes que no la usan cambie.
      Las dos líneas son bloques, así que el nombre accesible del h2 sale
      "Título Acento" sin necesidad de aria-label. */
  titleAccent?: string;
  lead: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  /** Titular en Agdasima y versales, como el lettering del hero. Es el registro
      de los capítulos que van sobre foto: ahí el titular compite con el cielo y
      necesita el peso y la condensación de la display. */
  display?: boolean;
  action?: HeadingAction;
  className?: string;
  /** Se pinta debajo del lead y encima del botón. Lo usa el carrusel de
      ingredientes para meter sus controles dentro de la columna de la cabecera. */
  children?: React.ReactNode;
}) {
  const centered = align === "center";
  const light = tone === "light";

  const accent = light ? "text-honey-ink" : "text-honey";
  const rule = light ? "bg-mustard-dark/50" : "bg-honey/40";
  const eyebrowColor = light ? "text-ink/60" : "text-white/55";
  const titleColor = light ? "text-ink" : "text-white/95";
  const leadColor = light ? "text-ink/70" : "text-white/60";

  return (
    <div className={`${centered ? "text-center" : ""} ${className ?? ""}`}>
      <p className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        {index && (
          <span className={`font-display text-sm leading-none ${accent}`}>{index}</span>
        )}
        <span aria-hidden className={`h-px w-8 ${rule}`} />
        <span
          className={`font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] ${eyebrowColor}`}
        >
          {eyebrow}
        </span>
      </p>

      {/* Bastante mayor que el 3xl/4xl de antes: con tanto aire alrededor, un
          titular pequeño se lee como un subtítulo. En display sube otro escalón
          y pierde el interlineado: Agdasima es condensada y en versales aguanta
          el 0.86 sin que las líneas se toquen. */}
      <h2
        className={`mt-5 font-bold ${titleColor} ${
          display
            ? "font-display text-[clamp(2.8rem,6.4vw,5.4rem)] uppercase leading-[0.86] tracking-[-0.01em]"
            : "font-heading text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.08]"
        }`}
      >
        {titleAccent ? (
          <>
            <span className="block">{title}</span>
            <span className="title-gold block">{titleAccent}</span>
          </>
        ) : (
          title
        )}
      </h2>

      <p
        className={`mt-4 max-w-xl text-[1.0625rem] leading-relaxed ${leadColor} ${centered ? "mx-auto" : ""}`}
      >
        {lead}
      </p>

      {action && <HeadingButton action={action} light={light} />}

      {children}
    </div>
  );
}

/** Píldora de tinta. No es miel: sobre cielo brillante el borde de un botón
    miel se queda en 1,7:1 de contraste y falla el mínimo de elementos no
    textuales. La miel vuelve en el hover, que es donde se puede permitir. */
function HeadingButton({ action, light }: { action: HeadingAction; light: boolean }) {
  const cls =
    "mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full px-6 py-3 font-heading text-sm font-semibold transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 " +
    (light
      ? "bg-ink text-white shadow-[0_14px_30px_-14px_rgba(60,38,4,0.6)] hover:bg-honey hover:text-ink focus-visible:outline-ink"
      : "bg-honey text-ink hover:bg-mustard focus-visible:outline-honey");

  const content = (
    <>
      {action.label}
      <ArrowUpRight className="h-4 w-4" />
    </>
  );

  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={cls}>
        {content}
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    );
  }

  return (
    <Link href={action.href} className={cls}>
      {content}
    </Link>
  );
}
