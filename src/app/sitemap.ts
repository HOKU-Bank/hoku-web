import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Every public page. lastModified is the build time, so it moves with each deploy.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
