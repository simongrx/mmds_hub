# SPEC — Hero rediseñado, Miel Mostaza

## 1. Objetivo

Rediseñar el hero de la landing de Miel Mostaza replicando la imagen de referencia
(fondo de nubes doradas, abeja robot 3D flotando, título grande, tarjeta de features
inferior), con cuatro capas de interactividad añadidas:

1. Fondo en video loop (nubes/naves con movimiento sutil).
2. Título dinámico que rota frases cada 5s.
3. Abeja 3D interactiva que sigue el cursor con la mirada.
4. Transición de scroll: las nubes cubren la pantalla y la abeja "vuela" hasta
   aterrizar en un punto fijo de la sección 2.

El objetivo de conversión de toda la página es dirigir a WhatsApp — el hero debe
mantener ese CTA visible y no debe sacrificar el LCP por las capas 3D/video.

## 2. Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Framer Motion (título dinámico, transiciones de UI)
- three.js + @react-three/fiber + @react-three/drei (escena 3D de la abeja)
- @react-three/postprocessing (bloom sutil, opcional)
- gsap + ScrollTrigger (pin de sección + scrub de la transición)

## 3. Assets ya generados (input, no crear desde cero)

| Asset | Estado | Ruta esperada en el proyecto |
|---|---|---|
| Modelo 3D de la abeja | `.glb`, mesh sólido único (sin jerarquía de huesos/cabeza separada) | `/public/models/bee.glb` |
| Video de fondo (nubes) | `.mp4` (H.264), loop ya cerrado con crossfade | `/public/video/hero-bg.mp4` |
| Video de fondo (webm) | Pendiente de generar con ffmpeg antes o durante la sesión: `ffmpeg -i hero-bg.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -an hero-bg.webm` | `/public/video/hero-bg.webm` |
| Poster / fallback estático | Frame estático del video o el render original de referencia | `/public/video/hero-bg-poster.jpg` |

Nota importante para Claude Code: el mesh de la abeja **no tiene cabeza separada**.
"Mirar al cursor" se implementa rotando y desplazando el `mesh` completo, no un
sub-nodo. Ver sección 6.3.

## 4. Contenido (completar antes de compilar / durante plan mode)

> Estos tres puntos son placeholders. Si no están resueltos al momento de correr
> Claude Code, pídele que los deje como constantes claramente marcadas
> `// TODO-CONTENIDO` en un solo archivo (`src/content/hero.ts`) para editarlos
> después sin tocar lógica.

- **Frases del título rotativo** (array de 3-5 frases, cada una visible ~5s):
  - `[PENDIENTE — ej: "Creatividad", "Tecnología", "Resultados"]`
- **WhatsApp**: número de destino + texto precargado del mensaje:
  - Número: `[PENDIENTE]`
  - Mensaje precargado: `[PENDIENTE — ej: "Hola, quiero más información sobre..."]`
- **Punto de aterrizaje en sección 2**: coordenada aproximada (o selector/anchor)
  dentro de la sección 2 donde la abeja debe quedar fija tras el scroll:
  - `[PENDIENTE — describir posición: ej. "esquina superior derecha de la tarjeta
    de servicios, junto al título 'Ver servicios'"]`

## 5. Estructura de secciones del hero

1. **Navbar** (Inicio / Servicios / Proyectos / Nosotros / Contacto + botón "Hablemos")
2. **Hero** (contenedor con el Canvas 3D + video de fondo, sticky/fijo durante el scroll de transición)
   - Título grande dos líneas ("CREATIVIDAD" / "TECNOLOGÍA" en la referencia) con
     subtítulos pequeños encima ("ESTRATEGIA" / "RESULTADOS")
   - Bloque de texto + CTA "Ver servicios"
   - Abeja 3D centrada
   - Paneles/tarjetas decorativas flotantes (opcional, estáticas o con parallax leve)
3. **Plataforma/podio** debajo de la abeja (puede ser parte del video de fondo o un
   elemento HTML/CSS superpuesto — decidir en plan mode según cómo quedó el video)
4. **Barra de features** inferior (3 íconos + texto: "Estrategias que conectan",
   "Soluciones que transforman", "Resultados que perduran")
5. **Sección 2** (destino del vuelo de la abeja tras el scroll)

## 6. Especificación funcional por capa

### 6.1 Fondo de video loop

- `<video autoplay muted loop playsinline preload="metadata" poster="...">`
- Fuentes en orden: `webm` primero, `mp4` como fallback.
- `object-fit: cover`, contenedor `position: relative` ocupando el 100% del hero.
- Si `prefers-reduced-motion: reduce` → pausar el video (`video.pause()`) y mostrar
  el poster estático.
- El video no debe bloquear el LCP: el título y el CTA deben poder pintarse antes
  de que el video cargue (el video va detrás, en capa `z-index` inferior, sin
  bloquear el render del texto).

### 6.2 Título dinámico

- Array de frases (ver sección 4) rotando cada 5000ms.
- Implementar con `useEffect` + `setInterval`, con `clearInterval` en cleanup.
- Transición de entrada/salida con Framer Motion `AnimatePresence` (fade + slight
  slide vertical, ~400-600ms).
