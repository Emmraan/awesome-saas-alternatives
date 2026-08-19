import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/data";
import { getSiteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  if (!siteUrl) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL is not set — add it to .env.local to generate sitemap.xml",
    );
  }

  const staticPages: MetadataRoute.Sitemap = [
    "/",
    "/alternatives",
    "/categories",
    "/search",
    "/contribute",
  ].map((path) => ({ url: `${siteUrl}${path}` }));

  const categoryPages: MetadataRoute.Sitemap = getCategories().map(
    (category) => ({
      url: `${siteUrl}/categories/${category.slug}`,
    }),
  );

  const productPages: MetadataRoute.Sitemap = getProducts().map((product) => ({
    url: `${siteUrl}/alternatives/${product.slug}`,
    lastModified: product.updatedAt,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}