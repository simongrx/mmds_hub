"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Textarea from "@/components/ui/Textarea";
import { api } from "@/lib/api";
import type { Client } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  client: Client | null; // null = crear
}

const empty = { name: "", email: "", phone: "", company: "", notes: "" };

export default function ClientModal({ open, onClose, onSaved, client }: Props) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(
        client
          ? {
              name: client.name,
              email: client.email ?? "",
              phone: client.phone ?? "",
              company: client.company ?? "",
              notes: client.notes ?? "",
            }
          : empty
      );
    }
  }, [open, client]);

  function set(key: keyof typeof empty, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("El nombre es obligatorio.");
      return;
    }
    setSaving(true);
    try {
      if (client) {
        await api.put(`/api/clients/${client.id}`, form);
        toast.success("Cliente actualizado.");
      } else {
        await api.post("/api/clients", form);
        toast.success("Cliente creado.");
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
    <Modal open={open} onClose={onClose} title={client ? "Editar cliente" : "Nuevo cliente"}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Nombre *" value={form.name} onChange={(e) => set("name", e.target.value)} />
        <Input label="Email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Teléfono" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
          <Input label="Empresa" value={form.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <Textarea label="Notas" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
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
