import type { Metadata } from "next";
import Link from "next/link";
import LandingFooter from "@/components/landing/LandingFooter";
import Navbar from "@/components/landing/Navbar";
import { POSTS } from "@/lib/landingContent";

// Blog.
//
// La ruta existe para que no dé 404 si alguien la escribe o llega desde fuera,
// pero **el pie no la enlaza mientras `POSTS` esté vacío**, y el sitemap tampoco
// la incluye. Un blog sin entradas enlazado desde el pie es prometer contenido
// que no existe: la versión pasiva del mismo problema por el que este repo
// borró los testimonios inventados.
//
// Para encenderlo basta con añadir entradas a POSTS: el enlace del pie y la
// entrada del sitemap aparecen solos.

export const metadata: Metadata = {
  title: "Blog — Miel Mostaza",
  description: "Notas sobre lo que aprendemos construyendo productos digitales.",
  // Sin entradas no hay nada que indexar, y una página que dice "todavía no
  // hay nada" en los resultados de búsqueda resta más de lo que suma.
  robots: POSTS.length === 0 ? { index: false, follow: true } : undefined,
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-mist">
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div>
          <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-ink/60">
            Notas
          </p>
          <h1 className="mt-4 font-heading text-[clamp(2rem,4.6vw,3.2rem)] font-bold leading-[1.08]">
            Blog
          </h1>
        </div>

        {POSTS.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-black/10 bg-white p-8">
            <p className="font-heading font-semibold">Todavía no hemos publicado nada.</p>
            <p className="mt-2 leading-relaxed text-ink/70">
              Preferimos no llenar esto de relleno. Mientras tanto, lo que hacemos se ve mejor en
              los proyectos que ya están en la calle.
            </p>
            <Link
              href="/casos-de-exito"
              className="mt-6 inline-flex min-h-[44px] items-center rounded-full bg-ink px-6 py-3 font-heading text-sm font-semibold text-white transition-colors duration-300 hover:bg-honey hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Ver los casos
            </Link>
          </div>
        ) : (
          <ul className="mt-12 space-y-5">
            {POSTS.map((post) => (
              <li key={post.slug} className="rounded-2xl border border-black/10 bg-white p-6">
                <p className="text-xs uppercase tracking-[0.2em] text-ink/50">{post.date}</p>
                <h2 className="mt-2 font-heading text-xl font-bold">{post.title}</h2>
                <p className="mt-2 leading-relaxed text-ink/70">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
      <LandingFooter />
    </div>
  );
}
