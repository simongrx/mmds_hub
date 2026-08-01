"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

// El goteo de miel que remata por abajo las hojas blancas (Proceso e Impacto),
// que el hero suelta en su canto y que hace de fleco del portal (HoneyGate).
//
// ── Por qué es un SVG y no la foto ──
//
// Antes esto salía de `separador.webp`, un panel blanco con goteo sobre negro
// OPACO. Sin canal alfa había que o mezclarlo con `screen` —que sobre fondo
// claro borra el goteo, porque `screen(crema, dorado) ≈ crema`— o derivarle un
// alfa por luminancia y arrastrar un PNG de 142 KB. Dibujado pesa nada, escala
// sin perder nitidez y se puede recolorear desde CSS.
//
// ── EL CANTO DE ARRIBA NO ES RECTO, Y ESE ES EL PUNTO ──
//
// La hoja blanca muere en un arco elíptico: `border-radius: 50% / --sheet-curve`
// (ver `.sky-sheet` en globals.css), o sea radio horizontal = medio ancho y
// radio vertical = la curva. Ese canto está a ras del pie de la sección en el
// centro y sube hasta `--sheet-curve` en los laterales.
//
// Cuando este SVG arrancaba con `M0 0 H1200 V26` —techo recto— y se colgaba con
// un `translate-y`, en el centro solapaba y en los laterales dejaba a la vista
// hasta 58 px de la foto de debajo. La miel no salía de la hoja: aparecía por su
// cuenta, con una raya recta contra un canto curvo.
//
// Ahora el techo de la figura ES esa misma elipse (`arcAt`) y todo el canto de
// abajo va desplazado por ella, así que la banda tiene grosor constante y
// cabalga sobre la curva.
//
// ── Por qué hay que MEDIR y no se puede resolver en CSS ──
//
// La curva llega en `clamp(1.25rem, 3.6vw, 4rem)`: su proporción respecto al
// ancho cambia con el viewport (43,2 unidades de viewBox a 1200 px de ancho, 64
// a 375, 30 a 2560). Un `d` estático no puede seguir eso, y
// `getPropertyValue('--sheet-curve')` devuelve el `clamp(...)` sin resolver.
//
// De ahí la sonda: un div de ancho cero con `height: var(--sheet-curve)`, cuyo
// alto SÍ está resuelto en píxeles. Con eso y el ancho del envoltorio sale la
// profundidad del arco en unidades de viewBox, y un `ResizeObserver` la vuelve a
// sacar en cada cambio de tamaño.
//
// ── Que se lea como líquido y no como una figura ──
//
// Dos palancas, independientes entre sí:
//
//   · VOLUMEN, sin filtros — el degradado va a cinco paradas (reflejo, miel,
//     núcleo ámbar, miel, canto retroiluminado) en vez de a tres, más una banda
//     especular fina sobre el techo. Eso es lo que la hace verse mojada, y no
//     cuesta nada de render.
//   · COMPORTAMIENTO, con filtro — el goo (`feGaussianBlur` + `feColorMatrix`
//     sobre el alfa) hace que los goterones se unan a la banda con un menisco en
//     vez de un empalme en ángulo, y que las gotas que se desprenden adelgacen el
//     cuello al separarse. Es EL truco que hace que un SVG se lea como líquido.
//
// ⚠ Las secciones que lo usan no pueden llevar `overflow-hidden`: el goteo
// desborda por abajo a propósito, y más aún cuando se estira o suelta una gota.

/** Ancho del sistema de coordenadas. El alto depende del arco (ver `viewBox`). */
const W = 1200;
/** Alto del goteo por debajo del canto de la hoja, en unidades de viewBox. */
const DEPTH = 96;
/** Profundidad de arco con la que se pinta en servidor: 3,6vw sobre 1200, que es
    el valor bueno entre 555 px y 1778 px de ancho. Al montar se mide de verdad. */
const CURVE_SSR = 43.2;
/** Caída por defecto de una gota desprendida, en unidades de viewBox. */
const BEAD_FALL = 90;

