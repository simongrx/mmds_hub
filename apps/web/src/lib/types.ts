// Tipos compartidos alineados al schema Prisma (apps/api/prisma/schema.prisma).

export type ProjectStatus = "pending" | "in_development" | "delivered";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  icon?: string | null;
  order: number;
}

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  logoUrl?: string | null;
  notes?: string | null;
  createdAt: string;
  _count?: { projects: number };
  projects?: Project[];
}

export type DeliverableType = "video" | "link" | "document" | "image" | "other";
export type DocumentCategory = "guide" | "contract" | "specs";

export interface Deliverable {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  type: DeliverableType;
  fileUrl?: string | null;
  fileSize?: number | null;
  downloadCount: number;
  createdAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  title: string;
  content?: string | null;
  category: DocumentCategory;
  order: number;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  client?: Client;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  startDate?: string | null;
  endDate?: string | null;
  deliveryDate?: string | null;
  accessToken: string;
  tokenExpiresAt?: string | null;
  lastAccessedAt?: string | null;
  services?: Service[];
  deliverables?: Deliverable[];
  documents?: ProjectDocument[];
  createdAt: string;
}

export const DELIVERABLE_TYPE_LABELS: Record<DeliverableType, string> = {
  video: "🎬 Video",
  link: "🔗 Enlace",
  document: "📄 Documento",
  image: "🖼️ Imagen",
  other: "📦 Otro",
};

export const DOCUMENT_CATEGORY_LABELS: Record<DocumentCategory, string> = {
  guide: "Guía",
  contract: "Contrato",
  specs: "Especificaciones",
};

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pending: "Pendiente",
  in_development: "En desarrollo",
  delivered: "Entregado",
};
