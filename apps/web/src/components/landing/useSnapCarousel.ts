"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

// La maquinaria de un carrusel de scroll-snap, sin librería.
//
// No hay ninguna instalada en el repo y no hacía falta añadirla: el navegador
// ya sabe hacer scroll con snap, con inercia y con gestos táctiles. Lo único
// que falta es leer el estado (qué item está a la vista, si estamos en un
// extremo) y ofrecer botones. Eso es este hook.
//
// Vive aparte del componente para que el mosaico de casos pueda usarlo el día
// que haya más proyectos de los que caben — ver PortfolioSection.
//
// ── Dos decisiones que no son evidentes ──
//
// 1. El paso NO se adivina: se mide de los propios hijos (la distancia entre el
//    primero y el segundo). Así sigue siendo correcto en todos los breakpoints
//    sin que el hook sepa cuántos items se ven a la vez.
// 2. `prefers-reduced-motion` se resuelve en JS (`behavior: "auto"`) y NO con
//    `scroll-smooth` en CSS. Si la pista llevara `scroll-behavior: smooth`, esa
//    regla ganaría al `behavior: "auto"` del scrollBy y quien pidió menos
//    movimiento se lo comería igual.

export function useSnapCarousel(itemCount: number) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const reduced = useReducedMotion();
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

  /** Extremos. La tolerancia de 2px no es paranoia: `scrollWidth` es entero y
      `clientWidth` puede ser fraccionario con zoom del navegador, así que la
      igualdad exacta no se alcanza nunca y el botón se quedaría vivo. */
  const sync = useCallback(() => {
    const t = trackRef.current;
    if (!t) return;
    setAtStart(t.scrollLeft <= 2);
    setAtEnd(t.scrollLeft >= t.scrollWidth - t.clientWidth - 2);
  }, []);

  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };

    sync();
    t.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      t.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sync, itemCount]);

  /** Qué item está activo. Con varios a la vista el activo es el de índice más
      bajo de los visibles, que es el que el usuario lee como "dónde estoy". */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children) as HTMLElement[];
    const visible = new Set<number>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = items.indexOf(e.target as HTMLElement);
          if (i < 0) continue;
          if (e.isIntersecting) visible.add(i);
          else visible.delete(i);
        }
        if (visible.size) setActive(Math.min(...visible));
      },
      { root: track, threshold: 0.6 }
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [itemCount]);

  const step = useCallback(
    (dir: 1 | -1) => {
      const track = trackRef.current;
      if (!track) return;
      const a = track.children[0] as HTMLElement | undefined;
      const b = track.children[1] as HTMLElement | undefined;
      const delta = a && b ? b.offsetLeft - a.offsetLeft : (a?.offsetWidth ?? track.clientWidth);
      track.scrollBy({ left: dir * delta, behavior });
    },
    [behavior]
  );

  /** `scrollIntoView` y no aritmética de `offsetLeft`: respeta solo el
      `scroll-padding-left` de la pista, y `block: "nearest"` impide que arrastre
      el scroll vertical de la página al hacerlo. */
  const goTo = useCallback(
    (i: number) => {
      const el = trackRef.current?.children[i] as HTMLElement | undefined;
      el?.scrollIntoView({ behavior, block: "nearest", inline: "start" });
    },
    [behavior]
  );

  return { trackRef, active, atStart, atEnd, step, goTo };
}
