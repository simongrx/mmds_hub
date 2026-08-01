// Iconografía de los servicios y del tramo oscuro de la home.
//
// Los servicios llegan de la API con un emoji en `icon` (ver apps/api/prisma/
// seed.ts). El dato de la BD no se toca: aquí se mapea el `slug` a un SVG y el
// emoji queda como reserva, así un servicio nuevo en la BD renderiza algo
// razonable en vez de un hueco.
//
// Misma convención que components/icons/index.tsx: viewBox 0 0 24 24,
// `currentColor`, trazo 2 con uniones redondeadas, y el tamaño se controla
// desde fuera con clases. Todo el set es de contorno: mezclar relleno y
// contorno en el mismo nivel de jerarquía es lo que hace que un set se lea
// como recortado de dos sitios distintos.

type IconProps = {
  className?: string;
};

/** Props comunes de los iconos de contorno del set. */
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <g {...stroke}>{children}</g>
    </svg>
  );
}

/** Globo — Desarrollo Web. */
export function GlobeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.4 2.5 3.7 5.7 3.7 9s-1.3 6.5-3.7 9c-2.4-2.5-3.7-5.7-3.7-9S9.6 5.5 12 3Z" />
    </Svg>
  );
}

/** Teléfono — Apps. */
export function MobileIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.6" />
      <path d="M10.4 5.6h3.2" />
      <path d="M12 18.3h.01" />
    </Svg>
  );
}

/** Chip — IA. */
export function ChipIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="2.6" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
      <path d="M9.6 3v3.5M14.4 3v3.5M9.6 17.5V21M14.4 17.5V21M3 9.6h3.5M3 14.4h3.5M17.5 9.6H21M17.5 14.4H21" />
    </Svg>
  );
}

/** Tendencia al alza — Meta Ads. */
export function TrendIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M3 17.6 9.6 11l4 4L21 7.4" />
      <path d="M14.8 7.4H21v6.2" />
    </Svg>
  );
}

/** Rayo de contorno — Automatizaciones. El BoltIcon de index.tsx es macizo y
    vive en la barra del hero; aquí hace falta la versión de contorno para no
    romper la coherencia del set. */
export function BoltOutlineIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M13.4 2.6 5.6 13.6h5.1L9.9 21.4 18 10.1h-5.2z" />
    </Svg>
  );
}

/** Paleta — Branding. */
export function PaletteIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M12 3a9 9 0 0 0 0 18c1.2 0 2-.8 2-1.9 0-1.1-.8-1.8-.8-2.7 0-.9.7-1.6 1.6-1.6h1.5A4.7 4.7 0 0 0 21 10.1C21 6.1 16.9 3 12 3Z" />
      <path d="M7.7 10.5h.01M11 7.5h.01M15.2 8.7h.01" strokeWidth="2.2" />
    </Svg>
  );
}

/** Cámara de video — Contenido. */
export function VideoIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="2.6" y="6.4" width="12.4" height="11.2" rx="2.6" />
      <path d="M15 11.2l6.4-3.7v9.4L15 13.2z" />
    </Svg>
  );
}

/** Estrella de las valoraciones. Va maciza a propósito: una estrella de
    contorno no comunica "puntuación llena" — y son un indicador de dato, no
    parte del set de navegación, así que no compite con los de arriba. */
export function StarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false">
      <path
        d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Check del estado de éxito del formulario (sustituye al 🎉). */
export function CheckIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4.6 12.6 9.5 17.5 19.4 6.6" strokeWidth="2.2" />
    </Svg>
  );
}

/** Chevron hacia abajo. Lo usaba el indicador de scroll de la costura oscura
    que había tras el hero; se quedó sin consumidor al pasar la home a claro. */
export function ChevronDownIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="m6 9.5 6 6 6-6" />
    </Svg>
  );
}

/** slug del servicio → icono. Las claves son los slugs sembrados en la API. */
const SERVICE_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  "desarrollo-web": GlobeIcon,
  apps: MobileIcon,
  ia: ChipIcon,
  "meta-ads": TrendIcon,
  automatizaciones: BoltOutlineIcon,
  branding: PaletteIcon,
  contenido: VideoIcon,
};

/**
 * Icono de un servicio. Si el slug no está en el mapa cae al emoji que trae la
 * BD: preferimos un emoji suelto a que un servicio recién creado desde el panel
 * salga sin nada.
 */
export function ServiceIcon({
  slug,
  icon,
  className,
}: {
  slug: string;
  icon?: string | null;
  className?: string;
}) {
  const Mapped = SERVICE_ICONS[slug];
  if (Mapped) return <Mapped className={className} />;
  return (
    <span className={`grid place-items-center leading-none ${className ?? ""}`} aria-hidden>
      {icon ?? "🍯"}
    </span>
  );
}
