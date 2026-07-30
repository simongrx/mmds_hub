import { API_URL } from "./api";
import type { Service } from "./types";

// Item del portfolio público (shape reducido del backend).
export interface PortfolioItem {
  id: string;
  name: string;
  description?: string | null;
  deliveryDate?: string | null;
  services: { name: string; icon?: string | null; slug: string }[];
  client?: { name: string; company?: string | null } | null;
}

// Fetch server-side para datos públicos de la landing (SEO-friendly).
// Devuelve fallback vacío si la API no responde (evita romper el build).
async function getJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getServices(): Promise<Service[]> {
  const data = await getJson<{ services: Service[] }>("/api/public/servicios", { services: [] });
  return data.services;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const data = await getJson<{ projects: PortfolioItem[] }>("/api/public/portfolio", { projects: [] });
  return data.projects;
}
