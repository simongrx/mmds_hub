"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { ArrowUpRight, FEATURE_ICONS } from "@/components/icons";
import {
  CTA_SECONDARY_LABEL,
  HERO_FEATURES,
  HERO_HEADLINE,
  HERO_LEAD,
  HERO_TITLE,
} from "@/content/hero";
import HeroBackdrop from "./HeroBackdrop";
import HeroBee from "./HeroBee";
import { CircuitsLeft, CircuitsRight, HoloChartCard, HoloPanel } from "./HeroDecorations";
import HeroGlassCard from "./HeroGlassCard";
import HeroGlassWord from "./HeroGlassWord";
import HeroPodium from "./HeroPodium";

// Hero reconstruido a partir del mockup de referencia (1536×1024). Las posiciones
// en % salen de medir los elementos del mockup, así que la composición escala
// proporcionalmente en vez de depender de valores fijos.
//
// La abeja ya no es un modelo 3D: es un PNG recortado con alfa sobrepuesto al
// video de nubes. El podio, los circuitos y los paneles son vectoriales.
//
// ── Por qué esto es cliente ──
//
// El paso al cielo de ingredientes es una escena dirigida por el scroll, y el
// progreso tiene que salir de UN solo sitio: el de esta <section>. Lo consumen
// dos subárboles distintos —el fondo y la abeja—, así que nace aquí y baja por
// props. No lee datos de servidor (todo el copy son constantes de
// `@/content/hero`) y casi todos sus hijos ya eran cliente, así que lo único que
// cambia es que este JSX estático viaja también al bundle.

// Aun siendo condensada, Agdasima no llega al ancho de letra del mockup, así que
// la comprimimos en X. El mockup no usa el mismo ancho en las dos palabras (0.35
// vs 0.30 de ratio ancho/alto), de ahí los dos factores: con uno solo, o
// "CREATIVIDAD" se queda corta o "TECNOLOGÍA" se come a la abeja.
// Medido en pantalla. Al subir el tamaño un 30% las palabras crecen hacia dentro
// (van ancladas a los bordes), así que el hueco central se cierra solo: es el
// "más juntas" que se pedía, sin que lleguen a encadenarse detrás de la abeja.
const SQUEEZE_LEFT = "scaleX(0.58)";
const SQUEEZE_RIGHT = "scaleX(0.53)";
// En apilado las palabras van una sobre otra y no se comprimen: Agdasima ya es
// estrecha de por sí, y estirarla para llenar el ancho se notaría. El ancho se
// recupera con el tamaño (WORD_SIZE_SM), acotado para que la segunda línea siga
// cayendo detrás de la abeja en vez de taparla.
const WORD_SQUEEZE_SM = "scaleX(1)";
const WORD_SIZE = "clamp(3.9rem, 15.7vw, 16.9rem)";
// En el layout apilado el título va a dos líneas. Se dimensiona para que la
// primera quede por encima de la abeja y la segunda detrás: si crece más, la
// abeja lo tapa entero y el título se lee como ruido.
// Tope real en apilado: por encima de ~22vw "CREATIVIDAD" no cabe en 375 px y las
// letras de los extremos se cortan, así que aquí no se puede subir el 30% entero.
const WORD_SIZE_SM = "21.5vw";
// Agdasima se aplica por variable CSS en vez de por utilidad de Tailwind: el
// `fontFamily` del config no sobrevive a los rebuilds de HMR de Next.
const DISPLAY_FONT = "var(--font-agdasima), sans-serif";

// El halo claro del text-shadow sustituye al velo lateral que se retiró del
// fondo: sin él estas etiquetas se pierden en los fotogramas oscuros del video.
function SmallLabel({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={`font-heading text-[clamp(0.6rem,0.86vw,0.9rem)] font-semibold uppercase tracking-[0.34em] text-ink/70 [text-shadow:0_1px_10px_rgba(255,251,238,0.9)] ${className ?? ""}`}
    >
      {children}
    </span>
  );
}

