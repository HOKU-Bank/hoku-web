import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.hokubank.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://www.hokubank.com/privacy", changeFrequency: "yearly", priority: 0.3 },
  ];
}
