import ContactForm from "./ContactForm";
import SectionHeading from "./SectionHeading";
import type { Service } from "@/lib/types";

// 04 — Cierre. Antes vivía suelto dentro de page.tsx; se extrae para que la
// composición de la home sea una lista de capítulos y no una mezcla de
// componentes y markup inline.
//
// Es el clímax del recorrido: fondo `void`, titular grande y un halo miel amplio
// detrás del panel. La miel se ha ido acumulando como acento a lo largo del
// tramo oscuro y aquí es lo único que ilumina la pantalla.

export default function ContactSection({ services }: { services: Service[] }) {
  return (
    <section
      id="contacto"
      className="tech-grid relative isolate overflow-hidden bg-void py-24 sm:py-32"
    >
      {/* Halo: va detrás del panel y desenfocado, así que no compite con el
          contraste del formulario (que es lo único que hay que poder leer). */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -z-10 h-[36rem] w-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,196,48,0.2),transparent_66%)] blur-2xl"
      />

      <div className="mx-auto max-w-2xl px-6">
        <SectionHeading
          index="04"
          eyebrow="Contacto"
          title="¿Listo para transformar tu negocio?"
          lead="Cuéntanos qué necesitas y preparamos la receta perfecta."
          align="center"
        />

        <div className="tech-glass mt-12 p-6 sm:p-9">
          <ContactForm services={services} variant="dark" />
        </div>
      </div>
    </section>
  );
}
