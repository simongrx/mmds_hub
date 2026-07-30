// Ilustraciones de los ingredientes (ver lib/ingredients.ts).
//
// Hermanas de serviceIcons.tsx pero NO son lo mismo: aquellos son glifos de UI
// de 24×24 que acompañan a un texto; estos son ilustraciones que ocupan media
// tarjeta del bento. De ahí el lienzo grande (120×120) y el trazo más grueso:
// a tamaño de ilustración, un trazo de 1.8 sobre un viewBox de 24 se rompe.
//
// Contrato del set — romperlo es lo que hace que un conjunto se lea como
// recortado de dos sitios distintos:
//   · viewBox 0 0 120 120, sin `fill`, color heredado con `currentColor`
//   · 2.2 en el contorno principal, 1.4 y opacidad .55 en el detalle interior
//   · uniones y remates redondeados
//   · nada más ancho de ~106 unidades, para que los siete casen ópticamente
//     al mismo tamaño renderizado

type IconProps = {
  className?: string;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Art({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden focusable="false">
      <g {...stroke}>{children}</g>
    </svg>
  );
}

/** Grupo de detalle interior: siempre más fino y más apagado que el contorno.
    Es lo que da profundidad sin que la ilustración se emborrone a tamaño
    pequeño (en las celdas 1×1 el detalle casi desaparece, y está bien). */
function Detail({ children }: { children: React.ReactNode }) {
  return (
    <g strokeWidth="1.4" opacity="0.55">
      {children}
    </g>
  );
}

/** Pan — Desarrollo Web. Hogaza de campo: corteza, greñado y vapor. */
export function PanIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <path d="M14 78c0-24 16-42 46-42s46 18 46 42c0 8-6 12-14 12H28c-8 0-14-4-14-12Z" />
      <path d="M22 96h76" />
      <Detail>
        <path d="M40 72l10-15M58 74l10-15M76 72l10-15" />
        <path d="M50 26c4-4 0-9 4-13M72 26c4-4 0-9 4-13" />
      </Detail>
    </Art>
  );
}

/** Papas — Apps. Cono de fritas con tres bastones asomando. */
export function PapasIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <path d="M38 54h44l-6 44a7 7 0 0 1-7 6H51a7 7 0 0 1-7-6Z" />
      <path d="M47 54V30a3.5 3.5 0 0 1 7 0v24" />
      <path d="M57 54V20a3.5 3.5 0 0 1 7 0v34" />
      <path d="M67 54V34a3.5 3.5 0 0 1 7 0v20" />
      <Detail>
        <path d="M41 70h38" />
        <path d="M58 70v34" />
      </Detail>
    </Art>
  );
}

/** Ají — IA. Vaina curva con tallo y nervaduras. */
export function AjiIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <path d="M78 42c8 13 5 32-7 44-11 11-28 13-35 5-5-6-2-14 6-17 9-3 17-3 23-11 5-7 4-16 7-22 2-3 4-2 6 1Z" />
      <path d="M78 42l-5-15" />
      <path d="M73 27c-7-5-14-3-16 2" />
      <Detail>
        <path d="M64 58c4 9 1 20-6 26" />
        <path d="M52 76c3 5 2 11-2 15" />
      </Detail>
    </Art>
  );
}

/** Pimienta — Meta Ads. Molinillo con tapa hexagonal: el hexágono es el motivo
    que ya usan el podio del hero y las placas de servicio. */
export function PimientaIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <path d="M60 14l14 8v16l-14 8-14-8V22Z" />
      <path d="M46 48h28l6 46a8 8 0 0 1-8 9H48a8 8 0 0 1-8-9Z" />
      <Detail>
        <path d="M43 68h34M42 84h36" />
        <path d="M60 30v8" />
      </Detail>
    </Art>
  );
}

/** Limón — Automatizaciones. Corte transversal con gajos radiales. */
export function LimonIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <circle cx="60" cy="62" r="36" />
      <circle cx="60" cy="62" r="28" />
      <path d="M60 34v-8c0-5 4-8 9-8" />
      <Detail>
        <path d="M60 62 88 62M60 62 74 38M60 62 46 38M60 62 32 62M60 62 46 86M60 62 74 86" />
      </Detail>
    </Art>
  );
}

/** Miel — Branding. Cazo de miel con sus anillos y la gota cayendo. */
export function MielIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <path d="M60 14v24" />
      <path d="M46 38h28c0 20-6 36-14 36s-14-16-14-36Z" />
      <path d="M60 82c5 7 8 12 8 16a8 8 0 0 1-16 0c0-4 3-9 8-16Z" />
      <Detail>
        <path d="M46 50h28M48 62h24M52 71h16" />
      </Detail>
    </Art>
  );
}

/** Especias — Contenido. Cuenco con montículo y granos suspendidos. */
export function EspeciasIcon({ className }: IconProps) {
  return (
    <Art className={className}>
      <path d="M20 72h80c0 19-18 32-40 32S20 91 20 72Z" />
      <path d="M38 72c4-13 12-21 22-21s18 8 22 21" />
      <Detail>
        <path d="M30 88c8 5 18 8 30 8s22-3 30-8" />
      </Detail>
      <g strokeWidth="3.4" opacity="0.7">
        <path d="M44 36h.01M62 26h.01M80 38h.01M70 46h.01" />
      </g>
    </Art>
  );
}

/** slug del servicio → ilustración del ingrediente. Mismas claves que
    INGREDIENTS en lib/ingredients.ts y que SERVICE_ICONS. */
const INGREDIENT_ART: Record<string, (props: IconProps) => JSX.Element> = {
  "desarrollo-web": PanIcon,
  apps: PapasIcon,
  ia: AjiIcon,
  "meta-ads": PimientaIcon,
  automatizaciones: LimonIcon,
  branding: MielIcon,
  contenido: EspeciasIcon,
};

/**
 * Ilustración del ingrediente de un servicio. Devuelve `null` si el slug no
 * está mapeado: quien la use decide el plan B (el bento cae al icono de
 * servicio, ver ServiceBentoCard). Se prefiere null a un placeholder porque una
 * ilustración genérica a media tarjeta se nota mucho más que un icono pequeño.
 */
export function IngredientArt({ slug, className }: { slug: string; className?: string }) {
  const Mapped = INGREDIENT_ART[slug];
  if (!Mapped) return null;
  return <Mapped className={className} />;
}

/** Para saber de antemano si hay ilustración, sin renderizarla. */
export function hasIngredientArt(slug: string): boolean {
  return slug in INGREDIENT_ART;
}
