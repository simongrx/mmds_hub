"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import DeliverableUpload from "@/components/DeliverableUpload";
import DocumentModal from "@/components/DocumentModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/Spinner";
import { API_URL, api } from "@/lib/api";
import { formatBytes, formatDate } from "@/lib/format";
import type { Deliverable, Project, ProjectDocument } from "@/lib/types";
import {
  DELIVERABLE_TYPE_LABELS,
  DOCUMENT_CATEGORY_LABELS,
} from "@/lib/types";

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<ProjectDocument | null>(null);

  const load = useCallback(() => {
    api
      .get(`/api/projects/${id}`)
      .then((res) => setProject(res.data.project))
      .catch(() => toast.error("No se pudo cargar el proyecto."))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const clientUrl =
    typeof window !== "undefined" && project
      ? `${window.location.origin}/proyecto/${project.accessToken}`
      : "";

  async function copyClientUrl() {
    await navigator.clipboard.writeText(clientUrl);
    toast.success("Enlace copiado.");
  }

  async function regenerateToken() {
    if (!project) return;
    if (!confirm("¿Regenerar el enlace? El enlace anterior dejará de funcionar.")) return;
    try {
      await api.post(`/api/projects/${project.id}/regenerate-token`);
      toast.success("Enlace regenerado.");
      load();
    } catch {
      toast.error("No se pudo regenerar.");
    }
  }

  async function deleteDeliverable(d: Deliverable) {
    if (!confirm(`¿Eliminar "${d.name}"?`)) return;
    try {
      await api.delete(`/api/deliverables/${d.id}`);
      toast.success("Entregable eliminado.");
      load();
    } catch {
      toast.error("No se pudo eliminar.");
    }
  }

  async function deleteDocument(doc: ProjectDocument) {
    if (!confirm(`¿Eliminar el documento "${doc.title}"?`)) return;
    try {
      await api.delete(`/api/documents/${doc.id}`);
      toast.success("Documento eliminado.");
      load();
    } catch {
      toast.error("No se pudo eliminar.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <p className="text-ink/60">Proyecto no encontrado.</p>
        <Link href="/dashboard/proyectos" className="text-mustard-dark hover:underline">
          ← Volver a proyectos
        </Link>
      </div>
    );
  }

  const deliverableColumns: Column<Deliverable>[] = [
    { header: "Nombre", cell: (d) => <span className="font-medium">{d.name}</span> },
    { header: "Tipo", cell: (d) => DELIVERABLE_TYPE_LABELS[d.type] },
    { header: "Tamaño", cell: (d) => formatBytes(d.fileSize) },
    { header: "Descargas", cell: (d) => d.downloadCount },
    {
      header: "",
      className: "text-right whitespace-nowrap",
      cell: (d) => (
        <div className="flex justify-end gap-2">
          {d.type === "link" ? (
            <a
              href={d.fileUrl ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg px-2 py-1 hover:bg-black/5"
            >
              🔗 Abrir
            </a>
          ) : (
            <a
              href={`${API_URL}/api/deliverables/${d.id}/download`}
              className="rounded-lg px-2 py-1 hover:bg-black/5"
            >
              ⬇️ Descargar
            </a>
          )}
          <button
            onClick={() => deleteDeliverable(d)}
            className="rounded-lg px-2 py-1 hover:bg-black/5"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  const documentColumns: Column<ProjectDocument>[] = [
    { header: "Título", cell: (doc) => <span className="font-medium">{doc.title}</span> },
    { header: "Categoría", cell: (doc) => DOCUMENT_CATEGORY_LABELS[doc.category] },
    {
      header: "",
      className: "text-right whitespace-nowrap",
      cell: (doc) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setEditingDoc(doc);
              setDocModalOpen(true);
            }}
            className="rounded-lg px-2 py-1 hover:bg-black/5"
          >
            ✏️
          </button>
          <button
            onClick={() => deleteDocument(doc)}
            className="rounded-lg px-2 py-1 hover:bg-black/5"
          >
            🗑️
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/proyectos"
          className="text-sm text-mustard-dark hover:underline"
        >
          ← Proyectos
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-2xl font-bold">{project.name}</h1>
          <Badge status={project.status} />
        </div>
      </div>

      {/* Info general */}
      <section className="grid gap-4 rounded-2xl border border-black/10 bg-white p-6 sm:grid-cols-2">
        <div>
          <p className="text-sm text-ink/50">Cliente</p>
          <p className="font-medium">{project.client?.name ?? "—"}</p>
        </div>
        <div>
          <p className="text-sm text-ink/50">Servicios</p>
          <p className="font-medium">
            {project.services?.map((s) => `${s.icon} ${s.name}`).join(", ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-sm text-ink/50">Inicio</p>
          <p className="font-medium">{formatDate(project.startDate)}</p>
        </div>
        <div>
          <p className="text-sm text-ink/50">Entrega</p>
          <p className="font-medium">{formatDate(project.deliveryDate)}</p>
        </div>
        {project.description && (
          <div className="sm:col-span-2">
            <p className="text-sm text-ink/50">Descripción</p>
            <p>{project.description}</p>
          </div>
        )}
      </section>

      {/* Acceso cliente */}
      <section className="space-y-3 rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="font-heading text-lg font-semibold">Acceso del cliente</h2>
        <p className="text-sm text-ink/60">
          Enlace único para que el cliente vea su proyecto.
          {project.tokenExpiresAt && (
            <> Expira el {formatDate(project.tokenExpiresAt)}.</>
          )}
          {project.lastAccessedAt && (
            <> Último acceso: {formatDate(project.lastAccessedAt)}.</>
          )}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <code className="flex-1 overflow-x-auto rounded-lg bg-mist px-3 py-2 text-sm">
            {clientUrl}
          </code>
          <Button variant="secondary" onClick={copyClientUrl}>
            Copiar
          </Button>
          <Button variant="ghost" onClick={regenerateToken}>
            Regenerar
          </Button>
        </div>
      </section>

      {/* Entregables */}
      <section className="space-y-4">
        <h2 className="font-heading text-lg font-semibold">Entregables</h2>
        <DeliverableUpload projectId={project.id} onUploaded={load} />
        <DataTable
          columns={deliverableColumns}
          rows={project.deliverables ?? []}
          rowKey={(d) => d.id}
          empty="Aún no hay entregables."
        />
      </section>

      {/* Documentación */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Documentación</h2>
          <Button
            onClick={() => {
              setEditingDoc(null);
              setDocModalOpen(true);
            }}
          >
            + Agregar documento
          </Button>
        </div>
        <DataTable
          columns={documentColumns}
          rows={project.documents ?? []}
          rowKey={(doc) => doc.id}
          empty="Aún no hay documentos."
        />
      </section>

      <DocumentModal
        open={docModalOpen}
        onClose={() => setDocModalOpen(false)}
        onSaved={load}
        projectId={project.id}
        document={editingDoc}
      />
    </div>
  );
}
