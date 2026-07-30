import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import { SERVICE_DETAILS } from "@/lib/landingContent";
import { getServices } from "@/lib/serverApi";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const services = await getServices();
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return { title: "Servicio no encontrado — Miel Mostaza" };
  return {
    title: `${service.name} — Miel Mostaza`,
    description: service.description ?? undefined,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const services = await getServices();
  const service = services.find((s) => s.slug === params.slug);
  const detail = SERVICE_DETAILS[params.slug];

  if (!service || !detail) notFound();

  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main>
        <section className="bg-gradient-to-b from-honey/30 to-mist px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-6xl">{service.icon}</span>
            <h1 className="mt-4 font-heading text-4xl font-bold">{service.name}</h1>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink/70">{detail.intro}</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="font-heading text-2xl font-bold">Qué hacemos</h2>
              <ul className="mt-4 space-y-2">
                {detail.what.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-ink/80">
                    <span className="text-honey">🍯</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold">Por qué con nosotros</h2>
              <p className="mt-4 text-ink/80">{detail.why}</p>
              <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
                <p className="text-sm text-ink/50">Precio orientativo</p>
                <p className="font-heading text-xl font-bold text-mustard-dark">{detail.price}</p>
              </div>
            </div>
          </div>

          <div className="mt-12 rounded-3xl bg-ink p-8 text-center text-white">
            <h3 className="font-heading text-2xl font-bold">¿Te preparamos un presupuesto?</h3>
            <p className="mt-2 text-white/70">Sin compromiso, con toda la sazón.</p>
            <Link
              href="/contacto"
              className="mt-5 inline-block rounded-xl bg-honey px-6 py-3 font-heading font-semibold text-ink transition hover:bg-mustard"
            >
              Solicitar presupuesto
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/#servicios" className="text-sm text-mustard-dark hover:underline">
              ← Ver todos los servicios
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
