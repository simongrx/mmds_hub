"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Scroll con inercia para la home. Es lo que hace que el track horizontal de
// proyectos se sienta como un recorrido y no como una serie de saltos.
//
// No vive en layout.tsx a propósito: el panel y el portal son herramientas de
// trabajo y ahí el scroll inercial estorba (listas largas, tablas). Se monta
// sólo en la landing.
//
// Lenis mueve el scroll REAL del window, así que `useScroll` de framer-motion
// sigue funcionando sin puente ni ScrollTrigger.

export default function SmoothScroll() {
  useEffect(() => {
    // En puntero grueso el scroll nativo del sistema ya es bueno y la inercia
    // añadida pelea con los gestos (overscroll, pull-to-refresh, swipe-back).
    // Y si el usuario pidió menos movimiento, esto es exactamente lo primero
    // que hay que no hacer.
    const noGo = window.matchMedia(
      "(prefers-reduced-motion: reduce), (pointer: coarse)"
    );
    if (noGo.matches) return;

    const lenis = new Lenis({
      // Un pelo por encima del defecto: con `duration` más alta la página se
      // siente pesada al buscar una sección concreta desde el navbar.
      duration: 1.05,
      // Curva de salida: entra rápido y frena, que es como se lee "inercia".
      easing: (t) => 1 - Math.pow(1 - t, 3),
      // El track de proyectos ya consume el gesto horizontal dentro de su
      // contenedor; Lenis se queda solo con el vertical.
      gestureOrientation: "vertical",
      // Los saltos a #ancla los interpola Lenis (ver html.lenis en globals.css,
      // que apaga el scroll-behavior nativo para que no se interpole dos veces).
      anchors: { offset: -80 },
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
