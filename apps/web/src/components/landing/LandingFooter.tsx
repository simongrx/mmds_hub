import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { SOCIAL_ICONS } from "@/components/icons/socialIcons";
import { BRAND, SOCIAL, whatsappLink } from "@/lib/brand";
import { BACKEND_ENABLED } from "@/lib/features";
import { POSTS } from "@/lib/landingContent";

// El pie.
//
// `void` en vez de `ink`: con `ink` (más claro) se leía como una banda pegada al
// final. La hairline miel superior hace de línea de horizonte — es lo único que
// separa este negro del ámbar con el que muere el cielo del cierre, que baja
// hasta aquí con su propio degradado (ver CtaSection). Sin ese degradado el
// salto sería un corte.
//
// ── Tres enlaces que NO están, y por qué ──
//
//   · "Nosotros" no tiene destino. El Navbar ya lo quitó por eso mismo cuando la
//     sección de testimonios dejó de montarse. Aquí apunta a /#proceso, que es
//     lo más parecido a "quiénes somos" que hay publicado.
//   · "Blog" sólo aparece con entradas (POSTS). La ruta existe siempre, pero
//     enlazar un blog vacío es prometer contenido que no existe.
//   · Las redes sólo aparecen con URLs (SOCIAL). Un icono de LinkedIn que no
//     lleva a ningún LinkedIn es peor que no tener icono.
//
// Es el mismo criterio que ya gobierna TESTIMONIALS y el enlace a Panel: aquí
// no se enseña nada que no lleve a alguna parte.

function FooterHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-heading text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white/45">
      {children}
    </p>
  );
}

const linkCls = "text-white/70 transition-colors duration-200 hover:text-honey";

export default function LandingFooter() {
  return (
    <footer className="tech-grid relative isolate border-t border-honey/20 bg-void px-6 py-14 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 font-heading text-xl font-bold">
            <BrandMark className="h-10 w-10" />
            Miel Mostaza
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            La receta para crecer digitalmente.
          </p>
        </div>

        <nav aria-label="Navegación">
          <FooterHeading>Navegación</FooterHeading>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="/#inicio" className={linkCls}>Inicio</a></li>
            <li><a href="/#servicios" className={linkCls}>Servicios</a></li>
            <li><a href="/#portfolio" className={linkCls}>Proyectos</a></li>
            <li><a href="/#proceso" className={linkCls}>Nosotros</a></li>
          </ul>
        </nav>

        <nav aria-label="Recursos">
          <FooterHeading>Recursos</FooterHeading>
          <ul className="mt-4 space-y-2 text-sm">
            {POSTS.length > 0 && (
              <li><Link href="/blog" className={linkCls}>Blog</Link></li>
            )}
            <li><Link href="/casos-de-exito" className={linkCls}>Casos de éxito</Link></li>
            <li>
              <Link href="/preguntas-frecuentes" className={linkCls}>
                Preguntas frecuentes
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <FooterHeading>Contacto</FooterHeading>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={whatsappLink("Hola Miel Mostaza, quiero información.")}
                target="_blank"
                rel="noreferrer"
                className={linkCls}
              >
                WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${BRAND.email}`} className={linkCls}>
                {BRAND.email}
              </a>
            </li>
            <li className="text-white/60">{BRAND.location}</li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center gap-6 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
        <p className="text-center text-xs text-white/40 sm:text-left">
          © {new Date().getFullYear()} Miel Mostaza Digital Solutions. Todos los derechos
          reservados.
          {/* El panel sólo se enseña si existe: sin API el middleware responde
              404 a /login, y un enlace roto en el pie es peor que no tenerlo. */}
          {BACKEND_ENABLED && (
            <>
              {" · "}
              <Link href="/login" className="hover:text-white/70">
                Panel
              </Link>
            </>
          )}
        </p>

        {SOCIAL.length > 0 && (
          <ul className="flex items-center gap-3">
            {SOCIAL.map((s) => {
              const Icon = SOCIAL_ICONS[s.id];
              return (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/70 transition-colors duration-200 hover:border-honey/60 hover:text-honey focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-honey"
                  >
                    <Icon className="h-[1.05rem] w-[1.05rem]" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </footer>
  );
}
