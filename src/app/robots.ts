import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: "https://www.hokubank.com/sitemap.xml",
    host: "https://www.hokubank.com",
  };
}
