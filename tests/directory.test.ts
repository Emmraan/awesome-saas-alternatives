import { describe, expect, it } from "vitest";
import { getProducts } from "../lib/data";
import {
  PAGE_SIZE,
  buildDirectoryUrl,
  countActiveFilters,
  filterProducts,
  getFilterGroups,
  getPageCount,
  paginate,
  parseDirectoryState,
  sortProducts,
  toggleValue,
  type DirectoryState,
} from "../lib/directory";

const DEFAULT_STATE: DirectoryState = {
  pricing: [],
  difficulty: [],
  selfHosted: false,
  openSource: false,
  sort: "replaces",
  page: 1,
};

describe("parseDirectoryState", () => {
  it("defaults to an unfiltered, first-page state for empty params", () => {
    expect(parseDirectoryState({})).toEqual(DEFAULT_STATE);
  });

  it("parses pricing, difficulty, booleans, sort and page", () => {
    expect(
      parseDirectoryState({
        pricing: "free,paid",
        difficulty: "easy",
        selfhosted: "true",
        opensource: "true",
        sort: "name-asc",
        page: "3",
      }),
    ).toEqual({
      pricing: ["free", "paid"],
      difficulty: ["easy"],
      selfHosted: true,
      openSource: true,
      sort: "name-asc",
      page: 3,
    });
  });

  it("accepts an array param and reads its first value", () => {
    expect(parseDirectoryState({ pricing: ["free"] }).pricing).toEqual(["free"]);
  });

  it("ignores unknown values and falls back to defaults", () => {
    const parsed = parseDirectoryState({
      pricing: "bogus",
      sort: "wat",
      page: "abc",
      difficulty: "hard,easy",
    });
    expect(parsed.pricing).toEqual([]);
    expect(parsed.sort).toBe("replaces");
    expect(parsed.page).toBe(1);
    expect(parsed.difficulty).toEqual(["hard", "easy"]);
  });

  it("clamps a negative page to 1", () => {
    expect(parseDirectoryState({ page: "-2" }).page).toBe(1);
  });
});

describe("buildDirectoryUrl", () => {
  it("returns the bare path when nothing is set", () => {
    expect(buildDirectoryUrl({ ...DEFAULT_STATE, page: 1 })).toBe("/alternatives");
  });

  it("round-trips through parseDirectoryState", () => {
    const state: DirectoryState = {
      pricing: ["free", "freemium"],
      difficulty: ["easy"],
      selfHosted: true,
      openSource: false,
      sort: "newest",
      page: 2,
    };
    const url = buildDirectoryUrl(state);
    expect(url).toBe("/alternatives?pricing=free%2Cfreemium&difficulty=easy&selfhosted=true&sort=newest&page=2");
    const params = Object.fromEntries(new URLSearchParams(url.split("?")[1]));
    expect(parseDirectoryState(params)).toEqual(state);
  });
});

describe("filterProducts", () => {
  const products = getProducts();

  it("returns everything when no filters are active", () => {
    expect(filterProducts(products, DEFAULT_STATE)).toEqual(products);
  });

  it("filters by pricing, hosting and license together", () => {
    const state: DirectoryState = {
      ...DEFAULT_STATE,
      pricing: ["free"],
      selfHosted: true,
      openSource: true,
    };
    const result = filterProducts(products, state);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(products.length);
    for (const product of result) {
      expect(product.pricing).toBe("free");
      expect(product.selfHosted).toBe(true);
      expect(product.openSource).toBe(true);
    }
  });

  it("ORs values within a group", () => {
    const result = filterProducts(products, {
      ...DEFAULT_STATE,
      pricing: ["free", "paid"],
    });
    for (const product of result) {
      expect(["free", "paid"]).toContain(product.pricing);
    }
  });
});

describe("sortProducts", () => {
  const products = getProducts();

  it("sorts by name in both directions", () => {
    const ascending = sortProducts(products, "name-asc").map((p) => p.name);
    expect(ascending).toEqual([...ascending].sort((a, b) => a.localeCompare(b)));
    const descending = sortProducts(products, "name-desc").map((p) => p.name);
    expect(descending).toEqual([...descending].sort((a, b) => b.localeCompare(a)));
  });

  it("sorts by number of replaced SaaS, most first", () => {
    const counts = sortProducts(products, "replaces").map(
      (p) => p.replaces.length,
    );
    expect(counts).toEqual([...counts].sort((a, b) => b - a));
  });

  it("sorts by newest updatedAt first", () => {
    const dates = sortProducts(products, "newest").map((p) => p.updatedAt);
    expect(dates).toEqual([...dates].sort((a, b) => b.localeCompare(a)));
  });

  it("sorts by stars when present, else keeps name order", () => {
    const byStars = sortProducts(products, "stars").map((p) => p.slug);
    const hasStars = products.some((p) => p.github?.stars != null);
    if (hasStars) {
      expect(byStars.length).toBe(products.length);
    } else {
      expect(byStars).toEqual(
        sortProducts(products, "name-asc").map((p) => p.slug),
      );
    }
  });
});

describe("getFilterGroups", () => {
  const products = getProducts();

  it("reports accurate counts with no active filters", () => {
    const groups = getFilterGroups(products, DEFAULT_STATE);
    const pricing = groups.find((g) => g.id === "pricing")!;
    expect(pricing.options.reduce((sum, o) => sum + o.count, 0)).toBe(
      products.length,
    );
    const hosting = groups.find((g) => g.id === "hosting")!;
    expect(hosting.options[0].count).toBe(
      products.filter((p) => p.selfHosted).length,
    );
    const license = groups.find((g) => g.id === "license")!;
    expect(license.options[0].count).toBe(
      products.filter((p) => p.openSource).length,
    );
  });

  it("counts against the other active filters, not the group's own", () => {
    const state = { ...DEFAULT_STATE, selfHosted: true };
    const groups = getFilterGroups(products, state);
    const pricing = groups.find((g) => g.id === "pricing")!;
    const free = pricing.options.find((o) => o.value === "free")!;
    expect(free.count).toBe(
      products.filter((p) => p.selfHosted && p.pricing === "free").length,
    );
  });
});

describe("toggleValue", () => {
  it("adds and removes a value and resets the page", () => {
    const added = toggleValue(
      { ...DEFAULT_STATE, page: 4 },
      "pricing",
      "free",
    );
    expect(added.pricing).toEqual(["free"]);
    expect(added.page).toBe(1);
    const removed = toggleValue(added, "pricing", "free");
    expect(removed.pricing).toEqual([]);
  });

  it("flips boolean groups", () => {
    expect(toggleValue(DEFAULT_STATE, "hosting", "self-hostable").selfHosted).toBe(
      true,
    );
    expect(toggleValue(DEFAULT_STATE, "license", "open-source").openSource).toBe(
      true,
    );
  });
});

describe("countActiveFilters / pagination", () => {
  it("counts only active constraints", () => {
    expect(countActiveFilters(DEFAULT_STATE)).toBe(0);
    expect(
      countActiveFilters({
        ...DEFAULT_STATE,
        pricing: ["free", "paid"],
        selfHosted: true,
      }),
    ).toBe(3);
  });

  it("computes page counts and slices pages", () => {
    expect(getPageCount(0)).toBe(1);
    expect(getPageCount(PAGE_SIZE)).toBe(1);
    expect(getPageCount(PAGE_SIZE + 1)).toBe(2);

    const items = Array.from({ length: 50 }, (_, i) => i);
    expect(paginate(items, 1)).toEqual(items.slice(0, PAGE_SIZE));
    expect(paginate(items, 3)).toEqual(items.slice(2 * PAGE_SIZE));
  });
});