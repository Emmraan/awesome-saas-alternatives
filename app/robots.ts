import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const robots: MetadataRoute.Robots = {
    rules: { userAgent: "*", allow: "/" },
  };
  if (siteUrl) {
    robots.sitemap = `${siteUrl}/sitemap.xml`;
  }
  return robots;
}