- Si `prefers-reduced-motion: reduce` → detener la rotación automática (dejar la
  primera frase fija, o cambiar solo si el usuario interactúa — decidir el
  comportamiento más simple en plan mode).

### 6.3 Abeja 3D interactiva

- Canvas de `@react-three/fiber` cargado con `React.lazy` + `Suspense`, fallback =
  imagen estática de la abeja (evita bloquear el LCP).
- Modelo cargado con `useGLTF('/models/bee.glb')`.
- Seguimiento de cursor dentro de `useFrame`:
  - Normalizar posición del puntero a rango `-1..1` (`pointer.x`, `pointer.y` de
    R3F, o listener manual de `mousemove` normalizado por tamaño del viewport).
  - Calcular rotación objetivo acotada: `targetRotY = pointerX * maxAngleY` (ej.
    `maxAngleY ≈ 0.4-0.5 rad`, ~25-30°), `targetRotX = -pointerY * maxAngleX` (ej.
    `maxAngleX ≈ 0.25 rad`, ~15°).
  - Calcular un desplazamiento objetivo sutil: `targetPosX = pointerX * offsetRange`
    (ej. `offsetRange` pequeño, unidades de escena equivalentes a unos pocos px en
    pantalla) para reforzar la sensación de "intención" sin cabeza articulada.
  - Interpolar cada frame con `lerp` (factor ~0.05-0.08) hacia esos objetivos, tanto
    en rotación como en posición.
  - Sumar un flotar idle (`sin(clock.elapsedTime)` en Y, amplitud pequeña) o usar
    el helper `Float` de drei, combinado (no sustituido) con el seguimiento del
    cursor.
- Iluminación: al menos una luz direccional cálida + un `Environment` de drei
  (preset tipo "sunset" o similar) para los reflejos dorados de la referencia.
- `dpr` limitado a `[1, 2]`, disponer recursos (`dispose`) al desmontar, pausar el
  loop de render cuando `document.hidden`.

### 6.4 Transición de scroll (hero → sección 2)

- El `<Canvas>` de la abeja vive en un contenedor que se **pinea** (GSAP
  ScrollTrigger, `pin: true`) durante el tramo de scroll de la transición — no se
  desmonta ni se remonta entre hero y sección 2.
- Un valor de progreso `0..1` (del `ScrollTrigger`, con `scrub: true`) controla:
  - Escala/opacidad de una capa de nubes superpuesta que crece hasta cubrir toda
    la pantalla en progreso ≈ 0.5.
  - Posición objetivo del `mesh` de la abeja: interpola desde su posición flotante
    en el hero hasta el punto de aterrizaje de la sección 2 (ver sección 4).
  - Factor de mezcla entre "control por cursor" (sección 6.3) y "posición
    guionizada por scroll": en progreso 0 domina 100% el cursor; a partir de que
    empieza el scroll, ese peso decae hacia 0 y el peso del path guionizado sube
    hacia 1, de forma que al llegar a progreso 1 la abeja ignora el cursor y queda
    fija en el punto de aterrizaje.
- Tras progreso ≈ 0.5-0.6, la capa de nubes se desvanece (fade out) revelando el
  contenido de la sección 2 debajo.
- Con `prefers-reduced-motion: reduce`: omitir el scrub, hacer un fade/snap simple
  entre hero y sección 2 sin animar la posición de la abeja cuadro a cuadro.

## 7. Performance y accesibilidad (no negociable)

- LCP = título del hero. El Canvas 3D y el video no deben bloquear su pintado.
- `<Canvas>` con `import()` dinámico + `Suspense` (fallback: imagen estática de la
  abeja en la misma posición aproximada).
- Fallback simplificado en móvil: si el viewport es angosto o se detecta gama baja
  (heurística simple: `navigator.hardwareConcurrency` bajo, o directamente por
  breakpoint), renderizar imagen estática + título rotativo, sin Canvas 3D ni
  scroll-pin.
- Respetar `prefers-reduced-motion` en las tres capas animadas (video, título,
  scroll) según lo indicado arriba.

## 8. Orden de construcción (slices verticales)

1. Layout + hero estático (imagen de fondo de referencia como placeholder, título,
   CTA, barra de features). Debe verse y funcionar sin ninguna capa dinámica.
2. Título dinámico (Framer Motion). Aislado, sin dependencia de las otras capas.
3. Capa de video de fondo + poster + manejo de `prefers-reduced-motion`.
4. Canvas 3D con la abeja + seguimiento de cursor (sin scroll todavía).
5. Transición de scroll: pin, capa de nubes cubriendo pantalla, path de vuelo,
   mezcla cursor↔scroll, aterrizaje en sección 2.
6. Pulido: fallback móvil, `prefers-reduced-motion` en todas las capas, pasada de
   performance (Lighthouse: LCP, CLS, tamaño de bundle del Canvas).

Cada slice debe quedar funcional y verificable antes de pasar al siguiente. No
avanzar al slice 5 sin que 1-4 estén validados visualmente.
