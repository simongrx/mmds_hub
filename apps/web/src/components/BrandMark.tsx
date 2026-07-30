/**
 * Isotipo de Miel Mostaza (tarro-abeja). Sustituye al hexágono SVG que hacía de
 * marcador de posición.
 *
 * El asset es un recorte cuadrado de `public/images/logo.png` (1024², 1.4 MB con
 * mucho margen transparente alrededor): a los 32-40 px a los que se pinta, el
 * original habría bajado 1.4 MB para renderizar ~15 px de dibujo útil.
 *
 * `<img>` en vez de next/image por el mismo motivo que la abeja del hero:
 * `sharp` no está instalado, así que el optimizador de Next no aportaría nada.
 *
 * Decorativo (`alt=""`): en los dos sitios donde se usa va acompañado del
 * nombre de la marca en texto, así que anunciarlo sería redundante.
 */
export default function BrandMark({ className }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/logo-mark.png"
      width={256}
      height={256}
      alt=""
      aria-hidden
      decoding="async"
      className={className}
    />
  );
}
