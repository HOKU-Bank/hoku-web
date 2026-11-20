import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// All crawlers may index the whole public site; /api/ only holds form endpoints.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
