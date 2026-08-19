import { describe, expect, it } from "vitest";
import { getCategoryGroups } from "../lib/categories";
import { getProductsByCategory, getTopLevelCategories } from "../lib/data";

describe("getCategoryGroups", () => {
  it("returns one group per top-level category", () => {
    const groups = getCategoryGroups();
    expect(groups.map((g) => g.topLevel.slug)).toEqual(
      getTopLevelCategories().map((c) => c.slug),
    );
  });

  it("groups only top-level categories with non-empty children", () => {
    for (const group of getCategoryGroups()) {
      expect(group.topLevel.parent).toBeNull();
      expect(group.children.length).toBeGreaterThan(0);
    }
  });

  it("counts children as products in that category including descendants", () => {
    for (const group of getCategoryGroups()) {
      for (const child of group.children) {
        expect(child.count).toBe(getProductsByCategory(child.category.slug).length);
      }
    }
  });

  it("never counts a child above its top-level total", () => {
    for (const group of getCategoryGroups()) {
      for (const child of group.children) {
        expect(child.count).toBeLessThanOrEqual(group.totalCount);
      }
    }
  });
});