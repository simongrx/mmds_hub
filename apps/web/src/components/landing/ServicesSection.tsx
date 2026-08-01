import SectionHeading from "./SectionHeading";
import ServiceArc from "./ServiceArc";
import SkyBackdrop from "./SkyBackdrop";
import { SKY } from "./skyBackdrops";
import type { Service } from "@/lib/types";

// 01 — Nuestros ingredientes.
//
// Historia de la sección, por si vuelve la tentación:
//
//   · reja de tres columnas con tarjetas cuadradas → con siete servicios dejaba
//     una fila coja y los siete pesaban igual.
//   · catálogo vertical con columna de índice fija → resolvía la jerarquía pero
//     no enseñaba el ingrediente.
//   · bento de celdas desiguales → se leía muy bien sobre negro, pero al pasar
//     la página a claro ocupaba todo el ancho útil y tapaba entera la abeja con
//     el tarro, que es el motivo de la foto.
//   · panel vertical estrecho a la derecha → dejaba ver la abeja, pero metía los
//     siete servicios en una lista apretada donde ninguno respiraba.
//   · ahora: carrusel a sangre debajo, con la cabecera y sus controles arriba a
//     la izquierda y el centro libre. La foto manda y los servicios tienen sitio.
//
// El hueco central de la fila de cabecera no es aire de sobra: es lo único que
// mantiene visible la abeja. Si se rellena, la composición se pierde.

export default function ServicesSection({ services }: { services: Service[] }) {
  // `trail`: la foto muere en marrón (#846847) y el relleno de debajo de la banda
  // lo lleva hasta #F0EADC, que es el TECHO DE LA FOTO DE CASOS. Ojo con esto,
  // que es lo que sostiene la página: "Proceso" ya no empalma estas dos fotos
  // —ahora flota por encima de la unión—, así que Ingredientes y Casos tienen que
  // tocarse solas y en el mismo color. Donde el borde curvado de la hoja sube, la
  // unión SE VE. Por arriba no hace falta `lead`: el hero ya desciende hasta el
  // azul con el que esta foto empieza (ver Hero.tsx).
  //
  // Va como variable y se pasa como prop porque el arco es cliente (lee el
  // scroll) y esto tiene que seguir siendo servidor.
  const backdrop = <SkyBackdrop sky={SKY.ingredientes} trail="#F0EADC" eager />;

  // `sky-ink-halo` sustituye al velo claro que había sobre esta columna. El velo
  // apagaba el cielo justo donde está el motivo de la foto; el halo va pegado a
  // las letras y aguanta tanto sobre el sol como sobre las torres oscuras.
  // `text-shadow` se hereda, así que puesto en el envoltorio cubre eyebrow,
  // titular y lead. La línea dorada trae el suyo propio y lo anula.
  const heading = (
    <SectionHeading
      tone="light"
      index="01"
      eyebrow="Ingredientes"
      title="Nuestros"
      titleAccent="Ingredientes"
      display
      lead="Cada servicio es un ingrediente. Los combinamos para cocinar la solución perfecta para ti."
      className="sky-ink-halo"
    />
  );

  return (
    <section id="servicios" className="relative isolate">
      {services.length === 0 ? (
        /* La API se traga sus errores y devuelve [] (lib/serverApi.ts). Con el
           contenido de reserva esto ya casi no pasa, pero si también fallara,
           mejor un mensaje honesto que un carrusel vacío. Sin tarjetas no hay
           arco, así que tampoco hay carril: la sección vuelve a medir lo que
           mida su contenido. */
        <div className="relative py-24 sm:py-32 lg:min-h-[56.2vw]">
          {backdrop}
          <div className="mx-auto max-w-[88rem] px-6">
            {heading}
            <div className="sky-glass mt-12 grid place-items-center rounded-3xl px-6 py-14 text-center">
              <p className="text-ink/70">
                Estamos afinando la carta de servicios. Escríbenos y te contamos qué podemos
                cocinar.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ServiceArc services={services} heading={heading} backdrop={backdrop} />
      )}
    </section>
  );
}
