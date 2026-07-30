"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProjectModal from "@/components/ProjectModal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import type { Client, Project, ProjectStatus, Service } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

const STATUSES: ProjectStatus[] = ["pending", "in_development", "delivered"];

export default function ProyectosPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | ProjectStatus>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : "";
    Promise.all([
      api.get(`/api/projects${query}`),
      api.get("/api/clients"),
      api.get("/api/services"),
    ])
      .then(([projectsRes, clientsRes, servicesRes]) => {
        setProjects(projectsRes.data.projects);
        setClients(clientsRes.data.clients);
        setServices(servicesRes.data.services);
      })
      .finally(() => setLoading(false));
  }, [statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(project: Project) {
    if (!confirm(`¿Eliminar el proyecto "${project.name}"?`)) return;
    try {
      await api.delete(`/api/projects/${project.id}`);
      toast.success("Proyecto eliminado.");
      load();
    } catch {
      toast.error("No se pudo eliminar.");
    }
  }

  const columns: Column<Project>[] = [
    {
      header: "Proyecto",
      cell: (p) => (
        <Link
          href={`/dashboard/proyectos/${p.id}`}
          className="font-medium text-mustard-dark hover:underline"
        >
          {p.name}
        </Link>
      ),
    },
    { header: "Cliente", cell: (p) => p.client?.name ?? "—" },
    {
      header: "Servicios",
      cell: (p) => (
        <span className="text-sm">
          {p.services?.map((s) => s.icon).join(" ") || "—"}
        </span>
      ),
    },
    { header: "Estado", cell: (p) => <Badge status={p.status} /> },
    {
      header: "Entrega",
      cell: (p) =>
        p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString("es") : "—",
    },
    {
      header: "",
      className: "text-right whitespace-nowrap",
      cell: (p) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="px-2 py-1"
            onClick={() => {
              setEditing(p);
              setModalOpen(true);
            }}
          >
            ✏️
          </Button>
          <Button variant="ghost" className="px-2 py-1" onClick={() => remove(p)}>
            🗑️
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Proyectos</h1>
        <Button
          onClick={() => {
            if (clients.length === 0) {
              toast.error("Primero crea un cliente.");
              return;
            }
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Nuevo proyecto
        </Button>
      </div>

      <div className="max-w-xs">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "" | ProjectStatus)}
        >
          <option value="">Todos los estados</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={projects}
          rowKey={(p) => p.id}
          empty="No hay proyectos con este filtro."
        />
      )}

      <ProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        project={editing}
        clients={clients}
        services={services}
      />
    </div>
  );
}
