import {
  categorySchema,
  featureSchema,
  productSchema,
} from "./schemas";
import type { Category, Feature, Product } from "./types";
import categoriesData from "../data/categories.json";
import featuresData from "../data/features.json";
import productsData from "../data/products.json";

const categories: Category[] = categoriesData.map((c) =>
  categorySchema.parse(c),
);
const features: Feature[] = featuresData.map((f) => featureSchema.parse(f));
const products: Product[] = productsData.map((p) => productSchema.parse(p));

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getTopLevelCategories(): Category[] {
  return categories.filter((c) => c.parent === null);
}

export function getChildCategories(slug: string): Category[] {
  return categories.filter((c) => c.parent === slug);
}

export function getCategorySlugs(): string[] {
  return categories.map((c) => c.slug);
}

export function getFeatures(): Feature[] {
  return features;
}

export function getFeature(id: string): Feature | undefined {
  return features.find((f) => f.id === id);
}

export function getFeatureGroups(): string[] {
  return [...new Set(features.map((f) => f.group))];
}

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getProductsByCategory(slug: string): Product[] {
  const descendants = getDescendantCategorySlugs(slug);
  const slugs = new Set([slug, ...descendants]);
  return products.filter((p) => p.categories.some((c) => slugs.has(c)));
}

export function getProductsByAlternative(name: string): Product[] {
  const needle = name.toLowerCase();
  return products.filter((p) =>
    p.replaces.some((r) => r.toLowerCase() === needle),
  );
}

export function searchProducts(query: string): Product[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return products;
  return products.filter((p) => {
    const haystack = [
      p.name,
      p.tagline,
      p.description,
      ...p.categories,
      ...p.replaces,
      ...p.tags,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

function getDescendantCategorySlugs(slug: string): string[] {
  const children = categories.filter((c) => c.parent === slug);
  return children.flatMap((c) => [c.slug, ...getDescendantCategorySlugs(c.slug)]);
}