/** Los goterones. `mouth` es la `y` del canto de la banda donde nacen —tiene que
    coincidir con el tramo recto que `bandPath` deja ahí— y `tip` hasta dónde
    llega la punta. Las duraciones son distintas y no múltiplos entre sí para que
    ni los tres respiren a la vez ni las tres gotas caigan a la vez; las de la
    gota van largas a propósito, para que sea un hallazgo y no una fuente. */
const DROPS = [
  { x: 1032, half: 16, mouth: 36, tip: 74, dur: "7.4s", bead: "11s" },
  { x: 666, half: 17, mouth: 44, tip: 92, dur: "6.5s", bead: "14s" },
  { x: 320, half: 16, mouth: 46, tip: 82, dur: "8.2s", bead: "17s" },
] as const;

/** La `y` de la elipse de la hoja en esa `x`: 0 en los cantos, `curve` en el
    centro. Es exactamente `border-radius: 50% / curve` resuelto a mano. */
function arcAt(x: number, curve: number) {
  const u = (x - W / 2) / (W / 2);
  return curve * Math.sqrt(Math.max(0, 1 - u * u));
}

/** La banda: arco de la hoja por arriba, onda por abajo, con tramos rectos donde
    se enganchan los goterones. Se recorre de izquierda a derecha por el techo y
    de derecha a izquierda por el canto, y `Z` cierra por el lateral izquierdo. */
function bandPath(curve: number) {
  const p = (x: number, y: number) => `${x} ${(y + arcAt(x, curve)).toFixed(2)}`;
  const [right, mid, left] = DROPS;

  return [
    "M 0 0",
    // `sweep-flag = 0` con el eje Y hacia abajo es la panza hacia abajo.
    `A ${W / 2} ${curve.toFixed(2)} 0 0 0 ${W} 0`,
    `L ${p(W, 22)}`,
    `C ${p(1120, 22)} ${p(1096, 36)} ${p(right.x + right.half, right.mouth)}`,
    `L ${p(right.x - right.half, right.mouth)}`,
    `C ${p(968, 36)} ${p(900, 20)} ${p(840, 20)}`,
    `C ${p(790, 20)} ${p(748, 44)} ${p(mid.x + mid.half, mid.mouth)}`,
    `L ${p(mid.x - mid.half, mid.mouth)}`,
    `C ${p(584, 44)} ${p(548, 22)} ${p(486, 22)}`,
    `C ${p(430, 22)} ${p(396, 46)} ${p(left.x + left.half, left.mouth)}`,
    `L ${p(left.x - left.half, left.mouth)}`,
    `C ${p(244, 46)} ${p(188, 26)} ${p(128, 26)}`,
    `C ${p(82, 26)} ${p(40, 32)} ${p(0, 32)}`,
    "Z",
  ].join(" ");
}

/** El reflejo: una banda fina pegada al techo. Como es el arco de la banda
    desplazado una constante hacia abajo, sigue siendo LA MISMA elipse trasladada
    y se puede dibujar con dos arcos exactos. El de vuelta lleva `sweep-flag = 1`
    porque se recorre en sentido contrario. */
function specularPath(curve: number, from: number, to: number) {
  const r = `${W / 2} ${curve.toFixed(2)}`;
  return `M 0 ${from} A ${r} 0 0 0 ${W} ${from} L ${W} ${to} A ${r} 0 0 1 0 ${to} Z`;
}

/** El reflejo va en DOS bandas planas y no en una con degradado, y no es pereza:
    un `linearGradient` tiene el eje fijo, así que su rampa se mediría desde el
    techo del viewBox mientras que el canto de la miel BAJA hasta `curve` en el
    centro. En el centro la banda caería entera fuera de la rampa y el reflejo
    desaparecería justo donde más se ve. Dos opacidades planas siguen el arco
    exacto y dan la caída suficiente. */
const SHEEN = [
  { from: 1.5, to: 5, opacity: 0.42 },
  { from: 5, to: 10.5, opacity: 0.15 },
];

