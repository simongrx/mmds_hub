"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Spinner from "@/components/ui/Spinner";
import {
  DeliverableSection,
  DocumentationSection,
  NextStepsSection,
  PortalFooter,
  ProjectHeader,
  ProjectInfo,
} from "@/components/portal/PortalSections";
import { publicApi } from "@/lib/api";
import type { Project } from "@/lib/types";

type ErrorCode = "expired" | "not_found" | "generic";

const ERROR_COPY: Record<ErrorCode, { emoji: string; title: string; text: string }> = {
  expired: {
    emoji: "⏳",
    title: "Este enlace ha expirado",
    text: "El acceso a este proyecto ya no está disponible. Contáctanos para renovarlo.",
  },
  not_found: {
    emoji: "🔍",
    title: "Proyecto no encontrado",
    text: "El enlace no es válido. Revisa que sea correcto o escríbenos.",
  },
  generic: {
    emoji: "😕",
    title: "Algo salió mal",
    text: "No pudimos cargar tu proyecto. Intenta de nuevo en unos minutos.",
  },
};

export default function ClientPortalPage() {
  const { accessToken } = useParams<{ accessToken: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorCode | null>(null);

  useEffect(() => {
    publicApi
      .get(`/api/public/proyecto/${accessToken}`)
      .then((res) => setProject(res.data.project))
      .catch((err) => {
        const code = err?.response?.data?.code as string | undefined;
        setError(code === "expired" ? "expired" : code === "not_found" ? "not_found" : "generic");
      })
      .finally(() => setLoading(false));
  }, [accessToken]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !project) {
    const copy = ERROR_COPY[error ?? "generic"];
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-6xl">{copy.emoji}</div>
        <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
        <p className="max-w-md text-ink/60">{copy.text}</p>
        <a
          href="mailto:hola@mielmostaza.com"
          className="mt-2 rounded-xl bg-honey px-5 py-2.5 font-semibold text-ink transition hover:bg-mustard-dark hover:text-white"
        >
          Contactar a Miel Mostaza
        </a>
        <Link href="/" className="text-sm text-mustard-dark hover:underline">
          Ir al inicio
        </Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-mist">
      <Toaster position="top-right" />
      <header className="border-b border-black/10 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <span className="font-heading text-lg font-bold">🍯 Miel Mostaza</span>
          <span className="text-sm text-ink/50">Proyecto finalizado</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl space-y-10 px-6 py-10">
        <ProjectHeader project={project} />
        <DeliverableSection project={project} />
        <DocumentationSection project={project} />
        <ProjectInfo project={project} />
        <NextStepsSection project={project} />
        <PortalFooter />
      </main>
    </div>
  );
}
