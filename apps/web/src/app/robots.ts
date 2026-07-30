import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // El panel admin y el portal cliente no deben indexarse.
      disallow: ["/dashboard", "/proyecto", "/login"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
