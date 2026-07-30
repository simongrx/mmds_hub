// Elementos decorativos del hero: trazos de circuito en los bordes y los dos
// paneles "holográficos" que flotan a los lados de la abeja. Todo es puramente
// ornamental → `aria-hidden` y sin contenido semántico.

import { HexOutline } from "@/components/icons";

const TRACE = "stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]";

/** Trazos de circuito del borde izquierdo. */
export function CircuitsLeft({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 230 200"
      className={className}
      fill="none"
      stroke="#D99B11"
      aria-hidden
      focusable="false"
    >
      <g className={TRACE} opacity="0.55">
        <path d="M0 42h84l18-18h46" />
        <path d="M0 98h56l20 22h62" />
        <path d="M0 156h104l16-16h30" />
        <rect x="160" y="86" width="18" height="18" rx="3" />
      </g>
      <g fill="#F4C430" opacity="0.85">
        <circle cx="152" cy="24" r="4" />
        <circle cx="142" cy="120" r="4" />
        <circle cx="154" cy="140" r="4" />
      </g>
    </svg>
  );
}

/** Trazos de circuito del borde derecho. */
export function CircuitsRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 260 320"
      className={className}
      fill="none"
      stroke="#D99B11"
      aria-hidden
      focusable="false"
    >
      <g className={TRACE} opacity="0.55">
        <path d="M260 48h-78l-22 24H88" />
        <path d="M260 126h-72l-20-22h-44" />
        <path d="M260 214H96" />
        <path d="M260 268h-126l-18 18H74" />
        <rect x="42" y="196" width="22" height="22" rx="3" />
      </g>
      <g fill="#F4C430" opacity="0.85">
        <circle cx="84" cy="72" r="4" />
        <circle cx="120" cy="104" r="4" />
        <circle cx="92" cy="214" r="4" />
        <circle cx="70" cy="286" r="4" />
      </g>
    </svg>
  );
}

// Anchos de las "líneas de texto" del panel, para que no queden todas iguales.
const PANEL_ROWS = ["100%", "72%", "88%", "56%", "80%"];

/** Panel holográfico grande (derecha de la abeja). */
export function HoloPanel({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`rounded-2xl border border-honey/70 bg-[rgba(255,246,214,0.42)] p-5 shadow-[0_0_46px_rgba(244,196,48,0.5)] backdrop-blur-[3px] ${className ?? ""}`}
    >
      <div className="flex gap-4">
        <div className="flex flex-col items-center gap-3">
          <HexOutline className="h-6 w-6 text-mustard-dark/80" />
          <HexOutline className="h-11 w-11 text-mustard-dark" />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-3 pt-1">
          {PANEL_ROWS.map((w, i) => (
            <span
              key={i}
              className="block border-t border-dashed border-mustard-dark/70"
              style={{ width: w }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Tarjeta pequeña con un gráfico de barras (izquierda de la abeja). */
export function HoloChartCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`rounded-xl border border-honey/70 bg-[rgba(255,246,214,0.42)] p-3 shadow-[0_0_34px_rgba(244,196,48,0.45)] backdrop-blur-[3px] ${className ?? ""}`}
    >
      <svg viewBox="0 0 48 40" className="h-full w-full text-mustard-dark" fill="none" focusable="false">
        <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <rect x="4" y="22" width="8" height="14" rx="1.5" />
          <rect x="17" y="14" width="8" height="22" rx="1.5" />
          <rect x="30" y="6" width="8" height="30" rx="1.5" />
        </g>
        <path
          d="M4 18 17 10l13 6 12-8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
