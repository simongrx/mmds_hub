import type { Metadata } from "next";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import { BRAND, whatsappLink } from "@/lib/brand";
import { FAQS } from "@/lib/landingContent";

// Preguntas frecuentes.
//
// Con `<details>`/`<summary>` nativos y no con un acordeón de React: cero JS,
// accesible de fábrica (el navegador ya gestiona foco, teclado y estado
// expandido) y funciona aunque la página no llegue a hidratar. Un acordeón a
// mano aquí sería reimplementar peor algo que el navegador ya trae.
//
// El JSON-LD no es adorno: `FAQPage` es de los pocos schemas que Google usa de
// verdad, y esta es la única de las páginas nuevas donde aporta algo real.

export const metadata: Metadata = {
  title: "Preguntas frecuentes — Miel Mostaza",
  description:
    "Qué hacemos, cuánto cuesta, cuánto tardamos y cómo trabajamos. Las dudas que nos llegan siempre, respondidas.",
};

export default function PreguntasFrecuentesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div>
          <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-ink/60">
            Dudas resueltas
          </p>
          <h1 className="mt-4 font-heading text-[clamp(2rem,4.6vw,3.2rem)] font-bold leading-[1.08]">
            Preguntas frecuentes
          </h1>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink/70">
            Lo que nos preguntan siempre. Si lo tuyo no está aquí, escríbenos y te lo contamos.
          </p>
        </div>

        <ul className="mt-12 space-y-3">
          {FAQS.map((faq) => (
            <li key={faq.question}>
              <details className="group rounded-2xl border border-black/10 bg-white px-6 py-5 open:shadow-[0_18px_40px_-28px_rgba(60,38,4,0.5)]">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-heading font-bold leading-snug marker:content-none">
                  {faq.question}
                  {/* El signo va en el propio marcador y no en un icono para
                      que siga funcionando sin CSS: el `+` gira a `×` sólo por
                      rotación, así que no hay dos glifos que mantener. */}
                  <span
                    aria-hidden
                    className="mt-0.5 shrink-0 text-xl leading-none text-honey-ink transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-ink/70">{faq.answer}</p>
              </details>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-2xl bg-honey/20 p-6">
          <p className="font-heading font-semibold">¿Sigues con dudas?</p>
          <p className="mt-2 text-sm text-ink/70">
            Escríbenos por{" "}
            <a
              href={whatsappLink("Hola Miel Mostaza, tengo una duda.")}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-mustard-dark hover:underline"
            >
              WhatsApp
            </a>{" "}
            o a{" "}
            <a
              href={`mailto:${BRAND.email}`}
              className="font-medium text-mustard-dark hover:underline"
            >
              {BRAND.email}
            </a>
            .
          </p>
        </div>
      </main>
      <LandingFooter />

      <script
        type="application/ld+json"
        // Contenido nuestro y estático, no entrada de usuario.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
