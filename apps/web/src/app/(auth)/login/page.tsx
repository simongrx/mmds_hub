"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { api } from "@/lib/api";
import { setSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mielmostaza.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setSession(data.token, data.user);
      toast.success(`¡Bienvenido, ${data.user.name}!`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "No se pudo iniciar sesión.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Toaster position="top-right" />
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="text-5xl">🍯</div>
          <h1 className="mt-3 font-heading text-2xl font-bold">
            Panel Miel Mostaza
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            Inicia sesión para gestionar tus proyectos.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mielmostaza.com"
              className="w-full rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:border-honey focus:ring-2 focus:ring-honey/30"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:border-honey focus:ring-2 focus:ring-honey/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-honey px-4 py-3 font-heading font-semibold text-ink transition hover:bg-mustard-dark hover:text-white disabled:opacity-60"
          >
            {loading ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm">
          <Link href="/" className="text-mustard-dark hover:underline">
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </main>
  );
}
