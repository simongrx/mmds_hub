// Marcas de las redes sociales, para el pie.
//
// Van aparte del set general por dos motivos: son logotipos ajenos y no
// iconografía propia (no se pueden retocar ni reinterpretar sin dejar de ser
// reconocibles), y son los únicos del repo que se dibujan con `fill` en vez de
// con trazo, porque así es como están definidos oficialmente.
//
// Misma convención en lo demás: viewBox 0 0 24 24, `currentColor`, el tamaño se
// controla desde fuera con clases, y una sola prop `className`.
//
// El mapa de abajo lo consume LandingFooter contra `SOCIAL` de lib/brand.ts.
// Mientras ese array esté vacío, estos iconos no se renderizan en ningún sitio:
// un icono de LinkedIn que no lleva a ningún LinkedIn es peor que no tenerlo.

type IconProps = {
  className?: string;
};

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.5h4v11H3v-11ZM9.5 9.5h3.83v1.5h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.75v5.7h-4v-5.05c0-1.2-.02-2.75-1.75-2.75-1.75 0-2.02 1.31-2.02 2.66v5.14h-4v-11Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false" fill="currentColor">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.8c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.18.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.42-.35 1.04-.4 2.18-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.18.21.55.47.94.88 1.35.41.41.8.67 1.35.88.42.16 1.04.35 2.18.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.18-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.42.35-1.04.4-2.18.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.18a3.64 3.64 0 0 0-.88-1.35 3.64 3.64 0 0 0-1.35-.88c-.42-.16-1.04-.35-2.18-.4-1.24-.06-1.59-.07-4.74-.07Zm0 3.06a4.98 4.98 0 1 1 0 9.96 4.98 4.98 0 0 1 0-9.96Zm0 8.21a3.23 3.23 0 1 0 0-6.46 3.23 3.23 0 0 0 0 6.46Zm6.34-8.41a1.16 1.16 0 1 1-2.33 0 1.16 1.16 0 0 1 2.33 0Z" />
    </svg>
  );
}

export function BehanceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden focusable="false" fill="currentColor">
      <path d="M8.3 5.6c.72 0 1.37.06 1.96.19.59.12 1.09.32 1.5.6.42.28.74.66.97 1.13.23.47.34 1.06.34 1.75 0 .75-.17 1.37-.51 1.87-.34.5-.85.9-1.52 1.22.92.26 1.6.72 2.05 1.38.45.66.68 1.45.68 2.38 0 .75-.15 1.4-.44 1.94-.29.55-.68.99-1.17 1.34-.49.34-1.05.6-1.68.76-.63.16-1.28.24-1.94.24H2V5.6h6.3Zm-.37 5.65c.59 0 1.08-.14 1.46-.42.38-.28.57-.74.57-1.37 0-.35-.06-.64-.19-.87a1.4 1.4 0 0 0-.51-.53 2.1 2.1 0 0 0-.73-.27 4.7 4.7 0 0 0-.86-.07H4.94v3.53h2.99Zm.17 5.93c.33 0 .64-.03.94-.1.3-.06.56-.17.78-.32.22-.15.4-.36.53-.62.13-.26.2-.6.2-1 0-.79-.22-1.35-.66-1.69-.44-.34-1.03-.51-1.75-.51H4.94v4.24h3.16ZM17.5 16.9c.4.39.97.58 1.71.58.53 0 .99-.13 1.38-.4.38-.27.62-.55.71-.85h2.19c-.35 1.09-.89 1.87-1.61 2.34-.72.47-1.6.7-2.63.7-.72 0-1.36-.11-1.94-.34a4.06 4.06 0 0 1-1.46-.98 4.4 4.4 0 0 1-.92-1.52 5.6 5.6 0 0 1-.32-1.94c0-.68.11-1.32.33-1.9.22-.59.53-1.1.94-1.53.4-.43.89-.77 1.45-1.02a4.7 4.7 0 0 1 1.92-.37c.79 0 1.48.15 2.07.46.59.31 1.07.72 1.45 1.24.38.52.65 1.11.81 1.78.17.66.23 1.36.18 2.09h-6.68c.04.86.25 1.48.65 1.87Zm3.04-5.06c-.32-.35-.8-.52-1.45-.52-.42 0-.78.07-1.06.22-.28.14-.5.32-.67.53-.17.21-.28.44-.35.68-.06.24-.1.46-.11.65h4.14c-.12-.65-.33-1.13-.65-1.48-.32-.35.32.35 0 0ZM16.03 6.7h5.19v1.44h-5.19V6.7Z" />
    </svg>
  );
}

/** id → componente. Lo consume LandingFooter contra `SOCIAL` de lib/brand.ts. */
export const SOCIAL_ICONS = {
  linkedin: LinkedInIcon,
  instagram: InstagramIcon,
  behance: BehanceIcon,
} as const;
