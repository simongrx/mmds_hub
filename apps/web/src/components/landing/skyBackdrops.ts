// Los tres cielos del tramo luminoso, con sus medidas y sus colores de canto.
//
// ── El cambio que ordena todo: los fondos van PANORÁMICOS ──
//
// Antes cada foto se estiraba a cubrir su sección (`object-cover`), y eso
// recortaba: dependiendo del alto del contenido se perdían las torres, el podio
// o el goteo de miel. Ahora la imagen se pinta entera, a lo ancho y a su
// proporción natural, y lo que sobra de alto por arriba y por abajo lo rellena
// el color de su propia fila de borde.
//
// Esa es también la razón de que las costuras ya no se noten: en el canto de
// cada sección no hay una foto que recortar contra otra, hay un color plano que
// yo elijo — y el de un lado se hace igual al del otro.
//
// ── De dónde salen estos números ──
// Muestreados decodificando los ficheros (media de cada fila), no a ojo. Para
// re-muestrear tras cambiar una imagen: dibujarla en un <canvas> y promediar la
// fila 0 y la última (así se sacaron estos).

export interface SkyDef {
  src: string;
  /** Medidas intrínsecas: mandan la proporción de la banda panorámica. */
  width: number;
  height: number;
  /** Color de la primera fila. Rellena lo que quede por encima de la banda. */
  top: string;
  /** Color de la última fila. Rellena lo que quede por debajo. */
  bottom: string;
}

export const SKY = {
  /** 01 Ingredientes. Torres, podio y la abeja con el tarro en el centro. */
  ingredientes: {
    src: "/images/fondos/fondo2.webp",
    width: 1672,
    height: 940,
    top: "#74858D",
    bottom: "#846847",
  },
  /** 03 Casos. Trae la ola de miel con goteo en su canto de arriba y el podio
      blanco en el de abajo: en panorámico se ven enteros, sin recortar. */
  casos: {
    src: "/images/fondos/fondo3.webp",
    width: 1566,
    height: 1004,
    top: "#F0EADC",
    bottom: "#D0C4BA",
  },
  /** 04 Cierre. La curva blanca de arriba y el tarro grande abajo. */
  cta: {
    src: "/images/fondos/fondo4.webp",
    width: 1681,
    height: 935,
    top: "#DBD3CA",
    bottom: "#8E6220",
  },
} satisfies Record<string, SkyDef>;

/** El goteo de miel que se apoya sobre la unión de dos secciones (SeamSeparator).
 *
 * Es la franja inferior del `separador.webp` original, recortada y CON CANAL
 * ALFA de verdad. El original es un panel blanco con goteo dorado sobre negro
 * OPACO, y ese negro no se puede quitar con `mix-blend-mode: screen` cuando el
 * fondo es claro: `screen(crema, dorado) ≈ crema`, o sea, el goteo desaparece.
 *
 * Así que el alfa se derivó por luminancia del propio fichero (negro → alfa 0,
 * blanco → opaco, dorado → alfa parcial conservando su color) y se guardó
 * aparte. El original se queda en la carpeta como fuente.
 *
 * Si algún día se reexporta el separador con alfa desde la herramienta de
 * diseño, basta con apuntar `src` ahí y actualizar las medidas. */
export const SEPARATOR = {
  src: "/images/fondos/separador-alpha.png",
  width: 1200,
  height: 231,
};

// ── Los colores de costura ──
//
// Van escritos a mano en cada sección y no como constante: se usan dentro de
// clases Tailwind arbitrarias, y el escáner lee los ficheros como texto — una
// constante interpolada no se generaría nunca. Esta es la tabla de referencia:
//
//   #F3E9D4 → #74858D   el hero desciende al cielo   (Hero.tsx, fundido inferior)
//   #846847  pie de fondo2  →  #F0EADC  techo de fondo3   (trail de Ingredientes)
//   #D0C4BA  pie de fondo3  →  #DBD3CA  techo de fondo4   (trail de Casos)
//   #8E6220  pie de fondo4  →  #0B0B0C  el pie            (descenso en CtaSection)
//
// Las TRES FOTOS ENCADENAN SOLAS. Proceso e Impacto ya no rellenan estas uniones:
// flotan por encima de ellas como hojas blancas superpuestas, y su borde curvado
// deja la unión a la vista en las esquinas. Si estos colores dejan de cuadrar,
// aparece una raya horizontal a los lados de cada hoja.
//
// Si se toca uno hay que tocarlo en los DOS sitios de su fila, o aparece la
// línea horizontal que todo esto existe para evitar.
