import type { Category, Product } from "./types";
import { getAbsoluteUrl } from "./seo";

export interface ProductFact {
  label: string;
  value: string;
}

const byReplacesThenName = (a: Product, b: Product): number =>
  b.replaces.length - a.replaces.length || a.name.localeCompare(b.name);

export function getReplacedProducts(
  product: Product,
  allProducts: Product[],
): Product[] {
  return product.replaces
    .map(
      (name) =>
        allProducts.find(
          (p) => p.name.toLowerCase() === name.toLowerCase(),
        ),
    )
    .filter((p): p is Product => Boolean(p));
}

export function getAlternativeProducts(
  product: Product,
  allProducts: Product[],
): Product[] {
  return allProducts
    .filter((p) =>
      p.replaces.some((r) => r.toLowerCase() === product.name.toLowerCase()),
    )
    .sort(byReplacesThenName);
}

export function getComparisonProducts(
  product: Product,
  allProducts: Product[],
  limit = 4,
): Product[] {
  const alternatives = getAlternativeProducts(product, allProducts).slice(
    0,
    Math.max(0, limit - 1),
  );
  return [product, ...alternatives];
}

export function getProductCategories(
  product: Product,
  categories: Category[],
): Category[] {
  return product.categories
    .map((slug) => categories.find((c) => c.slug === slug))
    .filter((c): c is Category => Boolean(c));
}

export function getWhyChooseFacts(product: Product): ProductFact[] {
  const facts: ProductFact[] = [];

  if (product.openSource) {
    facts.push({
      label: "Open source",
      value: product.license
        ? `${product.license} license — source on GitHub, auditable and forkable.`
        : "Source on GitHub — auditable and forkable.",
    });
  }

  if (product.selfHosted) {
    facts.push({
      label: "Self-hosted",
      value: "Deploy on your own hardware or VPS — no vendor lock-in.",
    });
  }

  const pricing: Record<Product["pricing"], string> = {
    free: "Free to use — no credit card or paywall.",
    freemium: "Free tier to start, paid upgrades when you scale.",
    paid: "Commercial product with a paid plan.",
  };
  facts.push({ label: "Pricing", value: pricing[product.pricing] });

  const difficulty: Record<Product["difficulty"], string> = {
    easy: "Quick to get started — minutes, not days.",
    medium: "Moderate setup — comfortably a weekend project.",
    hard: "Expect a real setup with some moving parts.",
  };
  facts.push({ label: "Setup", value: difficulty[product.difficulty] });

  return facts;
}

export function buildSoftwareApplicationJsonLd(
  product: Product,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.tagline,
    url: product.website,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    offers:
      product.pricing === "free"
        ? {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
          }
        : undefined,
  };
}

export function buildBreadcrumbJsonLd(
  product: Product,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: getAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alternatives",
        item: getAbsoluteUrl("/alternatives"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: getAbsoluteUrl(`/alternatives/${product.slug}`),
      },
    ],
  };
}