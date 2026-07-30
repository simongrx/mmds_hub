"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { CheckIcon, ServiceIcon } from "@/components/icons/serviceIcons";
import { publicApi } from "@/lib/api";
import type { Service } from "@/lib/types";

const empty = { name: "", email: "", phone: "", company: "", message: "" };

// El formulario se usa en dos fondos: la página /contacto (claro, sin cambios) y
// el cierre de la home, que ahora es oscuro. `variant` sólo cambia el acabado;
// la lógica, la validación y el endpoint son los mismos.
type Variant = "light" | "dark";

/** Clases de los campos por variante. El foco es miel en las dos. */
const FIELD: Record<Variant, string> = {
  light:
    "w-full rounded-xl border border-black/15 px-4 py-2.5 outline-none focus:border-honey focus:ring-2 focus:ring-honey/30",
  // El placeholder sube a /60 (no /40): sobre `void` un gris más tenue no llega
  // al contraste mínimo y el campo se lee como deshabilitado.
  dark:
    "w-full rounded-xl border border-white/12 bg-white/[0.04] px-4 py-2.5 text-white placeholder:text-white/60 outline-none transition focus:border-honey focus:bg-white/[0.06] focus:ring-2 focus:ring-honey/35",
};

export default function ContactForm({
  services,
  variant = "light",
}: {
  services: Service[];
  variant?: Variant;
}) {
  const [form, setForm] = useState(empty);
  const [interest, setInterest] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const dark = variant === "dark";

  function set(key: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleInterest(name: string) {
    setInterest((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Dinos tu nombre.");
    if (!form.email.trim()) return toast.error("Necesitamos tu email.");
    if (!form.message.trim()) return toast.error("Escríbenos un mensaje.");

    setSending(true);
    try {
      await publicApi.post("/api/public/contact", { ...form, interest });
      setSent(true);
      toast.success("¡Mensaje enviado! Te contactaremos pronto.");
      setForm(empty);
      setInterest([]);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "No se pudo enviar. Intenta de nuevo.";
      toast.error(message);
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div
        className={`rounded-2xl border p-8 text-center ${
          dark ? "border-success/35 bg-success/[0.07]" : "border-success/40 bg-success/10"
        }`}
      >
        {/* Antes un 🎉. Un icono vectorial se tematiza y se ve igual en todas
            las plataformas; el emoji dependía de la fuente del sistema. */}
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/20 text-success">
          <CheckIcon className="h-6 w-6" />
        </span>
        <h3 className={`mt-3 font-heading text-xl font-bold ${dark ? "text-white/95" : ""}`}>
          ¡Gracias por escribirnos!
        </h3>
        <p className={`mt-1 ${dark ? "text-white/60" : "text-ink/60"}`}>
          Te responderemos muy pronto.
        </p>
        <button
          onClick={() => setSent(false)}
          className={`mt-4 text-sm font-semibold hover:underline ${
            dark ? "text-honey" : "text-mustard-dark"
          }`}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputCls = FIELD[variant];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Toaster position="top-right" />
      <div className="grid gap-4 sm:grid-cols-2">
        <input className={inputCls} placeholder="Nombre *" value={form.name} onChange={(e) => set("name", e.target.value)} />
        {/* `type` semántico: en móvil abre el teclado correcto. */}
        <input className={inputCls} type="email" autoComplete="email" placeholder="Email *" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input className={inputCls} type="tel" autoComplete="tel" placeholder="Teléfono" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input className={inputCls} autoComplete="organization" placeholder="Empresa" value={form.company} onChange={(e) => set("company", e.target.value)} />
      </div>

      {services.length > 0 && (
        <div>
          <p className={`mb-2 text-sm font-medium ${dark ? "text-white/80" : ""}`}>
            ¿Qué te interesa?
          </p>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => {
              const active = interest.includes(s.name);
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => toggleInterest(s.name)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border py-1.5 pl-2.5 pr-3.5 text-sm transition ${
                    dark
                      ? active
                        ? "border-honey bg-honey/15 text-honey"
                        : "border-white/12 text-white/70 hover:border-white/25 hover:bg-white/[0.05]"
                      : active
                        ? "border-honey bg-honey/20 text-mustard-dark"
                        : "border-black/15 hover:bg-black/5"
                  }`}
                >
                  <ServiceIcon slug={s.slug} icon={s.icon} className="h-4 w-4 text-[0.85rem]" />
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <textarea
        className={inputCls}
        rows={4}
        placeholder="Cuéntanos sobre tu proyecto *"
        value={form.message}
        onChange={(e) => set("message", e.target.value)}
      />

      <button
        type="submit"
        disabled={sending}
        className={`w-full rounded-xl bg-honey px-6 py-3 font-heading font-semibold text-ink transition hover:bg-mustard-dark hover:text-white disabled:opacity-60 sm:w-auto ${
          dark ? "shadow-[0_10px_30px_-8px_rgba(244,196,48,0.55)]" : ""
        }`}
      >
        {sending ? "Enviando…" : "Empecemos a cocinar 🍯"}
      </button>
    </form>
  );
}
