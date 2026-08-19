import type { Category, Product } from "./types";

const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "in",
  "is",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
  "your",
  "alternative",
  "alternatives",
]);

const WEIGHTS = {
  replaces: 40,
  nameExact: 35,
  nameStartsWith: 28,
  nameIncludes: 22,
  category: 16,
  tag: 12,
  tagline: 10,
  description: 8,
} as const;

interface SearchEntry {
  product: Product;
  name: string;
  tagline: string;
  description: string;
  categories: string;
  replaces: string;
  tags: string;
}

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOPWORDS.has(token));
}

export function buildSearchIndex(
  products: Product[],
  categories: Category[],
): SearchEntry[] {
  const categoryNames = new Map(categories.map((c) => [c.slug, c.name]));
  return products.map((product) => ({
    product,
    name: product.name.toLowerCase(),
    tagline: product.tagline.toLowerCase(),
    description: product.description.toLowerCase(),
    categories: product.categories
      .map((slug) => categoryNames.get(slug))
      .filter((name): name is string => Boolean(name))
      .join(" ")
      .toLowerCase(),
    replaces: product.replaces.join(" ").toLowerCase(),
    tags: product.tags.join(" ").toLowerCase(),
  }));
}

export function scoreEntry(entry: SearchEntry, tokens: string[]): number | null {
  let total = 0;

  for (const token of tokens) {
    let best = 0;
    best = Math.max(best, entry.replaces.includes(token) ? WEIGHTS.replaces : 0);

    if (entry.name === token) best = Math.max(best, WEIGHTS.nameExact);
    else if (entry.name.startsWith(token))
      best = Math.max(best, WEIGHTS.nameStartsWith);
    else if (entry.name.includes(token))
      best = Math.max(best, WEIGHTS.nameIncludes);

    best = Math.max(best, entry.categories.includes(token) ? WEIGHTS.category : 0);
    best = Math.max(best, entry.tags.includes(token) ? WEIGHTS.tag : 0);
    best = Math.max(best, entry.tagline.includes(token) ? WEIGHTS.tagline : 0);
    best = Math.max(
      best,
      entry.description.includes(token) ? WEIGHTS.description : 0,
    );

    if (best === 0) return null;
    total += best;
  }

  return total;
}

export function searchProducts(
  query: string,
  products: Product[],
  categories: Category[],
): Product[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const entries = buildSearchIndex(products, categories);

  return entries
    .map((entry) => ({ entry, score: scoreEntry(entry, tokens) }))
    .filter((result): result is { entry: SearchEntry; score: number } =>
      result.score !== null,
    )
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.entry.product.replaces.length - a.entry.product.replaces.length ||
        a.entry.product.name.localeCompare(b.entry.product.name),
    )
    .map((result) => result.entry.product);
}
