"use client";

import { useEffect, useState } from "react";
import DashboardMetric from "@/components/DashboardMetric";
import Badge from "@/components/ui/Badge";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import type { Project } from "@/lib/types";

interface Stats {
  totalProjects: number;
  activeProjects: number;
  deliveredThisMonth: number;
  totalClients: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/api/stats"), api.get("/api/projects")])
      .then(([statsRes, projectsRes]) => {
        setStats(statsRes.data);
        setProjects(projectsRes.data.projects.slice(0, 5));
      })
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<Project>[] = [
    { header: "Proyecto", cell: (p) => <span className="font-medium">{p.name}</span> },
    { header: "Cliente", cell: (p) => p.client?.name ?? "—" },
    { header: "Estado", cell: (p) => <Badge status={p.status} /> },
    {
      header: "Entrega",
      cell: (p) =>
        p.deliveryDate ? new Date(p.deliveryDate).toLocaleDateString("es") : "—",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-heading text-2xl font-bold">Resumen</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardMetric label="Proyectos totales" value={stats?.totalProjects ?? 0} icon="📁" />
        <DashboardMetric label="En desarrollo" value={stats?.activeProjects ?? 0} icon="🔧" />
        <DashboardMetric label="Entregados (mes)" value={stats?.deliveredThisMonth ?? 0} icon="✅" />
        <DashboardMetric label="Clientes" value={stats?.totalClients ?? 0} icon="👥" />
      </div>

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold">Últimos proyectos</h2>
        <DataTable
          columns={columns}
          rows={projects}
          rowKey={(p) => p.id}
          empty="Aún no hay proyectos. Crea el primero en la sección Proyectos."
        />
      </div>
    </div>
  );
}
