"use client";

import { usePointerGlow } from "./usePointerGlow";

// Palabra del lettering gigante con acabado de vidrio. Tres capas con el mismo
// texto superpuestas (los estilos viven en globals.css porque son propiedades
// acopladas entre sí, varias con prefijo -webkit-):
//   1. bloom  — copia desenfocada detrás: el halo claro que despega el cristal
//               oscuro del fondo, ya que `backdrop-filter` no se puede aplicar
//               glifo a glifo;
//   2. fill   — el relleno visible: cristal con tinte café oscuro recortado al
//               texto, translúcido para que las nubes se vean a través;
//   3. rim    — sólo el contorno de las letras, atenuado con una máscara radial
//               que sigue al cursor: es el reflejo que recorre los bordes.
//
// El `scaleX()` de compresión va en el contenedor, así que las tres capas se
// deforman igual. La luz se posiciona en % (ver usePointerGlow) para que ese
// escalado no la descoloque.
export default function HeroGlassWord({
  children,
  className,
  fontSize,
  squeeze,
}: {
  children: string;
  className?: string;
  fontSize: string;
  squeeze: string;
}) {
  const ref = usePointerGlow<HTMLSpanElement>();

  return (
    <span
      ref={ref}
      className={`hero-glass-word ${className ?? ""}`}
      style={{ fontSize, transform: squeeze }}
    >
      <span aria-hidden className="hero-glass-word__bloom">
        {children}
      </span>
      <span className="hero-glass-word__fill">{children}</span>
      <span aria-hidden className="hero-glass-word__rim">
        {children}
      </span>
    </span>
  );
}
