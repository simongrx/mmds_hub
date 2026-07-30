import type { Metadata } from "next";
import ContactForm from "@/components/landing/ContactForm";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import { BRAND, whatsappLink } from "@/lib/brand";
import { getServices } from "@/lib/serverApi";

export const metadata: Metadata = {
  title: "Contacto — Miel Mostaza",
  description:
    "Hablemos de tu proyecto. Escríbenos por email o WhatsApp y empecemos a cocinar algo grande.",
};

export default async function ContactoPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold">Hablemos</h1>
          <p className="mx-auto mt-3 max-w-xl text-ink/60">
            Cuéntanos qué tienes en mente. Respondemos rápido y sin tecnicismos.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <h2 className="font-heading text-lg font-bold">Contáctanos directo</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <span className="text-ink/50">Email</span>
                  <br />
                  <a href={`mailto:${BRAND.email}`} className="font-medium text-mustard-dark hover:underline">
                    {BRAND.email}
                  </a>
                </li>
                <li>
                  <span className="text-ink/50">WhatsApp</span>
                  <br />
                  <a
                    href={whatsappLink("Hola Miel Mostaza, quiero información.")}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-mustard-dark hover:underline"
                  >
                    Escríbenos por WhatsApp
                  </a>
                </li>
                <li>
                  <span className="text-ink/50">Ubicación</span>
                  <br />
                  <span className="font-medium">{BRAND.location}</span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl bg-honey/20 p-6">
              <p className="font-heading font-semibold">🍯 Vamos a cocinar algo grande</p>
              <p className="mt-2 text-sm text-ink/70">
                Cada proyecto empieza con una conversación. Sin costo, sin compromiso.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-6 sm:p-8">
            <ContactForm services={services} />
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
