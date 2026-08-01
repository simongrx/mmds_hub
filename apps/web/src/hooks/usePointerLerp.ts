"use client";

import { useEffect, useRef } from "react";

/**
 * Puntero suavizado a nivel de ventana, en un único bucle de rAF.
 *
 * Estaba escrito dentro de `HeroBee`; ahora lo consumen también las capas del
 * fondo del hero y el goteo de miel de su canto, así que vive aquí en vez de
 * copiado tres veces.
 *
 * Es el hermano pesado de `usePointerVars`: aquí SÍ hace falta el bucle, porque
 * el movimiento tiene que seguir corriendo después de que el cursor se pare —
 * una `transition` de CSS llegaría tarde y se leería como un tirón. La otra
 * versión, sin bucle, es la que se usa cuando hay muchos elementos repetidos.
 *
 * `apply` recibe la posición ya suavizada y NORMALIZADA a -1..1 (centro = 0);
 * escalarla a píxeles, grados o lo que sea es cosa de quien lo use. Y tiene que
 * escribir en el DOM directamente: pasar esto por estado de React sería un
 * render por frame.
 */
export function usePointerLerp(
  apply: (x: number, y: number) => void,
  /** Interpolación por frame. Cuanto más bajo, más "pesado" el seguimiento. */
  { lerp = 0.06 }: { lerp?: number } = {}
) {
  // Por ref para que cambiar el callback no reinicie el bucle en cada render.
  const applyRef = useRef(apply);
  applyRef.current = apply;

  useEffect(() => {
    // Sin bucle si el usuario pidió menos movimiento o si el puntero es táctil
    // (ahí apenas se dispararía el listener y sólo gastaría batería).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      current.x += (target.x - current.x) * lerp;
      current.y += (target.y - current.y) * lerp;
      applyRef.current(current.x, current.y);
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [lerp]);
}
