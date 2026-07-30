"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Resumen", icon: "📊", exact: true },
  { href: "/dashboard/proyectos", label: "Proyectos", icon: "📁" },
  { href: "/dashboard/clientes", label: "Clientes", icon: "👥" },
  { href: "/dashboard/entregas", label: "Entregas", icon: "📦", disabled: true },
  { href: "/dashboard/settings", label: "Configuración", icon: "⚙️", disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 border-r border-black/10 bg-white p-4 md:block">
      <Link href="/dashboard" className="mb-6 flex items-center gap-2 px-2">
        <span className="text-2xl">🍯</span>
        <span className="font-heading text-lg font-bold">Miel Mostaza</span>
      </Link>

      <nav className="space-y-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          if (link.disabled) {
            return (
              <span
                key={link.href}
                className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink/30"
                title="Próximamente"
              >
                <span>{link.icon}</span>
                {link.label}
              </span>
            );
          }

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-honey/20 text-mustard-dark"
                  : "text-ink/70 hover:bg-black/5"
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
