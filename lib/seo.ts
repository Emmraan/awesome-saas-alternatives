import type { Metadata } from "next";

export const SITE_NAME = "SaaS Alternatives";
export const SITE_TAGLINE =
  "Find open-source & free alternatives to the SaaS you already use.";
export const SITE_DESCRIPTION =
  "Find 180+ open-source, free and self-hosted alternatives to popular SaaS like Vercel, Zapier and Notion.";
export const GITHUB_REPO_URL =
  "https://github.com/Emmraan/awesome-saas-alternatives";
export const GITHUB_DATA_FILE_URL = `${GITHUB_REPO_URL}/blob/main/data/products.json`;

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/+$/, "");
}

export function getAbsoluteUrl(path: string): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (!base) return normalized;
  return new URL(normalized, base).toString();
}

export function getCanonicalUrl(path: string): string {
  return getAbsoluteUrl(path);
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: getCanonicalUrl(path) },
    openGraph: {
      title,
      description,
      url: getCanonicalUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      type,
    },
  };
}

export function buildWebSiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_TAGLINE,
    url: getAbsoluteUrl("/"),
  };
}