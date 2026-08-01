import { ArrowUpRight, HexOutline } from "@/components/icons";
import { BRAND, whatsappLink } from "@/lib/brand";
import SectionHeading from "./SectionHeading";
import SkyBackdrop from "./SkyBackdrop";
import { SKY } from "./skyBackdrops";

// 04 — Cierre.
//
// Antes esto era el formulario de contacto sobre `void`. Ya no: mientras no haya
// API el envío está apagado (ver ContactForm), así que un formulario aquí sería
// un botón que no hace nada en el sitio de más peso de la página. En su lugar
// van los dos canales que sí funcionan hoy. El formulario sigue vivo en
// /contacto para cuando vuelva el backend.
//
// Es también la última costura: el cielo muere en ámbar oscuro y el pie es
// negro, así que el descenso lo hace un degradado dentro de esta misma sección.
// Es lo único que queda del antiguo DarkSeam, que era el puente al revés.

export default function CtaSection() {
  return (
    // El padding superior despeja la curva blanca que la foto trae pintada en
    // su canto de arriba, que en panorámico se ve entera. `min-h-[55.6vw]` es
    // el alto de la banda (100vw ÷ 1681/935).
    <section
      id="contacto"
      className="relative isolate overflow-hidden pt-[max(9rem,28vw)] pb-[max(16rem,26vw)] lg:min-h-[55.6vw]"
    >
      <SkyBackdrop sky={SKY.cta} />

      {/* Marca de agua. Reutiliza el hexágono con la M que ya existe: no hace
          falta ningún asset nuevo. Sólo en escritorio — a anchos pequeños se
          come el copy en vez de acompañarlo. */}
      <HexOutline
        aria-hidden
        className="pointer-events-none absolute -right-[8%] top-[8%] -z-10 hidden h-[46vw] w-[46vw] text-white/25 lg:block"
      />

      {/* Velo del copy. El titular cae sobre la curva clara y se lee solo, pero
          el lead ya baja a la zona de nubes doradas y ahí la tinta se apaga.
          Igual que en casos, el velo va de lado y no como caja: se lee como luz
          entrando por la izquierda. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full bg-[linear-gradient(to_right,rgba(255,251,240,0.9),rgba(255,251,240,0.45)_52%,transparent)] lg:w-[56%]"
      />

      {/* Descenso al pie: del ámbar con el que muere la foto al negro del
          footer. El pie conserva su hairline miel como línea de horizonte. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38vh] bg-[linear-gradient(to_bottom,rgba(142,98,32,0)_0%,rgba(96,63,16,0.55)_38%,rgba(38,25,8,0.9)_74%,#0B0B0C_100%)]"
      />

      <div className="mx-auto max-w-[88rem] px-6">
        {/* El copy va arriba a la izquierda porque es donde la foto es más
            clara (la curva blanca); más abajo el ámbar se come la tinta. */}
        <div className="max-w-2xl">
          <SectionHeading
            tone="light"
            index="04"
            eyebrow="Contacto"
            title="¿Listo para cocinar algo extraordinario?"
            display
            lead="Cuéntanos tu idea y prepararemos la receta perfecta para llevarla al siguiente nivel."
          />

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            {/* Píldora de tinta y no de miel: sobre el ámbar de la foto el
                borde de un botón miel se queda en 1,7:1 y no llega al mínimo de
                elementos no textuales. La miel vuelve en el hover. */}
            <a
              href={whatsappLink("Hola Miel Mostaza, quiero cocinar algo extraordinario.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 font-heading font-semibold text-white shadow-[0_14px_34px_rgba(60,38,4,0.45)] transition-colors duration-300 hover:bg-honey hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Hablemos por WhatsApp
              <ArrowUpRight className="h-5 w-5" />
              <span className="sr-only">(se abre en una pestaña nueva)</span>
            </a>

            <a
              href={`mailto:${BRAND.email}`}
              className="sky-glass inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-7 py-3.5 font-heading font-semibold text-ink transition-colors duration-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Escríbenos un correo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
