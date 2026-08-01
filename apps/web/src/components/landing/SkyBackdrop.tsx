import Image from "next/image";
import type { SkyDef } from "./skyBackdrops";

// El fondo de una sección del tramo luminoso, en panorámico.
//
// ── Por qué panorámico y no `object-cover` ──
//
// Con `object-cover` la foto se estira hasta cubrir la sección, y como el alto
// de la sección lo manda el CONTENIDO, la foto se recorta por donde toque: unas
// filas de tarjetas de más y desaparecen las torres, el podio o el goteo de
// miel. Peor aún, el recorte cambia con el viewport, así que la composición que
// se ve nunca es la que compuso quien hizo la imagen.
//
// Aquí la imagen se pinta ENTERA: a lo ancho de la sección y a su proporción
// natural. Lo que sobre de alto —arriba y abajo— lo rellena el color de su
// propia fila de borde, así que el empalme entre la foto y el relleno no se ve:
// es literalmente el mismo color.
//
// Efecto secundario que vale más que el propio encuadre: en el canto de la
// sección ya no hay foto, hay color plano. Y un color plano se puede igualar
// exactamente al de la sección vecina, que es de lo que van `lead` y `trail`.
//
// La sección tiene que reservar al menos el alto de la banda (`width / ratio`,
// o sea `100vw / ratio`) o la banda desbordará y volveremos a recortar. Cada
// sección lo hace con su propio `min-h-[..vw]`.
//
// ── Por qué el panorámico es sólo de lg en adelante ──
//
// En un móvil de 375px una foto 16:9 mide 211px de alto, y la sección mide
// 1100: quedarían 890px de color liso alrededor de una tira de foto. Medido, no
// estimado. Ahí el panorama no se lee como panorama, se lee como un fallo.
//
// Así que por debajo de lg la foto vuelve a cubrir. Y esto NO rompe las
// costuras, que es lo que hay que mirar: en un viewport estrecho la sección es
// mucho más alta que la proporción de la foto, así que `object-cover` escala
// por el ALTO y recorta de LADO — las filas primera y última de la imagen se
// siguen viendo enteras, que son justo las que dan el color de los cantos.

export default function SkyBackdrop({
  sky,
  lead,
  trail,
  align = "center",
  eager = false,
}: {
  sky: SkyDef;
  /** Dónde se ancla la banda panorámica.
   *
   * `top` existe para fondo3, que trae la ola de miel con goteo pintada en su
   * canto superior: pegando la banda al techo de la sección, ESE goteo es la
   * junta, y no hace falta superponer nada. La costura sigue siendo exacta por
   * construcción, porque la fila 0 de la foto es justo el color con el que
   * muere la sección de arriba. */
  align?: "center" | "top";
  /** Color con el que debe ARRANCAR la sección, si no es el de la foto. Sirve
      para empalmar con el pie de la sección de arriba. */
  lead?: string;
  /** Color con el que debe TERMINAR, si no es el de la foto. Empalma con el
      techo de la de abajo. */
  trail?: string;
  /** Sólo para el primer cielo bajo el pliegue: lo pide ya, sin `priority`
      (que emitiría un preload compitiendo con el vídeo del hero). */
  eager?: boolean;
}) {
  // Los rellenos son degradados y no colores planos porque `lead`/`trail`
  // pueden pedir terminar en otro color: entonces el propio relleno es la
  // transición. Si no se piden, los dos extremos coinciden y queda plano.
  const above = `linear-gradient(to bottom, ${lead ?? sky.top}, ${sky.top})`;
  const below = `linear-gradient(to bottom, ${sky.bottom}, ${trail ?? sky.bottom})`;

  // Las dos ramas comparten `src` y `sizes`, así que son una sola petición y
  // una sola decodificación aunque haya dos <Image> en el marcado.
  const img = (
    <Image
      src={sky.src}
      alt=""
      fill
      sizes="100vw"
      quality={85}
      loading={eager ? "eager" : "lazy"}
      className="object-cover"
    />
  );

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Móvil y tablet: la foto cubre. */}
      <div className="absolute inset-0 lg:hidden">{img}</div>

      {/* lg en adelante: panorámica entera, con los cantos rellenando. */}
      <div className="absolute inset-0 hidden flex-col lg:flex">
        {/* Con `align="top"` este relleno NO se pinta: la banda arranca en el
            canto de la sección y el propio borde pintado de la foto hace de
            junta. Ojo: no basta con `justify-start` en el padre, porque un
            `flex-1` crece igualmente y se repartirían el hueco a medias — hay
            que no renderizarlo. */}
        {align === "center" && (
          <div className="min-h-0 flex-1" style={{ background: above }} />
        )}

        {/* `shrink-0` es lo que impide que flexbox comprima la banda cuando el
            contenido aprieta: sin él la foto se deformaría en vez de mantener
            su proporción. */}
        <div
          className="relative w-full shrink-0"
          style={{ aspectRatio: `${sky.width} / ${sky.height}` }}
        >
          {img}
        </div>

        <div className="min-h-0 flex-1" style={{ background: below }} />
      </div>
    </div>
  );
}
