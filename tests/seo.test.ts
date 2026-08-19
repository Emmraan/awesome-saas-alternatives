import { afterEach, describe, expect, it, vi } from "vitest";
import { getProducts } from "../lib/data";
import { buildBreadcrumbJsonLd } from "../lib/product-detail";
import {
  buildWebSiteJsonLd,
  getAbsoluteUrl,
  getCanonicalUrl,
  getSiteUrl,
  pageMetadata,
} from "../lib/seo";

const SITE_URL = "https://awesome-saas-alternatives.vercel.app";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
  it("reads NEXT_PUBLIC_SITE_URL from the environment", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    expect(getSiteUrl()).toBe(SITE_URL);
  });

  it("strips trailing slashes", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", `${SITE_URL}/`);
    expect(getSiteUrl()).toBe(SITE_URL);
  });

  it("returns an empty string when the variable is not set", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getSiteUrl()).toBe("");
  });
});

describe("getAbsoluteUrl", () => {
  it("joins a path onto the site URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    expect(getAbsoluteUrl("/alternatives/coolify")).toBe(
      `${SITE_URL}/alternatives/coolify`,
    );
  });

  it("normalizes a path without a leading slash", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    expect(getAbsoluteUrl("alternatives")).toBe(`${SITE_URL}/alternatives`);
  });

  it("falls back to a relative path when the site URL is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    expect(getAbsoluteUrl("/alternatives")).toBe("/alternatives");
  });
});

describe("getCanonicalUrl", () => {
  it("returns the absolute canonical for a page", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    expect(getCanonicalUrl("/categories/web-analytics")).toBe(
      `${SITE_URL}/categories/web-analytics`,
    );
  });
});

describe("pageMetadata", () => {
  it("sets the canonical and openGraph url to the absolute page URL", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    const metadata = pageMetadata({
      title: "Contribute a tool",
      description: "Add a product or fix an entry.",
      path: "/contribute",
    });
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/contribute`);
    expect(metadata.openGraph?.title).toBe("Contribute a tool");
    expect(metadata.openGraph?.url).toBe(`${SITE_URL}/contribute`);
    expect(metadata.openGraph?.siteName).toBe("SaaS Alternatives");
  });
});

describe("buildWebSiteJsonLd", () => {
  it("emits an absolute site URL when configured", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    const ld = buildWebSiteJsonLd();
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.url).toBe(`${SITE_URL}/`);
  });
});

describe("product breadcrumb JSON-LD with site URL", () => {
  it("uses absolute item URLs on every level", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", SITE_URL);
    const product = getProducts().find((p) => p.slug === "coolify");
    if (!product) throw new Error("missing product: coolify");

    const ld = buildBreadcrumbJsonLd(product) as {
      itemListElement: { item: string }[];
    };
    expect(ld.itemListElement.map((entry) => entry.item)).toEqual([
      `${SITE_URL}/`,
      `${SITE_URL}/alternatives`,
      `${SITE_URL}/alternatives/coolify`,
    ]);
  });
});