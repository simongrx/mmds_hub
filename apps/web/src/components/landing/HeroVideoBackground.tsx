"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { HERO_ASSETS } from "@/content/hero";

// Slice 3 — capa de video de fondo (nubes). Va detrás del texto (z bajo) y no
// bloquea el LCP: el título se pinta antes; el poster cubre hasta que el video
// esté listo. Con prefers-reduced-motion se pausa y queda el poster estático.
export default function HeroVideoBackground() {
  const reduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduceMotion) {
      video.pause();
    } else {
      // play() puede rechazar en algunos navegadores; el poster sigue visible.
      void video.play().catch(() => {});
    }
  }, [reduceMotion]);

  return (
    <video
      ref={videoRef}
      className="h-full w-full object-cover"
      poster={HERO_ASSETS.poster}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
      tabIndex={-1}
    >
      {/* webm primero, mp4 como fallback. */}
      <source src={HERO_ASSETS.videoWebm} type="video/webm" />
      <source src={HERO_ASSETS.videoMp4} type="video/mp4" />
    </video>
  );
}