/** Un goterón. Nace 4 unidades DENTRO de la banda: al estirarse desde su techo
    nunca se despega, por mucho que crezca. El desplazamiento del arco es el de
    su `x` y se aplica constante a toda la figura — sobre 32 unidades de ancho la
    elipse no varía ni media unidad, y así la gota no sale deformada. */
function dropPath({ x, half, mouth, tip }: (typeof DROPS)[number], curve: number) {
  const dy = arcAt(x, curve);
  const top = mouth - 4 + dy;
  const end = tip + dy;
  const belly = top + (end - top) * 0.45;

  return [
    `M ${x - half} ${top.toFixed(2)}`,
    `C ${x - half} ${belly.toFixed(2)} ${x - half * 0.72} ${(end - 10).toFixed(2)} ${x} ${end.toFixed(2)}`,
    `C ${x + half * 0.72} ${(end - 10).toFixed(2)} ${x + half} ${belly.toFixed(2)} ${x + half} ${top.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/** `useLayoutEffect` avisa por consola si corre en servidor, y aquí no puede
    correr porque mide el DOM. En servidor no hay nada que medir: manda
    `CURVE_SSR`. Se elige a nivel de módulo, no dentro del componente, para que el
    número de hooks no dependa de una condición. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Las dos paletas, a cinco paradas.
 *
 * El orden no es un degradado que oscurece sin más: sube, baja y vuelve a subir.
 * Esa tercera parada oscura es el NÚCLEO —la sombra propia de una masa gruesa— y
 * la última es el canto RETROILUMINADO: donde la miel es fina la luz la atraviesa
 * y tira a naranja, más claro que el núcleo. Un degradado monótono da plástico;
 * este da miel.
 *
 * La primera parada de `sheet` es casi blanca para fundirse con el pie de
 * `.sky-sheet` (#faf5e9); la de `hero`, con el crema del velo de descenso. */
const TONES = {
  sheet: ["#FFF8E3", "#F7CE45", "#C98A0C", "#E5A614", "#F7B21E"],
  hero: ["#F3E9D4", "#F4C430", "#C1830B", "#DE9F12", "#F0A81A"],
  /** El fleco del portal. Aquí el goteo no cuelga de nada claro: es el CANTO DE
      ATAQUE de una masa que baja, así que arranca en el mismo tono con el que
      muere el bloque de arriba (ver `HoneyGate`) en vez de en crema. */
  gate: ["#E9A319", "#F2BE36", "#B9760A", "#DE9F12", "#F7C64A"],
} as const;

/** El color con el que tiene que morir cualquier masa que use `tone="gate"`, o
    se ve la juntura entre el bloque y su fleco. Es la parada 0 de esa paleta. */
export const GATE_TOP = TONES.gate[0];

const STOPS = ["0%", "22%", "52%", "78%", "100%"];

export default function HoneyDrip({
  className,
  curve = "sheet",
  tone = "sheet",
  gooey = true,
  beadFall = BEAD_FALL,
  stretchMax = 1.2,
}: {
  className?: string;
  /** `"sheet"` mide `--sheet-curve` y dibuja el arco de la hoja. Un número es
      una profundidad fija en unidades de viewBox: `0` deja el techo recto, que
      es lo que quieren el hero y el portal. */
  curve?: "sheet" | number;
  tone?: keyof typeof TONES;
  /** El filtro de fusión. Apagarlo deja sólo la sombra proyectada: es la salida
      de emergencia si el coste de re-rasterizar no sale a cuenta en algún sitio. */
  gooey?: boolean;
  /** Cuánto cae una gota desprendida, en unidades de viewBox. El hero lo baja
      porque lleva `overflow-hidden` y una gota larga se cortaría en el aire. */
  beadFall?: number;
  /** Estiramiento máximo que va a sufrir un goterón. Sólo dimensiona la región
      del filtro, pero eso es coste de render puro: en las hojas nadie escribe
      `--honey-stretch` y el techo real es el 1,14 del bucle, mientras que el
      hero llega a ~2,1 entre scroll y puntero. Pedir el techo del hero en todas
      partes son ~70 unidades de alto filtrado de más por cada goteo. */
  stretchMax?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const fillId = `honey-fill-${uid}`;
  const gooId = `honey-goo-${uid}`;
  const measured = curve === "sheet";
  const [cu, setCu] = useState(measured ? CURVE_SSR : curve);

  // Se mide en layout y no en efecto normal: el valor tiene que estar antes de
  // que se pinte el primer frame, o se ve el arco por defecto y luego el bueno.
  useIsomorphicLayoutEffect(() => {
    if (!measured) {
      setCu(curve);
      return;
    }
    const root = rootRef.current;
    const probe = probeRef.current;
    if (!root || !probe) return;

    const read = () => {
      const width = root.clientWidth;
      const curvePx = probe.getBoundingClientRect().height;
      if (width <= 0) return;
      // De píxeles a unidades de viewBox: el SVG mide 1200 de ancho pase lo que
      // pase, así que una unidad son `width / 1200` píxeles.
      setCu((prev) => {
        const next = (curvePx * W) / width;
        return Math.abs(next - prev) < 0.01 ? prev : next;
      });
    };

    read();
    const observer = new ResizeObserver(read);
    observer.observe(root);
    observer.observe(probe);
    return () => observer.disconnect();
  }, [measured, curve]);

  const height = DEPTH + cu;

  // La región del filtro RECORTA, y lo hace aunque el SVG lleve
  // `overflow-visible`: son dos recortes distintos. Así que tiene que contener el
  // peor caso —el goterón más largo estirado al tope MÁS la caída entera de su
  // gota— y algo de aire lateral para el desenfoque.
  //
  // Arranca en 8 y no por encima del techo A PROPÓSITO: cada unidad de alto es
  // superficie que el navegador re-rasteriza en cada frame del bucle, y ahí
  // arriba no hay nada que fundir. Que la copia filtrada se quede sin techo da
  // igual: el techo lo pone la banda exacta que se pinta encima (ver abajo).
  const FILTER_TOP = 8;
  const reach = 32 + (92 - 32) * stretchMax + beadFall + cu + 16 - FILTER_TOP;

  const band = bandPath(cu);

  // La masa: banda + goterones + gotas. Va DOS veces a propósito, ver abajo.
  const mass = (
    <>
      <path fill={`url(#${fillId})`} d={band} />
      {DROPS.map((drop) => (
        <g
          key={drop.x}
          data-honey-drop=""
          data-x={(drop.x / W).toFixed(4)}
          className="honey-drop-stretch"
          style={{ transform: "scaleY(calc(var(--honey-stretch, 1) * var(--drop-stretch, 1)))" }}
        >
          <path
            className="honey-drop"
            style={{ "--drop-dur": drop.dur } as CSSProperties}
            fill={`url(#${fillId})`}
            d={dropPath(drop, cu)}
          />
          {/* La gota va DENTRO del grupo filtrado, y ahí está la gracia: al
              separarse del goterón el goo le adelgaza el cuello, que es
              exactamente lo que hace una gota de verdad. Fuera del filtro sería
              una pelota que aparece de la nada. */}
          <ellipse
            className="honey-bead"
            style={
              {
                "--bead-dur": drop.bead,
                "--bead-fall": `${beadFall}px`,
              } as CSSProperties
            }
            fill={`url(#${fillId})`}
            cx={drop.x}
            cy={drop.tip + arcAt(drop.x, cu) - 6}
            rx={drop.half * 0.62}
            ry={drop.half * 0.72}
          />
        </g>
      ))}
    </>
  );

  return (
    <div
      ref={rootRef}
      aria-hidden
      // Con `curve="sheet"` el componente se coloca solo, porque la posición es
      // parte de la geometría: el techo del SVG cae exactamente en el canto de
      // la hoja, o sea el pie de la sección menos la curva. El píxel de más es
      // solape, para que el antialiasing no deje una costura clara entre la
      // hoja y la miel. Con una curva fija (el hero, el portal) no hay canto al
      // que engancharse y coloca quien lo usa.
      className={`pointer-events-none ${measured ? "absolute inset-x-0" : ""} ${className ?? ""}`}
      style={measured ? { top: "calc(100% - var(--sheet-curve, 3rem) - 1px)" } : undefined}
    >
      {/* La sonda. Ancho cero y sin pintar: sólo existe para que el navegador
          resuelva el `clamp()` de la curva a píxeles y podamos leerlo. */}
      {measured && (
        <div
          ref={probeRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 w-0"
          style={{ height: "var(--sheet-curve, 3rem)" }}
        />
      )}

      <svg
        viewBox={`0 0 ${W} ${height.toFixed(2)}`}
        // `overflow-visible` es obligatorio: los goterones se estiran y las gotas
        // caen por debajo de la caja. (No basta con esto: ver `reach`.)
        className="block w-full overflow-visible"
        style={{ aspectRatio: `${W} / ${height.toFixed(2)}` }}
        focusable="false"
        // Con una caja que ya tiene la proporción del viewBox esto no deforma
        // nada; está para que si alguien fija el alto desde fuera, la figura
        // llene la caja en vez de dejar bandas a los lados.
        preserveAspectRatio="none"
      >
        <defs>
          {/* `userSpaceOnUse` y no la caja de cada figura: la banda, los tres
              goterones y las tres gotas son elementos distintos, y con el
              degradado relativo a cada uno cada figura tendría su propia rampa y
              se vería el corte. Así todas comparten una sola. */}
          <linearGradient
            id={fillId}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="0"
            y2={height.toFixed(2)}
          >
            {TONES[tone].map((color, i) => (
              <stop key={STOPS[i]} offset={STOPS[i]} stopColor={color} />
            ))}
          </linearGradient>

          {/* El goo, y la sombra en la MISMA cadena: dos filtros separados serían
              dos rasterizados por frame.
              La matriz clásica es `18 -7`, que cruza el 0,5 del alfa en 0,389 y
              por tanto DILATA el canto ~0,28σ hacia fuera. Aquí el techo es la
              elipse exacta de la hoja y no se puede mover, así que va centrada:
              `18 -9` cruza justo en 0,5 y el canto se queda donde está. */}
          <filter
            id={gooId}
            filterUnits="userSpaceOnUse"
            x={-40}
            y={FILTER_TOP}
            width={W + 80}
            height={reach}
          >
            {gooey && (
              <>
                <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="soft" />
                <feColorMatrix
                  in="soft"
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -9"
                  result="goo"
                />
              </>
            )}
            <feDropShadow
              in={gooey ? "goo" : "SourceGraphic"}
              dx="0"
              dy="6"
              stdDeviation="7"
              floodColor="#6B4708"
              floodOpacity="0.36"
            />
          </filter>
        </defs>

        {/* ── 1. La masa, fundida ── */}
        <g filter={`url(#${gooId})`}>{mass}</g>

        {/* ── 2. La banda otra vez, EXACTA y sin filtro ──
            El goo trabaja sobre el alfa y, por muy centrada que vaya la matriz,
            el canto queda a merced de un redondeo. Y el techo de esta figura es
            justo lo que no puede moverse: es la elipse de `.sky-sheet`, y medio
            píxel ahí es la raya que todo este componente existe para evitar.
            Así que la banda se pinta encima tal cual. Mismo relleno, así que no
            se ve que son dos; lo único que aporta es un canto superior exacto. */}
        <path fill={`url(#${fillId})`} d={band} />

        {/* ── 3. Las luces, fuera del filtro ──
            Si entraran en el grupo de arriba, el goo se las comería: el umbral
            del alfa no distingue un reflejo translúcido de un borde. */}
        {SHEEN.map((s) => (
          <path
            key={s.from}
            fill="#FFFFFF"
            fillOpacity={s.opacity}
            d={specularPath(cu, s.from, s.to)}
          />
        ))}
      </svg>
    </div>
  );
}
