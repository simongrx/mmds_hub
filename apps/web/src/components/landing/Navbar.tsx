"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import BrandMark from "@/components/BrandMark";
import { ArrowUpRight, CloseIcon, MenuIcon } from "@/components/icons";
import { CTA_PRIMARY_LABEL, WHATSAPP_URL } from "@/content/hero";
import { TESTIMONIALS } from "@/lib/landingContent";

// "Nosotros" apuntaba a /#testimonios, y esa sección ya no se renderiza
// mientras no haya testimonios reales (ver landingContent.ts): el enlace se
// quedaba sin destino y no hacía nada al pulsarlo. Vuelve solo, junto con la
// sección, en cuanto se añada el primero.
const links = [
  { href: "/#inicio", label: "Inicio", match: "/" },
  { href: "/#servicios", label: "Servicios", match: "/servicios" },
  { href: "/#portfolio", label: "Proyectos", match: null },
  ...(TESTIMONIALS.length > 0
    ? [{ href: "/#testimonios", label: "Nosotros", match: null }]
    : []),
  { href: "/contacto", label: "Contacto", match: "/contacto" },
];

// Scroll a partir del cual el navbar en modo overlay adquiere fondo.
const SOLID_AT = 60;

/**
 * `overlay` sólo lo usa la home: el navbar flota transparente sobre el hero
 * (como en el mockup) y se vuelve sólido al hacer scroll. El resto de páginas
 * no tiene hero a sangre, así que conservan la barra sólida de siempre.
 */
export default function Navbar({ overlay = false }: { overlay?: boolean }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!overlay) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > SOLID_AT));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [overlay]);

  // Transparente sólo mientras estamos arriba del todo y el menú móvil está
  // cerrado (si está abierto necesita fondo para que se lea).
  const transparent = overlay && !scrolled && !open;
  // En la home, todo lo que hay tras el hero es el tramo oscuro, así que la
  // barra sólida va de vidrio oscuro: una barra clara flotando sobre `void` se
  // leería como un parche pegado encima. El resto de páginas (sin `overlay`) no
  // cambia: siguen sobre fondo claro.
  const dark = overlay;

  return (
    <header
      className={`${overlay ? "fixed inset-x-0 top-0" : "sticky top-0"} z-50 transition-colors duration-300 ${
        transparent
          ? "border-b border-transparent bg-transparent"
          : dark
            ? "border-b border-white/10 bg-void/75 backdrop-blur-md"
            : "border-b border-black/5 bg-mist/85 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          {/* Algo mayor que el hexágono que había aquí: el isotipo trae margen
              propio, así que a 8 se veía más pequeño de lo que mide. */}
          <BrandMark className="h-10 w-10" />
          <span
            className={`font-heading text-lg font-bold transition-colors duration-300 ${
              dark && !transparent ? "text-white" : "text-ink"
            }`}
          >
            Miel Mostaza
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active = l.match !== null && pathname === l.match;
            return (
              <a
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition ${
                  dark && !transparent
                    ? active
                      ? "font-semibold text-white underline decoration-honey decoration-2 underline-offset-8"
                      : "font-medium text-white/70 hover:text-white"
                    : active
                      ? "font-semibold text-ink underline decoration-ink decoration-2 underline-offset-8"
                      : "font-medium text-ink/70 hover:text-ink"
                }`}
              >
                {l.label}
              </a>
            );
          })}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-honey px-5 py-2.5 text-sm font-semibold text-ink shadow-[0_6px_20px_rgba(244,196,48,0.4)] transition duration-200 hover:bg-mustard-dark hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {CTA_PRIMARY_LABEL}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>

        <button
          type="button"
          className={`-mr-2 flex h-11 w-11 items-center justify-center transition-colors duration-300 md:hidden ${
            dark && !transparent ? "text-white" : "text-ink"
          }`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-movil"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav
          id="menu-movil"
          className={`flex flex-col gap-1 border-t px-6 py-3 md:hidden ${
            dark ? "border-white/10" : "border-black/5"
          }`}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex min-h-[44px] items-center text-sm font-medium ${
                dark ? "text-white/75" : "text-ink/70"
              }`}
            >
              {l.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={`flex min-h-[44px] items-center gap-1.5 text-sm font-semibold ${
              dark ? "text-honey" : "text-mustard-dark"
            }`}
          >
            {CTA_PRIMARY_LABEL}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </nav>
      )}
    </header>
  );
}
