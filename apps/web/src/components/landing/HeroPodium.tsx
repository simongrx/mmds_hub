// Podio del hero. En el mockup de referencia es un render 3D fotorrealista;
// aquí es una reconstrucción vectorial estilizada: cilindro con volumen, anillos
// concéntricos rehundidos en la cara superior, luz miel en los filos, badge
// hexagonal con la "M" en la cara frontal y baldosas hexagonales en la base.
//
// Es SVG y no divs porque son anillos elípticos concéntricos con glow: en CSS
// haría falta una pila de pseudo-elementos difícil de mantener.

/** Hexágono de vértice superior centrado en (cx, cy). `squash` lo achata en Y. */
function hex(cx: number, cy: number, r: number, squash = 1) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 180) * (60 * i - 90);
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * squash * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

// Geometría base (viewBox 830×260, el mismo ratio que el podio del mockup).
const CX = 415;
const TOP_Y = 60; // centro de la elipse superior
const BOT_Y = 165; // centro de la elipse inferior del cilindro
const RX = 265; // radio X del cilindro
const RY = 45; // radio Y (perspectiva)

export default function HeroPodium({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 830 260"
      className={className}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      focusable="false"
    >
      <defs>
        {/* Cara frontal: clara arriba, en sombra abajo → da volumen al cilindro. */}
        <linearGradient id="podFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFDF6" />
          <stop offset="35%" stopColor="#F7F0DE" />
          <stop offset="100%" stopColor="#CFBE97" />
        </linearGradient>
        {/* Oscurecido en los laterales para redondear el cilindro. */}
        <linearGradient id="podShade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8C7A50" stopOpacity="0.35" />
          <stop offset="18%" stopColor="#8C7A50" stopOpacity="0" />
          <stop offset="82%" stopColor="#8C7A50" stopOpacity="0" />
          <stop offset="100%" stopColor="#8C7A50" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="podTop" cx="0.5" cy="0.3" r="0.8">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#FBF6E9" />
          <stop offset="100%" stopColor="#E4D6B8" />
        </radialGradient>
        <linearGradient id="podBase" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE5CD" />
          <stop offset="100%" stopColor="#C9B893" />
        </linearGradient>
        <radialGradient id="podDrop" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#6B5A2A" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#6B5A2A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="beeShadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#6B5A2A" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#6B5A2A" stopOpacity="0" />
        </radialGradient>

        <filter id="podGlow" x="-25%" y="-160%" width="150%" height="420%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="podGlowSoft" x="-45%" y="-220%" width="190%" height="540%">
          <feGaussianBlur stdDeviation="13" />
        </filter>
      </defs>

      {/* Sombra proyectada de todo el conjunto. */}
      <ellipse cx={CX} cy={232} rx={400} ry={26} fill="url(#podDrop)" />

      {/* ── Placa base ── */}
      <ellipse cx={CX} cy={205} rx={408} ry={47} fill="url(#podBase)" />
      <ellipse
        cx={CX}
        cy={203}
        rx={408}
        ry={47}
        fill="none"
        stroke="#F4C430"
        strokeWidth="1.6"
        opacity="0.6"
      />
      <g fill="#F4C430" opacity="0.9">
        <polygon points={hex(76, 190, 27, 0.6)} />
        <polygon points={hex(133, 213, 19, 0.6)} opacity="0.7" />
        <polygon points={hex(754, 190, 27, 0.6)} />
        <polygon points={hex(697, 213, 19, 0.6)} opacity="0.7" />
      </g>

      {/* ── Cilindro ── */}
      <ellipse cx={CX} cy={BOT_Y} rx={RX} ry={RY} fill="#C9B893" />
      <rect x={CX - RX} y={TOP_Y} width={RX * 2} height={BOT_Y - TOP_Y} fill="url(#podFace)" />
      <rect x={CX - RX} y={TOP_Y} width={RX * 2} height={BOT_Y - TOP_Y} fill="url(#podShade)" />

      {/* Banda de luz miel a lo ancho de la cara frontal. */}
      <g filter="url(#podGlow)">
        <path
          d={`M${CX - RX + 22} 132 Q ${CX} 146 ${CX + RX - 22} 132`}
          fill="none"
          stroke="#FFD54A"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Trazos de circuito grabados en la cara frontal. */}
      <g fill="none" stroke="#C08D14" strokeWidth="1.5" opacity="0.55">
        <path d="M175 158h48l15-15h42" />
        <path d="M202 176h60" />
        <path d="M655 158h-48l-15-15h-42" />
        <path d="M628 176h-60" />
      </g>

      {/* Badge hexagonal con la "M". */}
      <g>
        <polygon points={hex(CX, 152, 50)} fill="#F4C430" opacity="0.5" filter="url(#podGlowSoft)" />
        <polygon
          points={hex(CX, 152, 41)}
          fill="#F4C430"
          stroke="#FFE07A"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M398 168v-31l17 21 17-21v31"
          fill="none"
          stroke="#1F1F1F"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* ── Cara superior: labio exterior + surco rehundido + disco central ── */}
      <ellipse cx={CX} cy={TOP_Y} rx={RX} ry={RY} fill="url(#podTop)" />
      {/* Filo iluminado del borde superior. */}
      <g filter="url(#podGlow)">
        <ellipse
          cx={CX}
          cy={TOP_Y}
          rx={RX}
          ry={RY}
          fill="none"
          stroke="#FFD54A"
          strokeWidth="2.4"
          opacity="0.85"
        />
      </g>
      {/* Surco: relleno más oscuro que el labio, con luz miel en su borde. */}
      <ellipse cx={CX} cy={TOP_Y + 3} rx={222} ry={37} fill="#EADDC0" />
      <ellipse
        cx={CX}
        cy={TOP_Y + 3}
        rx={222}
        ry={37}
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2"
        opacity="0.85"
      />
      {/* Disco central elevado. */}
      <ellipse cx={CX} cy={TOP_Y + 5} rx={186} ry={31} fill="#FFFDF7" />
      <g filter="url(#podGlow)">
        <ellipse
          cx={CX}
          cy={TOP_Y + 5}
          rx={148}
          ry={24}
          fill="none"
          stroke="#F4C430"
          strokeWidth="1.8"
          opacity="0.8"
        />
      </g>
      <ellipse cx={CX} cy={TOP_Y + 6} rx={104} ry={16} fill="#FFFFFF" />

      {/* Sombra de contacto de la abeja sobre el disco. */}
      <ellipse cx={CX} cy={TOP_Y + 2} rx={112} ry={19} fill="url(#beeShadow)" />
    </svg>
  );
}
