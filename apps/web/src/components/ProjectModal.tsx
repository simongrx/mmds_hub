"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { api } from "@/lib/api";
import type { Client, Project, ProjectStatus, Service } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  project: Project | null; // null = crear
  clients: Client[];
  services: Service[];
}

// "2026-07-22T00:00:00.000Z" -> "2026-07-22" para el input date.
function toInputDate(iso?: string | null): string {
  return iso ? iso.slice(0, 10) : "";
}
// "2026-07-22" -> ISO datetime para el backend (zod .datetime()).
function toIso(date: string): string | "" {
  return date ? new Date(`${date}T00:00:00.000Z`).toISOString() : "";
}

const STATUSES: ProjectStatus[] = ["pending", "in_development", "delivered"];

export default function ProjectModal({
  open,
  onClose,
  onSaved,
  project,
  clients,
  services,
}: Props) {
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("pending");
  const [startDate, setStartDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (project) {
      setName(project.name);
      setClientId(project.clientId);
      setDescription(project.description ?? "");
      setStatus(project.status);
      setStartDate(toInputDate(project.startDate));
      setDeliveryDate(toInputDate(project.deliveryDate));
      setServiceIds(project.services?.map((s) => s.id) ?? []);
    } else {
      setName("");
      setClientId(clients[0]?.id ?? "");
      setDescription("");
      setStatus("pending");
      setStartDate("");
      setDeliveryDate("");
      setServiceIds([]);
    }
  }, [open, project, clients]);

  function toggleService(id: string) {
    setServiceIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("El nombre es obligatorio.");
    if (!clientId) return toast.error("Selecciona un cliente.");

    const payload = {
      name,
      clientId,
      description,
      status,
      startDate: toIso(startDate),
      deliveryDate: toIso(deliveryDate),
      serviceIds,
    };

    setSaving(true);
    try {
      if (project) {
        await api.put(`/api/projects/${project.id}`, payload);
        toast.success("Proyecto actualizado.");
      } else {
        await api.post("/api/projects", payload);
        toast.success("Proyecto creado.");
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "No se pudo guardar.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={project ? "Editar proyecto" : "Nuevo proyecto"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Nombre *" value={name} onChange={(e) => setName(e.target.value)} />

        <Select label="Cliente *" value={clientId} onChange={(e) => setClientId(e.target.value)}>
          <option value="" disabled>
            Selecciona un cliente
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>

        <Textarea
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <p className="mb-2 text-sm font-medium">Servicios</p>
          <div className="grid grid-cols-2 gap-2">
            {services.map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-sm hover:bg-mist/50"
              >
                <input
                  type="checkbox"
                  checked={serviceIds.includes(s.id)}
                  onChange={() => toggleService(s.id)}
                  className="accent-honey"
                />
                <span>
                  {s.icon} {s.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Estado"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Fecha de inicio"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Fecha de entrega"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Guardando…" : "Guardar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
