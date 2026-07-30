// Set de iconos SVG del sitio. Sustituyen a los emoji que se usaban como
// iconografía estructural (dependían de la fuente del sistema, no se podían
// tematizar y rompían la consistencia entre plataformas).
//
// Convención: viewBox 0 0 24 24, `currentColor`, y el tamaño se controla desde
// fuera con clases (`h-* w-*`). Los trazos usan grosor 2 y uniones redondeadas.

type IconProps = {
  className?: string;
};

// Hexágono de vértice superior, con esquinas redondeadas conseguidas pintando
// el mismo color en fill y stroke con linejoin="round".
const HEX_POINTS = "12,1.6 21.2,6.8 21.2,17.2 12,22.4 2.8,17.2 2.8,6.8";

// El logo de marca ya no es un hexágono SVG: es el isotipo real
// (ver components/BrandMark.tsx). HEX_POINTS lo sigue usando HexOutline.

/** Hexágono en contorno con la "M": usado en los paneles holográficos y el podio. */
export function HexOutline({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <polygon
        points={HEX_POINTS}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.6 15.8V9.2l3.4 4.1 3.4-4.1v6.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Rayo — "estrategias que conectan". */
export function BoltIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path d="M13.6 2 5 13.4h5.2L9.8 22l8.8-11.6h-5.4z" fill="currentColor" />
    </svg>
  );
}

/** Barras — "soluciones que transforman". */
export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <g fill="currentColor">
        <rect x="3.5" y="13" width="4" height="8" rx="1.2" />
        <rect x="10" y="8" width="4" height="13" rx="1.2" />
        <rect x="16.5" y="3.5" width="4" height="17.5" rx="1.2" />
      </g>
    </svg>
  );
}

/** Corazón — "resultados que perduran". */
export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M12 20.6 3.9 12.6a5 5 0 0 1 7.1-7.1l1 1 1-1a5 5 0 0 1 7.1 7.1z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Flecha diagonal de los CTA ("Ver servicios ↗"). */
export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M7 17 17 7M8.5 7H17v8.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hamburguesa del menú móvil. */
export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Cierre del menú móvil. */
export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Mapa id → componente, para resolver `HERO_FEATURES[].icon`. */
export const FEATURE_ICONS = {
  bolt: BoltIcon,
  chart: ChartIcon,
  heart: HeartIcon,
} as const;
