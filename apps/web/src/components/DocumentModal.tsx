"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { api } from "@/lib/api";
import type { DocumentCategory, ProjectDocument } from "@/lib/types";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/types";

const CATEGORIES = Object.keys(DOCUMENT_CATEGORY_LABELS) as DocumentCategory[];

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  projectId: string;
  document: ProjectDocument | null; // null = crear
}

export default function DocumentModal({
  open,
  onClose,
  onSaved,
  projectId,
  document,
}: Props) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("guide");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (document) {
      setTitle(document.title);
      setCategory(document.category);
      setContent(document.content ?? "");
    } else {
      setTitle("");
      setCategory("guide");
      setContent("");
    }
  }, [open, document]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("El título es obligatorio.");

    const payload = { projectId, title, category, content };
    setSaving(true);
    try {
      if (document) {
        await api.put(`/api/documents/${document.id}`, payload);
        toast.success("Documento actualizado.");
      } else {
        await api.post("/api/documents", payload);
        toast.success("Documento creado.");
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
    <Modal
      open={open}
      onClose={onClose}
      title={document ? "Editar documento" : "Nuevo documento"}
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input label="Título *" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Select
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value as DocumentCategory)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {DOCUMENT_CATEGORY_LABELS[c]}
            </option>
          ))}
        </Select>
        <Textarea
          label="Contenido (Markdown)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
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
