"use client";

import { useCallback, type PointerEvent } from "react";

/**
 * Versión ligera de `usePointerGlow` para elementos que se repiten muchas veces.
 *
 * El hook del hero mantiene un bucle de rAF con lerp por elemento, que es lo
 * correcto para las dos superficies de vidrio del hero (el reflejo tiene que
 * seguir moviéndose después de parar el cursor). Aquí hay siete filas, tres
 * paneles y seis tarjetas de testimonio: siete bucles de rAF permanentes para un
 * degradado de hover no se paga. Esto escribe --px/--py en el propio evento, sin
 * bucle: el suavizado lo hace la `transition` del CSS.
 *
 * Devuelve el handler directamente; el elemento sólo necesita `.tech-spot`.
 */
export function usePointerVars() {
  return useCallback((e: PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    el.style.setProperty("--px", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--py", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }, []);
}
