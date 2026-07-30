"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, getUser } from "@/lib/auth";
import type { User } from "@/lib/types";

export default function DashboardHeader() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
      <span className="font-heading text-sm text-ink/50 md:hidden">🍯 Miel Mostaza</span>
      <div className="ml-auto flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-semibold">{user?.name ?? "…"}</p>
          <p className="text-xs text-ink/50">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-xl border border-black/15 px-3 py-2 text-sm font-medium transition hover:bg-black/5"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}
