"use client";

import toast from "react-hot-toast";
import { API_URL } from "@/lib/api";
import { BRAND, whatsappLink } from "@/lib/brand";
import { formatDate } from "@/lib/format";
import type { Deliverable, Project } from "@/lib/types";
import {
  DELIVERABLE_TYPE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
  STATUS_LABELS,
} from "@/lib/types";
import FadeIn from "./FadeIn";

// 1. Resumen ejecutivo
export function ProjectHeader({ project }: { project: Project }) {
  return (
    <FadeIn className="rounded-3xl bg-gradient-to-br from-honey/25 to-mustard/10 p-8 sm:p-10">
      <p className="font-heading text-sm font-semibold uppercase tracking-wide text-mustard-dark">
        {STATUS_LABELS[project.status]}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
        Tu proyecto está listo ✓
      </h1>
      <p className="mt-2 text-lg text-ink/70">{project.name}</p>
      {project.description && (
        <p className="mt-4 max-w-2xl text-ink/70">{project.description}</p>
      )}
      <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        {project.client && (
          <div>
            <span className="text-ink/50">Cliente</span>
            <p className="font-semibold">{project.client.name}</p>
          </div>
        )}
        {project.services && project.services.length > 0 && (
          <div>
            <span className="text-ink/50">Servicios entregados</span>
            <p className="font-semibold">
              {project.services.map((s) => `${s.icon} ${s.name}`).join(" · ")}
            </p>
          </div>
        )}
        {project.deliveryDate && (
          <div>
            <span className="text-ink/50">Fecha de entrega</span>
            <p className="font-semibold">{formatDate(project.deliveryDate)}</p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// 2. Entregables
export function DeliverableSection({ project }: { project: Project }) {
  const deliverables = project.deliverables ?? [];
  const hasFiles = deliverables.some((d) => d.fileUrl?.startsWith("/uploads/"));

  if (deliverables.length === 0) return null;

  function downloadHref(d: Deliverable) {
    return d.type === "link"
      ? d.fileUrl ?? "#"
      : `${API_URL}/api/deliverables/${d.id}/download`;
  }

  return (
    <FadeIn className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold">Entregables</h2>
        {hasFiles && (
          <a
            href={`${API_URL}/api/public/proyecto/${project.accessToken}/download-all`}
            className="rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink/80"
          >
            ⬇️ Descargar todo (.zip)
          </a>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {deliverables.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-5"
          >
            <div className="min-w-0">
              <p className="truncate font-semibold">{d.name}</p>
              <p className="text-sm text-ink/50">{DELIVERABLE_TYPE_LABELS[d.type]}</p>
            </div>
            <a
              href={downloadHref(d)}
              target={d.type === "link" ? "_blank" : undefined}
              rel={d.type === "link" ? "noreferrer" : undefined}
              className="shrink-0 rounded-xl bg-honey px-4 py-2 text-sm font-semibold text-ink transition hover:bg-mustard-dark hover:text-white"
            >
              {d.type === "link" ? "Abrir" : "Descargar"}
            </a>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}

// 3. Documentación
export function DocumentationSection({ project }: { project: Project }) {
  const documents = project.documents ?? [];
  if (documents.length === 0) return null;

  return (
    <FadeIn className="space-y-4">
      <h2 className="font-heading text-2xl font-bold">Documentación</h2>
      <div className="space-y-4">
        {documents.map((doc) => (
          <details
            key={doc.id}
            className="group rounded-2xl border border-black/10 bg-white p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <span className="font-semibold">{doc.title}</span>
              <span className="rounded-full bg-mist px-2.5 py-1 text-xs font-medium text-ink/60">
                {DOCUMENT_CATEGORY_LABELS[doc.category]}
              </span>
            </summary>
            {doc.content && (
              <pre className="mt-4 whitespace-pre-wrap font-body text-sm text-ink/80">
                {doc.content}
              </pre>
            )}
          </details>
        ))}
      </div>
    </FadeIn>
  );
}

// 4. Información del proyecto (timeline + tecnologías)
export function ProjectInfo({ project }: { project: Project }) {
  const rows = [
    { label: "Inicio", value: formatDate(project.startDate) },
    { label: "Entrega", value: formatDate(project.deliveryDate) },
  ];

  return (
    <FadeIn className="space-y-4">
      <h2 className="font-heading text-2xl font-bold">Información del proyecto</h2>
      <div className="grid gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label}>
            <p className="text-sm text-ink/50">{r.label}</p>
            <p className="font-medium">{r.value}</p>
          </div>
        ))}
        {project.services && project.services.length > 0 && (
          <div className="sm:col-span-2">
            <p className="text-sm text-ink/50">Tecnologías / servicios</p>
            <p className="font-medium">
              {project.services.map((s) => `${s.icon} ${s.name}`).join(", ")}
            </p>
          </div>
        )}
      </div>
    </FadeIn>
  );
}

// 5. Próximos pasos
export function NextStepsSection({ project }: { project: Project }) {
  const message = `Hola, tengo una consulta sobre mi proyecto "${project.name}".`;

  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Enlace copiado.");
  }

  return (
    <FadeIn className="space-y-4 rounded-3xl bg-ink p-8 text-white sm:p-10">
      <h2 className="font-heading text-2xl font-bold">¿Necesitas algo más?</h2>
      <p className="text-white/70">
        Estamos aquí para ayudarte con cambios, dudas o el siguiente proyecto.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl bg-honey px-5 py-2.5 font-semibold text-ink transition hover:bg-mustard"
        >
          💬 Escríbenos por WhatsApp
        </a>
        <a
          href={`mailto:${BRAND.email}?subject=${encodeURIComponent(`Proyecto ${project.name}`)}`}
          className="rounded-xl border border-white/25 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
        >
          ✉️ {BRAND.email}
        </a>
        <button
          onClick={copyLink}
          className="rounded-xl border border-white/25 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
        >
          🔗 Compartir enlace
        </button>
      </div>
    </FadeIn>
  );
}

// Footer minimalista
export function PortalFooter() {
  return (
    <footer className="border-t border-black/10 pt-8 text-center text-sm text-ink/50">
      <p className="font-heading text-lg">🍯 Miel Mostaza</p>
      <p className="mt-1">La receta para crecer digitalmente.</p>
      <p className="mt-2">
        {BRAND.email} · {BRAND.location}
      </p>
    </footer>
  );
}
