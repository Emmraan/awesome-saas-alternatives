import { describe, expect, it } from "vitest";
import {
  getCategories,
  getCategory,
  getTopLevelCategories,
  getChildCategories,
  getCategorySlugs,
  getFeatures,
  getFeature,
  getFeatureGroups,
  getProducts,
  getProduct,
  getProductSlugs,
  getProductsByCategory,
  getProductsByAlternative,
  searchProducts,
} from "../lib/data";

describe("category loaders", () => {
  it("loads a non-empty category list with unique slugs", () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    const slugs = categories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("builds a hierarchy where every parent resolves", () => {
    const categories = getCategories();
    const slugs = new Set(categories.map((c) => c.slug));
    for (const c of categories) {
      if (c.parent !== null) {
        expect(slugs.has(c.parent)).toBe(true);
      }
    }
  });

  it("has top-level categories with children", () => {
    const topLevel = getTopLevelCategories();
    expect(topLevel.length).toBeGreaterThan(0);
    for (const c of topLevel) {
      expect(c.parent).toBeNull();
    }
    const withChildren = topLevel.filter((c) => getChildCategories(c.slug).length > 0);
    expect(withChildren.length).toBeGreaterThan(0);
  });

  it("getCategory returns a category by slug and undefined otherwise", () => {
    const categories = getCategories();
    const first = categories[0];
    expect(getCategory(first.slug)?.slug).toBe(first.slug);
    expect(getCategory("does-not-exist")).toBeUndefined();
  });

  it("getCategorySlugs mirrors the category list", () => {
    expect(getCategorySlugs()).toEqual(getCategories().map((c) => c.slug));
  });
});

describe("feature loaders", () => {
  it("loads a non-empty feature list with unique ids", () => {
    const features = getFeatures();
    expect(features.length).toBeGreaterThan(0);
    const ids = features.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("groups features into named groups", () => {
    const groups = getFeatureGroups();
    expect(groups.length).toBeGreaterThan(0);
    for (const f of getFeatures()) {
      expect(groups).toContain(f.group);
    }
  });

  it("getFeature returns a feature by id and undefined otherwise", () => {
    const first = getFeatures()[0];
    expect(getFeature(first.id)?.id).toBe(first.id);
    expect(getFeature("does-not-exist")).toBeUndefined();
  });
});

describe("product loaders", () => {
  it("loads a non-empty product list with unique slugs", () => {
    const products = getProducts();
    expect(products.length).toBeGreaterThan(0);
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getProduct and getProductSlugs mirror the product list", () => {
    const products = getProducts();
    expect(getProductSlugs()).toEqual(products.map((p) => p.slug));
    const first = products[0];
    expect(getProduct(first.slug)?.slug).toBe(first.slug);
    expect(getProduct("does-not-exist")).toBeUndefined();
  });

  it("getProductsByCategory returns products incl. descendant categories", () => {
    const hosting = getProductsByCategory("cloud-hosting");
    expect(hosting.length).toBeGreaterThan(0);
    const analytics = getProductsByCategory("analytics");
    expect(analytics.length).toBeGreaterThan(0);
    expect(getProductsByCategory("does-not-exist")).toEqual([]);
  });

  it("getProductsByAlternative resolves free alternatives for a paid SaaS", () => {
    const forVercel = getProductsByAlternative("vercel");
    expect(forVercel.length).toBeGreaterThan(0);
    expect(forVercel.some((p) => p.slug === "coolify")).toBe(true);
    const forZapier = getProductsByAlternative("zapier");
    expect(forZapier.some((p) => p.slug === "n8n")).toBe(true);
    const forZendesk = getProductsByAlternative("zendesk");
    expect(forZendesk.map((p) => p.slug).sort()).toEqual(["freescout", "zammad"]);
  });

  it("searchProducts matches name, replaces and tags case-insensitively", () => {
    expect(searchProducts("vercel").length).toBeGreaterThan(0);
    expect(searchProducts("sentry").length).toBeGreaterThan(0);
    expect(searchProducts("")).toEqual(getProducts());
    expect(searchProducts("nothing-matches-xyz")).toEqual([]);
  });
});
