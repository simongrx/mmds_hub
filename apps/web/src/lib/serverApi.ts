import { API_URL } from "./api";
import { BACKEND_ENABLED } from "./features";
import { FALLBACK_PORTFOLIO, FALLBACK_SERVICES } from "./landingFallback";
import type { Service } from "./types";

// Item del portfolio público (shape reducido del backend).
export interface PortfolioItem {
  id: string;
  name: string;
  description?: string | null;
  deliveryDate?: string | null;
  /** Sitio publicado del caso. Si viene, la tarjeta enlaza ahí. */
  url?: string | null;
  services: { name: string; icon?: string | null; slug: string }[];
  client?: { name: string; company?: string | null } | null;
}

// Fetch server-side para datos públicos de la landing (SEO-friendly).
//
// Si la API no responde se cae al contenido empaquetado en landingFallback.ts
// en lugar de devolver listas vacías: la home es la cara pública y sin esos
// datos las secciones 01 y 02 desaparecen. Se avisa por consola del servidor
// porque, si no, el degradado es invisible — la web se ve entera y nadie se
// entera de que la API lleva días caída.
async function getJson<T>(path: string, fallback: T): Promise<T> {
  // Sin API declarada no se intenta la petición siquiera. Antes se pedía igual
  // y se esperaba a que la conexión fuera rechazada, en cada render de cada
  // página: latencia regalada y un log lleno de avisos alarmantes que en
  // realidad describían el funcionamiento normal.
  if (!BACKEND_ENABLED) return fallback;

  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) {
      console.warn(`[landing] ${path} respondió ${res.status}; se usa el contenido de reserva.`);
      return fallback;
    }
    return (await res.json()) as T;
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[landing] ${API_URL}${path} no responde (${reason}); se usa el contenido de reserva.`);
    return fallback;
  }
}

// Nota sobre las listas vacías: el fallback sólo entra cuando la petición falla.
// Si la API responde con cero servicios (alguien los borró desde el panel) se
// respeta esa respuesta y se muestra el estado vacío, que es lo correcto: los
// datos vivos mandan siempre sobre la copia.

export async function getServices(): Promise<Service[]> {
  const data = await getJson<{ services: Service[] }>("/api/public/servicios", {
    services: FALLBACK_SERVICES,
  });
  return data.services;
}

export async function getPortfolio(): Promise<PortfolioItem[]> {
  const data = await getJson<{ projects: PortfolioItem[] }>("/api/public/portfolio", {
    projects: FALLBACK_PORTFOLIO,
  });
  return data.projects;
}
