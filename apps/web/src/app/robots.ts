import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

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
