import type { Metadata } from "next";
import CaseCard from "@/components/landing/CaseCard";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import { resolveCaseImages } from "@/lib/caseImages";
import { getPortfolio } from "@/lib/serverApi";

// El destino de "Ver todos los proyectos". Hasta ahora ese botón llevaba al
// formulario de contacto, que es un enlace que miente.
//
// No inventa nada: reutiliza los mismos datos, el mismo resolvedor de fotos y
// la misma tarjeta que el mosaico de la home. La única diferencia es que aquí
// caben todos, en una reja regular, sin el reparto de anchos que allí sirve
// para dar jerarquía a un destacado.

export const metadata: Metadata = {
  title: "Casos de éxito — Miel Mostaza",
  description:
    "Proyectos reales que hemos cocinado: webs, plataformas y campañas con resultados que se pueden visitar.",
};

export default async function CasosDeExitoPage() {
  const projects = await getPortfolio();
  const images = resolveCaseImages(projects);

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-ink/60">
            Casos reales
          </p>
          <h1 className="mt-4 font-heading text-[clamp(2rem,4.6vw,3.2rem)] font-bold leading-[1.08]">
            Proyectos que han despegado
          </h1>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink/70">
            Cada uno está publicado y se puede visitar. Sin maquetas ni pantallazos de algo que
            nunca salió.
          </p>
        </div>

        {projects.length === 0 ? (
          /* La API se traga sus errores y devuelve [] (lib/serverApi.ts). Aquí
             el hueco se nota mucho más que en la home, porque es la página
             entera: mejor decirlo. */
          <p className="mt-14 rounded-2xl border border-black/10 bg-white p-8 text-center text-ink/70">
            Estamos preparando esta sección. Mientras tanto, escríbenos y te contamos en qué
            andamos.
          </p>
        ) : (
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {projects.map((project, i) => (
              /* `variant="half"` para todos: aquí no hay destacado, y la
                 proporción 4/3 de esa variante es la que mantiene la reja
                 pareja. El alto lo fija la proporción, nunca un row-span. */
              <li key={project.id} className="aspect-[4/3]">
                <CaseCard
                  project={project}
                  index={i}
                  variant="half"
                  image={images[project.id]}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