/** Titular real de la página + lead + CTA primario. */
function CopyBlock({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* `cqw` = ancho interior de la card (ver .hero-glass-card__content). El
          suelo baja a partir de lg: en el layout apilado la card es estrecha pero
          hay alto de sobra, mientras que en portátiles cortos ese mismo ancho con
          el suelo de móvil añadía líneas que no caben. */}
      <h1 className="font-heading text-[clamp(1.9rem,10.6cqw,3rem)] font-bold leading-[1.2] text-ink lg:text-[clamp(1.6rem,10.6cqw,3rem)]">
        {HERO_HEADLINE.pre}
        <span className="text-mustard-dark">{HERO_HEADLINE.highlight}</span>
        {HERO_HEADLINE.post}
      </h1>
      {/* Un punto más opaco que antes: la superficie de vidrio es más clara que
          el velo que había detrás, y a 75% el lead se quedaba justo. */}
      <p className="mt-4 text-[clamp(1rem,4.4cqw,1.3rem)] leading-relaxed text-ink/85 lg:text-[clamp(0.9rem,4.4cqw,1.3rem)]">
        {HERO_LEAD}
      </p>
      <a
        href="#servicios"
        className="mt-7 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-honey px-7 py-3.5 font-heading text-base font-semibold text-ink shadow-[0_8px_24px_rgba(244,196,48,0.45)] transition duration-200 hover:bg-mustard-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {CTA_SECONDARY_LABEL}
        <ArrowUpRight className="h-5 w-5" />
      </a>
    </div>
  );
}

