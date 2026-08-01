import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/landingContent";
import { getServices } from "@/lib/serverApi";
import { SITE_URL } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getServices();

  // `/blog` sólo entra cuando hay entradas. Sin ellas la página existe (para no
  // dar 404 a quien llegue de fuera) pero no se anuncia: meter en el sitemap una
  // página que dice "todavía no hemos publicado nada" es pedirle a Google que
  // indexe un hueco.
  const paths = ["", "/contacto", "/casos-de-exito", "/preguntas-frecuentes"];
  if (POSTS.length > 0) paths.push("/blog");

  const staticRoutes = paths.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const serviceRoutes = services.map((s) => ({
    url: `${SITE_URL}/servicios/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
