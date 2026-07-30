import Link from "next/link";
import BrandMark from "@/components/BrandMark";
import { BRAND } from "@/lib/brand";
import { BACKEND_ENABLED } from "@/lib/features";

export default function LandingFooter() {
  return (
    // `void` en vez de `ink`: el tramo oscuro de la home desemboca aquí, y con
    // `ink` (más claro) el footer se leía como una banda pegada al final. La
    // hairline miel superior es el mismo remate que separa los capítulos.
    <footer className="tech-grid relative isolate border-t border-honey/20 bg-void px-6 py-12 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        <div>
          <p className="flex items-center gap-2.5 font-heading text-xl font-bold">
            <BrandMark className="h-10 w-10" />
            Miel Mostaza
          </p>
          <p className="mt-2 text-sm text-white/60">La receta para crecer digitalmente.</p>
        </div>
        <div>
          <p className="font-heading font-semibold">Enlaces</p>
          <ul className="mt-3 space-y-1 text-sm text-white/70">
            <li><a href="/#servicios" className="hover:text-white">Servicios</a></li>
            <li><a href="/#portfolio" className="hover:text-white">Casos</a></li>
            <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
            {/* El panel sólo se enseña si existe: sin API el middleware
                responde 404 a /login, y un enlace roto en el pie es peor que
                no tener enlace. */}
            {BACKEND_ENABLED && (
              <li><Link href="/login" className="hover:text-white">Panel</Link></li>
            )}
          </ul>
        </div>
        <div>
          <p className="font-heading font-semibold">Contacto</p>
          <ul className="mt-3 space-y-1 text-sm text-white/70">
            <li>{BRAND.email}</li>
            <li>{BRAND.location}</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Miel Mostaza Digital Solutions. Todos los derechos reservados.
      </div>
    </footer>
  );
}
