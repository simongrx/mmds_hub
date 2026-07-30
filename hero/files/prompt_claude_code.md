# Prompt para Claude Code — Hero interactivo Miel Mostaza

Lee primero `CLAUDE.md` y `spec.md` en la raíz del proyecto antes de escribir
código. Este prompt es el punto de entrada de la sesión.

## Contexto

Vamos a reconstruir el hero de la landing siguiendo `spec.md` al pie de la letra.
Ya existen tres assets generados fuera de este proyecto que NO debes recrear:

- `/public/models/bee.glb` — modelo 3D de la abeja, mesh sólido único (sin
  jerarquía de huesos ni cabeza separada).
- `/public/video/hero-bg.mp4` — video loop del fondo (nubes/naves).
- `/public/video/hero-bg.webm` — versión comprimida del mismo loop (si no existe
  aún, avísame antes de continuar; no la generes tú).
- `/public/video/hero-bg-poster.jpg` — frame estático de fallback (si no existe,
  avísame antes de continuar).

## Modo de trabajo

1. Entra en **plan mode** primero. No escribas código todavía.
2. Propón el plan de los 6 slices verticales descritos en la sección 8 de
   `spec.md`, confirmando conmigo el alcance de cada uno antes de implementarlo.
3. Trabaja **un slice a la vez**. Al terminar cada slice, muéstrame cómo
   verificarlo (comando para correr el dev server, qué debería ver/probar) y
   espera mi confirmación antes de seguir al siguiente.
4. Si en algún punto necesitas contenido que está marcado como
   `[PENDIENTE]` en la sección 4 de `spec.md` (frases del título, número de
   WhatsApp, punto exacto de aterrizaje en sección 2), NO inventes valores
   definitivos silenciosamente: colócalos como constantes claramente marcadas
   `// TODO-CONTENIDO` en `src/content/hero.ts` y contínua con valores de
   ejemplo razonables para poder seguir construyendo, avisándome al final de la
   sesión cuáles quedaron pendientes de mi parte.
5. Limpia el contexto entre slices grandes (como ya solemos hacer en otros
   proyectos) para no arrastrar decisiones obsoletas.

## Slice 1 — Layout + hero estático

Monta la estructura HTML/Tailwind del hero sin ninguna capa dinámica todavía:
navbar, título (estático, con la primera frase fija), bloque de texto + CTA,
espacio reservado para la abeja (puede ser un placeholder `<div>` con el tamaño
correcto), barra de features inferior. Usa la imagen de referencia que te
compartiré en el chat solo como guía visual de proporciones/spacing, no la
incluyas como asset del proyecto.

## Slice 2 — Título dinámico

Implementa la rotación de frases con Framer Motion `AnimatePresence`, siguiendo
la sección 6.2 de `spec.md`. Verifica el cleanup del interval y el respeto de
`prefers-reduced-motion`.

## Slice 3 — Video de fondo

Implementa la capa de video siguiendo la sección 6.1 de `spec.md`: fuentes
`webm` + `mp4`, poster, pausa en `prefers-reduced-motion`, sin bloquear el LCP
del título.

## Slice 4 — Abeja 3D con seguimiento de cursor

Implementa el Canvas de `@react-three/fiber` siguiendo la sección 6.3 de
`spec.md`. Recuerda: es un mesh sólido único, así que el seguimiento del cursor
rota y desplaza el mesh completo (no un sub-nodo de cabeza), con los rangos de
ángulo y el suavizado (`lerp`) descritos en el spec. Todavía sin scroll.

## Slice 5 — Transición de scroll

Implementa el pin + scrub descrito en la sección 6.4 de `spec.md`: capa de nubes
cubriendo pantalla, interpolación de posición de la abeja desde el hero hasta el
punto de aterrizaje en sección 2, y la mezcla de peso cursor↔scroll. Este es el
slice más delicado — antes de escribir código, explícame en un párrafo cómo vas
a estructurar el `ScrollTrigger` y el sistema de mezcla de pesos, para que lo
revise antes de implementarlo.

## Slice 6 — Pulido y performance

Fallback móvil, `prefers-reduced-motion` verificado en las tres capas, y una
pasada de performance (revisa tamaño del bundle del Canvas, LCP, CLS). Reporta
los números antes/después si es posible.

## Restricciones generales (aplican a todos los slices)

- No agregues dependencias fuera de las listadas en `spec.md` sin preguntarme.
- No recrees ni regeneres los assets (`.glb`, `.mp4`, `.webm`) — son inputs
  fijos.
- Todo el texto visible al usuario va en español.
- Prioriza que cada slice sea revisable de forma aislada antes de avanzar.
