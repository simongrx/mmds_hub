"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import ClientModal from "@/components/ClientModal";
import Button from "@/components/ui/Button";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Input from "@/components/ui/Input";
import Spinner from "@/components/ui/Spinner";
import { api } from "@/lib/api";
import type { Client } from "@/lib/types";

export default function ClientesPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/api/clients")
      .then((res) => setClients(res.data.clients))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(client: Client) {
    if (!confirm(`¿Eliminar a "${client.name}"? Esto borrará sus proyectos.`)) return;
    try {
      await api.delete(`/api/clients/${client.id}`);
      toast.success("Cliente eliminado.");
      load();
    } catch {
      toast.error("No se pudo eliminar.");
    }
  }

  const filtered = clients.filter((c) =>
    [c.name, c.email, c.company]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns: Column<Client>[] = [
    { header: "Nombre", cell: (c) => <span className="font-medium">{c.name}</span> },
    { header: "Email", cell: (c) => c.email ?? "—" },
    { header: "Teléfono", cell: (c) => c.phone ?? "—" },
    { header: "Empresa", cell: (c) => c.company ?? "—" },
    { header: "Proyectos", cell: (c) => c._count?.projects ?? 0 },
    {
      header: "",
      className: "text-right whitespace-nowrap",
      cell: (c) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            className="px-2 py-1"
            onClick={() => {
              setEditing(c);
              setModalOpen(true);
            }}
          >
            ✏️
          </Button>
          <Button variant="ghost" className="px-2 py-1" onClick={() => remove(c)}>
            🗑️
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">Clientes</h1>
        <Button
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          + Nuevo cliente
        </Button>
      </div>

      <div className="max-w-sm">
        <Input
          placeholder="Buscar por nombre, email o empresa…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={filtered}
          rowKey={(c) => c.id}
          empty="No hay clientes todavía."
        />
      )}

      <ClientModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={load}
        client={editing}
      />
    </div>
  );
}
