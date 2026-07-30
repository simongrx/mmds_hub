"use client";

import { useEffect, useRef } from "react";

// Factor de interpolación por frame: cuanto más bajo, más "líquido" el reflejo.
const LERP = 0.12;
// El brillo puede salirse un poco del elemento antes de dejar de moverse: si se
// clampara a 0–100% la luz se quedaría clavada en el borde de forma antinatural.
const OVERSHOOT = 0.2;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * Escribe en el elemento, frame a frame, la posición del cursor como custom
 * properties para que el CSS decida qué hacer con ellas (reflejo especular,
 * inclinación 3D, spotlight sobre texto):
 *
 *   --px / --py  posición del puntero en % del rect del elemento (con overshoot);
 *   --dx / --dy  desplazamiento normalizado -1..1 respecto al centro.
 *
 * Los porcentajes son deliberados: el lettering gigante lleva `scaleX()`, y un
 * fondo posicionado en % mapea bien bajo el escalado sin dividir por el factor.
 *
 * Mismo patrón que el parallax de la abeja (ver HeroBee.tsx): un listener
 * `pointermove` pasivo + bucle de rAF con lerp, y nada de esto se engancha si el
 * usuario pidió menos movimiento o si el puntero es táctil. En ese caso las vars
 * se quedan en los valores por defecto que declara globals.css (brillo centrado
 * y card en su ángulo base), así que el estado estático también es válido.
 */
export function usePointerGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: 0.5, y: 0.5 };
    const current = { x: 0.5, y: 0.5 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      // El rect se lee en el listener y no en el tick: al mover el cursor ya
      // estamos fuera del frame crítico, y así el reflejo sigue al elemento si
      // la página se ha desplazado entre medias.
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.x = clamp((e.clientX - rect.left) / rect.width, -OVERSHOOT, 1 + OVERSHOOT);
      target.y = clamp((e.clientY - rect.top) / rect.height, -OVERSHOOT, 1 + OVERSHOOT);
    };

    const tick = () => {
      current.x += (target.x - current.x) * LERP;
      current.y += (target.y - current.y) * LERP;
      el.style.setProperty("--px", `${(current.x * 100).toFixed(2)}%`);
      el.style.setProperty("--py", `${(current.y * 100).toFixed(2)}%`);
      // El overshoot es útil para el reflejo, pero no para la inclinación: sin
      // acotar, la card se pasaría del ángulo previsto cuando el cursor va lejos.
      el.style.setProperty("--dx", clamp(current.x * 2 - 1, -1, 1).toFixed(3));
      el.style.setProperty("--dy", clamp(current.y * 2 - 1, -1, 1).toFixed(3));
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
