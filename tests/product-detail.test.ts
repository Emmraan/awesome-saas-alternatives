import { describe, expect, it } from "vitest";
import { getCategories, getProducts } from "../lib/data";
import {
  buildBreadcrumbJsonLd,
  buildSoftwareApplicationJsonLd,
  getAlternativeProducts,
  getComparisonProducts,
  getProductCategories,
  getReplacedProducts,
  getWhyChooseFacts,
} from "../lib/product-detail";
import type { Product } from "../lib/types";

const allProducts = getProducts();

function product(slug: string): Product {
  const found = allProducts.find((p) => p.slug === slug);
  if (!found) throw new Error(`missing product: ${slug}`);
  return found;
}

function byName(name: string): Product {
  const found = allProducts.find(
    (p) => p.name.toLowerCase() === name.toLowerCase(),
  );
  if (!found) throw new Error(`missing product named: ${name}`);
  return found;
}

describe("getReplacedProducts", () => {
  it("resolves replaced SaaS names to catalog products case-insensitively", () => {
    const replaced = getReplacedProducts(product("coolify"), allProducts);
    expect(replaced.length).toBeGreaterThan(0);
    expect(replaced.some((p) => p.slug === "vercel")).toBe(true);
    expect(replaced.some((p) => p.slug === "netlify")).toBe(true);
  });

  it("keeps the order of the replaces list and skips unknown names", () => {
    const replaced = getReplacedProducts(product("coolify"), allProducts);
    expect(replaced[0].slug).toBe("vercel");
    expect(replaced[1].slug).toBe("netlify");
  });

  it("returns an empty list for products that replace nothing", () => {
    expect(getReplacedProducts(product("vercel"), allProducts)).toEqual([]);
  });
});

describe("getAlternativeProducts", () => {
  it("finds every alternative that replaces the given product", () => {
    const slugs = getAlternativeProducts(product("zendesk"), allProducts)
      .map((p) => p.slug)
      .sort();
    expect(slugs).toEqual(["freescout", "zammad"]);
  });

  it("handles products with three alternatives", () => {
    const slugs = getAlternativeProducts(byName("OpenAI API"), allProducts)
      .map((p) => p.slug)
      .sort();
    expect(slugs).toEqual(["ollama", "sentence-transformers", "vllm"]);
  });

  it("ranks alternatives by how many SaaS they replace, most first", () => {
    const alternatives = getAlternativeProducts(product("jira"), allProducts);
    const counts = alternatives.map((p) => p.replaces.length);
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
    expect(alternatives.length).toBeGreaterThan(0);
  });

  it("returns an empty list when nothing replaces the product", () => {
    expect(getAlternativeProducts(product("coolify"), allProducts)).toEqual([]);
  });
});

describe("getComparisonProducts", () => {
  it("puts the product first and caps alternatives at the limit", () => {
    const openai = byName("OpenAI API");
    const comparison = getComparisonProducts(openai, allProducts);
    expect(comparison).toHaveLength(4);
    expect(comparison[0].slug).toBe(openai.slug);
    expect(new Set(comparison.map((p) => p.slug)).size).toBe(4);

    const capped = getComparisonProducts(openai, allProducts, 3);
    expect(capped).toHaveLength(3);
  });

  it("returns just the product when there are no alternatives", () => {
    expect(getComparisonProducts(product("coolify"), allProducts)).toEqual([
      product("coolify"),
    ]);
  });
});

describe("getProductCategories", () => {
  it("resolves category slugs to full categories", () => {
    const categories = getCategories();
    const resolved = getProductCategories(product("vercel"), categories);
    expect(resolved.length).toBeGreaterThan(0);
    for (const category of resolved) {
      expect(categories.some((c) => c.slug === category.slug)).toBe(true);
    }
  });

  it("drops category slugs that no longer resolve", () => {
    const fake = { ...product("vercel"), categories: ["does-not-exist"] };
    expect(getProductCategories(fake, getCategories())).toEqual([]);
  });
});

describe("getWhyChooseFacts", () => {
  it("surfaces license, hosting, pricing and setup facts for an open-source self-hosted product", () => {
    const facts = getWhyChooseFacts(product("coolify"));
    const labels = facts.map((fact) => fact.label);
    expect(labels).toEqual(["Open source", "Self-hosted", "Pricing", "Setup"]);
    const openSource = facts.find((fact) => fact.label === "Open source")!;
    expect(openSource.value).toContain("Apache-2.0");
  });

  it("limits facts to pricing and setup for a closed-source, non-self-hosted product", () => {
    expect(getWhyChooseFacts(product("vercel")).map((f) => f.label)).toEqual([
      "Pricing",
      "Setup",
    ]);
  });
});

describe("JSON-LD builders", () => {
  it("builds SoftwareApplication schema with a free offer when pricing is free", () => {
    const ld = buildSoftwareApplicationJsonLd(product("coolify"));
    expect(ld["@type"]).toBe("SoftwareApplication");
    expect(ld.name).toBe("Coolify");
    expect(ld.url).toBe("https://coolify.io");
    expect(ld.applicationCategory).toBe("WebApplication");
    const offers = ld.offers as { price?: string };
    expect(offers.price).toBe("0");
  });

  it("omits the offers block for freemium and paid products", () => {
    expect(
      buildSoftwareApplicationJsonLd(product("vercel")).offers,
    ).toBeUndefined();
    expect(
      buildSoftwareApplicationJsonLd(product("zendesk")).offers,
    ).toBeUndefined();
  });

  it("builds a 3-level BreadcrumbList ending at the product page", () => {
    const ld = buildBreadcrumbJsonLd(product("coolify")) as {
      "@type": string;
      itemListElement: {
        "@type": string;
        position: number;
        name: string;
        item: string;
      }[];
    };
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
    expect(ld.itemListElement[2]).toEqual({
      "@type": "ListItem",
      position: 3,
      name: "Coolify",
      item: "/alternatives/coolify",
    });
  });
});