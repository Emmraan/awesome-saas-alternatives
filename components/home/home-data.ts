import type { Product } from "@/lib/types";

export interface SaaSPair {
  saas: Product;
  alternatives: Product[];
}

export function getPopularSaaSPairs(
  products: Product[],
  limit: number,
): SaaSPair[] {
  const byName = new Map(products.map((p) => [p.name.toLowerCase(), p]));
  const counts = new Map<string, number>();

  for (const product of products) {
    for (const replaced of product.replaces) {
      const key = replaced.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .filter(([name]) => byName.has(name))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => ({
      saas: byName.get(name)!,
      alternatives: products.filter((p) =>
        p.replaces.some((r) => r.toLowerCase() === name),
      ),
    }))
    .filter(({ alternatives }) => alternatives.length > 0);
}

export function getTopAlternatives(products: Product[], limit: number): Product[] {
  return products
    .filter((p) => p.replaces.length > 0)
    .sort(
      (a, b) =>
        b.replaces.length - a.replaces.length || a.name.localeCompare(b.name),
    )
    .slice(0, limit);
}