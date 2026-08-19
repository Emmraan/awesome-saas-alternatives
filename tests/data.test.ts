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
  it("loads products as an empty placeholder array for P2", () => {
    const products = getProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBe(0);
  });

  it("getProduct and getProductSlugs handle the empty set safely", () => {
    expect(getProductSlugs()).toEqual([]);
    expect(getProduct("anything")).toBeUndefined();
  });

  it("category/alternative/search helpers return empty arrays", () => {
    expect(getProductsByCategory("analytics")).toEqual([]);
    expect(getProductsByAlternative("zapier")).toEqual([]);
    expect(searchProducts("vercel")).toEqual([]);
    expect(searchProducts("")).toEqual([]);
  });
});
