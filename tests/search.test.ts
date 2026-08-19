import { describe, expect, it } from "vitest";
import { getCategories, getProducts } from "../lib/data";
import {
  buildSearchIndex,
  scoreEntry,
  searchProducts,
  tokenize,
} from "../lib/search";

describe("tokenize", () => {
  it("lowercases and splits on non-alphanumeric characters", () => {
    expect(tokenize("Vercel")).toEqual(["vercel"]);
    expect(tokenize("self hosted analytics")).toEqual([
      "self",
      "hosted",
      "analytics",
    ]);
    expect(tokenize("GitHub-Stars")).toEqual(["github", "stars"]);
  });

  it("drops stopwords and single-character tokens", () => {
    expect(tokenize("zapier alternative")).toEqual(["zapier"]);
    expect(tokenize("the best of free tools")).toEqual(["best", "free", "tools"]);
    expect(tokenize("  a  the  ")).toEqual([]);
  });
});

describe("searchProducts", () => {
  it("returns an empty list for empty or stopword-only queries", () => {
    const products = getProducts();
    const categories = getCategories();
    expect(searchProducts("", products, categories)).toEqual([]);
    expect(searchProducts("alternatives", products, categories)).toEqual([]);
    expect(searchProducts("a the", products, categories)).toEqual([]);
  });

  it("returns an empty list when no products are indexed", () => {
    expect(searchProducts("vercel", [], getCategories())).toEqual([]);
  });

  it('ranks "vercel" with the alternatives first, the SaaS itself second', () => {
    const results = searchProducts("vercel", getProducts(), getCategories());
    expect(results.map((p) => p.name).slice(0, 2)).toEqual(["Coolify", "Vercel"]);
  });

  it('returns only self-hosted analytics for "self hosted analytics"', () => {
    const results = searchProducts(
      "self hosted analytics",
      getProducts(),
      getCategories(),
    );
    expect(results.map((p) => p.name)).toEqual([
      "Matomo",
      "OpenReplay",
      "RudderStack",
    ]);
  });

  it('ranks "zapier alternative" with n8n first', () => {
    const results = searchProducts(
      "zapier alternative",
      getProducts(),
      getCategories(),
    );
    expect(results.map((p) => p.name).slice(0, 2)).toEqual(["n8n", "Zapier"]);
  });

  it("matches by category name and tag", () => {
    const byCategory = searchProducts("analytics", getProducts(), getCategories());
    expect(byCategory.length).toBeGreaterThan(5);
    expect(byCategory.map((p) => p.name)).toContain("Matomo");

    const byTag = searchProducts("self-hosted", getProducts(), getCategories());
    expect(byTag.length).toBeGreaterThan(5);
    for (const product of byTag) {
      const haystack = [
        product.name,
        product.tagline,
        product.description,
        product.categories,
        product.replaces.join(" "),
        product.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();
      expect(haystack).toContain("self");
      expect(haystack).toContain("hosted");
    }
  });
});

describe("scoreEntry", () => {
  it("requires every token to match at least one field", () => {
    const [entry] = buildSearchIndex(getProducts(), getCategories());
    expect(scoreEntry(entry, ["token-that-matches-nothing"])).toBeNull();
  });

  it("returns a positive score when every token matches", () => {
    const products = getProducts();
    const entry = buildSearchIndex(products, getCategories()).find(
      (e) => e.product.name === "Matomo",
    )!;
    const score = scoreEntry(entry, ["self", "hosted", "analytics"]);
    expect(score).not.toBeNull();
    expect(score).toBeGreaterThan(0);
  });
});