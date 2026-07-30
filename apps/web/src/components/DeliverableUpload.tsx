"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { api } from "@/lib/api";
import type { DeliverableType } from "@/lib/types";
import { DELIVERABLE_TYPE_LABELS } from "@/lib/types";

const TYPES = Object.keys(DELIVERABLE_TYPE_LABELS) as DeliverableType[];

export default function DeliverableUpload({
  projectId,
  onUploaded,
}: {
  projectId: string;
  onUploaded: () => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<DeliverableType>("document");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const isLink = type === "link";

  function reset() {
    setName("");
    setType("document");
    setLinkUrl("");
    setFile(null);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Ponle un nombre al entregable.");
    if (isLink && !linkUrl.trim()) return toast.error("Escribe la URL del enlace.");
    if (!isLink && !file) return toast.error("Selecciona un archivo.");

    const form = new FormData();
    form.append("projectId", projectId);
    form.append("name", name);
    form.append("type", type);
    if (isLink) form.append("linkUrl", linkUrl);
    else if (file) form.append("file", file);

    setSaving(true);
    try {
      await api.post("/api/deliverables", form);
      toast.success("Entregable agregado.");
      reset();
      onUploaded();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data
          ?.error ?? "No se pudo subir.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-dashed border-black/20 bg-mist/40 p-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre del entregable"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Video promocional"
        />
        <Select
          label="Tipo"
          value={type}
          onChange={(e) => setType(e.target.value as DeliverableType)}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {DELIVERABLE_TYPE_LABELS[t]}
            </option>
          ))}
        </Select>
      </div>

      {isLink ? (
        <Input
          label="URL"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="https://…"
        />
      ) : (
        <div className="space-y-1">
          <label className="text-sm font-medium">Archivo</label>
          <input
            ref={fileInput}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-honey file:px-4 file:py-2 file:font-semibold file:text-ink hover:file:bg-mustard-dark hover:file:text-white"
          />
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          {saving ? "Subiendo…" : "+ Agregar entregable"}
        </Button>
      </div>
    </form>
  );
}