/** Barra inferior con los tres diferenciales. */
function FeaturesBar({ className }: { className?: string }) {
  return (
    <ul
      className={`grid gap-5 rounded-[28px] bg-[#FAF7F0]/85 px-8 py-7 shadow-[0_18px_50px_rgba(120,95,30,0.18)] backdrop-blur-sm sm:grid-cols-3 ${className ?? ""}`}
    >
      {HERO_FEATURES.map((f) => {
        const Icon = FEATURE_ICONS[f.icon];
        return (
          <li key={f.text[0]} className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                f.tone === "honey" ? "bg-honey text-ink" : "bg-ink text-honey"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
            </span>
            <span className="font-heading text-sm font-semibold leading-snug text-ink">
              {f.text[0]}
              <br />
              {f.text[1]}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // De 0 —el hero justo arriba del todo— a 1 —el pie del hero tocando el techo
  // de la ventana, o sea el hero ya fuera—. Es el reloj de toda la transición.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  return (
    // El mockup es 3:2. Para que la composición no se estire, el hero conserva
    // ese ratio (alto = ancho/1.5 = 66.7vw) sin bajar de pantalla completa ni
    // dispararse en monitores muy anchos.
    <section
      ref={sectionRef}
      id="inicio"
      className="relative isolate min-h-[100svh] overflow-hidden lg:min-h-[max(100svh,min(66.7vw,125vh))]"
    >
      {/* ── Fondo, descenso al cielo de ingredientes y goteo de miel ── */}
      <HeroBackdrop progress={scrollYProgress} />

      {/* ══ Composición fiel al mockup (lg y superiores) ══ */}
      <div aria-hidden className="hidden lg:block">
        <CircuitsLeft className="absolute left-0 top-[46%] z-[1] w-[15%] opacity-90" />
        <CircuitsRight className="absolute right-0 top-[44%] z-[1] w-[17%] opacity-90" />

        {/* Título gigante: detrás de la abeja y pegado a los bordes. */}
        <div style={{ fontFamily: DISPLAY_FONT }}>
          <HeroGlassWord
            className="absolute left-[8%] top-[13%] z-[2] origin-left uppercase"
            fontSize={WORD_SIZE}
            squeeze={SQUEEZE_LEFT}
          >
            {HERO_TITLE.leftBig}
          </HeroGlassWord>
          <HeroGlassWord
            className="absolute right-[5.6%] top-[13%] z-[2] origin-right uppercase"
            fontSize={WORD_SIZE}
            squeeze={SQUEEZE_RIGHT}
          >
            {HERO_TITLE.rightBig}
          </HeroGlassWord>
        </div>
        {/* Pasan a ir encima de cada palabra (como en el spec original) en vez de
            debajo: al crecer el lettering y la card, el hueco de abajo se lo come
            la card y las etiquetas quedaban tapadas. */}
        <SmallLabel className="absolute left-[8.4%] top-[9.3%] z-[2]">
          {HERO_TITLE.leftSmall}
        </SmallLabel>
        <SmallLabel className="absolute right-[6.1%] top-[9.3%] z-[2]">
          {HERO_TITLE.rightSmall}
        </SmallLabel>

        <HeroPodium className="absolute left-1/2 top-[61%] z-[3] w-[54%] -translate-x-1/2" />

        {/* Estaba en left-[31%] top-[52%], que ahora es el interior de la card de
            vidrio: quedaba escondida detrás y sólo asomaba un canto. Se mueve al
            hueco de la derecha, sobre los circuitos y bajo el panel holográfico. */}
        <HoloChartCard className="absolute left-[84.5%] top-[57%] z-[4] h-[8.5%] w-[6.6%]" />
        <HoloPanel className="absolute left-[64%] top-[46.5%] z-[4] w-[17%]" />
      </div>

      {/* Título gigante en móvil: dos líneas centradas y más tenues, para que no
          compitan con el texto apilado encima. Es decorativo, igual que arriba. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[5%] flex flex-col items-center uppercase leading-[0.95] lg:hidden"
        style={{ fontFamily: DISPLAY_FONT }}
      >
        {/* Mismo acabado de vidrio, atenuado: en móvil el copy va justo encima. */}
        <HeroGlassWord className="opacity-75" fontSize={WORD_SIZE_SM} squeeze={WORD_SQUEEZE_SM}>
          {HERO_TITLE.leftBig}
        </HeroGlassWord>
        <HeroGlassWord className="opacity-75" fontSize={WORD_SIZE_SM} squeeze={WORD_SQUEEZE_SM}>
          {HERO_TITLE.rightBig}
        </HeroGlassWord>
      </div>

      {/* ══ Contenido real ══
          Un único árbol para los dos layouts: apilado en flujo por debajo de lg
          y posicionado en absoluto a partir de lg. Así no se duplica el <h1>. */}
      <div className="relative flex min-h-[100svh] flex-col items-center justify-center gap-8 px-6 pb-12 pt-28 lg:absolute lg:inset-0 lg:block lg:min-h-0 lg:p-0">
        <HeroBee
          progress={scrollYProgress}
          className="w-[62%] max-w-[280px] lg:absolute lg:left-[51.4%] lg:top-[41%] lg:z-[5] lg:w-[29%] lg:max-w-[500px] lg:-translate-x-1/2 lg:-translate-y-1/2"
        />
        {/* min-w evita que a 1024px la columna se quede tan estrecha que el
            titular se parta en tres líneas y el CTA acabe bajo la barra. El
            ancho sube un 30% junto con la tipografía, así que se recoloca más a
            la izquierda para no pisar la abeja.
            Va anclada por abajo y no por arriba: en pantallas bajas la card
            crece, y creciendo hacia arriba se solapa con el lettering (que es
            decorativo y se ve a través del vidrio), mientras que hacia abajo se
            metería debajo de la barra de features, que sí es opaca. */}
        <HeroGlassCard className="w-full max-w-md lg:absolute lg:bottom-[31%] lg:left-[9.5%] lg:z-[6] lg:w-[32%] lg:min-w-[19rem] lg:max-w-[30rem]">
          <CopyBlock className="text-center lg:text-left" />
        </HeroGlassCard>
        <FeaturesBar className="w-full max-w-md lg:absolute lg:bottom-[6.5%] lg:left-1/2 lg:z-[6] lg:w-[65.6%] lg:max-w-5xl lg:-translate-x-1/2" />
      </div>
    </section>
  );
}
