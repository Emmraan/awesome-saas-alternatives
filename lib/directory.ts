import type { Difficulty, PricingModel, Product } from "./types";

export const PAGE_SIZE = 24;

export type SortKey = "replaces" | "name-asc" | "name-desc" | "newest" | "stars";

export type FilterGroupId = "pricing" | "difficulty" | "hosting" | "license";

export interface DirectoryState {
  pricing: PricingModel[];
  difficulty: Difficulty[];
  selfHosted: boolean;
  openSource: boolean;
  sort: SortKey;
  page: number;
}

export interface FilterOptionData {
  value: string;
  label: string;
  count: number;
}

export interface FilterGroupData {
  id: FilterGroupId;
  label: string;
  options: FilterOptionData[];
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "replaces", label: "Most replaced" },
  { value: "name-asc", label: "Name A–Z" },
  { value: "name-desc", label: "Name Z–A" },
  { value: "newest", label: "Newest" },
  { value: "stars", label: "GitHub stars" },
];

const PRICING_VALUES: PricingModel[] = ["free", "freemium", "paid"];
const DIFFICULTY_VALUES: Difficulty[] = ["easy", "medium", "hard"];
const SORT_VALUES: SortKey[] = SORT_OPTIONS.map((o) => o.value);

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(params: SearchParams, key: string): string {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value ?? "";
}

function csv(value: string): string[] {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

export function parseDirectoryState(params: SearchParams): DirectoryState {
  const pricing = csv(firstValue(params, "pricing")).filter((v): v is PricingModel =>
    PRICING_VALUES.includes(v as PricingModel),
  );
  const difficulty = csv(firstValue(params, "difficulty")).filter(
    (v): v is Difficulty => DIFFICULTY_VALUES.includes(v as Difficulty),
  );
  const sort = SORT_VALUES.includes(firstValue(params, "sort") as SortKey)
    ? (firstValue(params, "sort") as SortKey)
    : "replaces";
  const requestedPage = Number.parseInt(firstValue(params, "page"), 10);

  return {
    pricing,
    difficulty,
    selfHosted: firstValue(params, "selfhosted") === "true",
    openSource: firstValue(params, "opensource") === "true",
    sort,
    page: Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  };
}

export function buildDirectoryUrl(state: DirectoryState): string {
  const params = new URLSearchParams();
  if (state.pricing.length > 0) params.set("pricing", state.pricing.join(","));
  if (state.difficulty.length > 0)
    params.set("difficulty", state.difficulty.join(","));
  if (state.selfHosted) params.set("selfhosted", "true");
  if (state.openSource) params.set("opensource", "true");
  if (state.sort !== "replaces") params.set("sort", state.sort);
  if (state.page > 1) params.set("page", String(state.page));

  const query = params.toString();
  return query ? `/alternatives?${query}` : "/alternatives";
}

export function filterProducts(
  products: Product[],
  state: DirectoryState,
): Product[] {
  const { pricing, difficulty, selfHosted, openSource } = state;
  return products.filter(
    (product) =>
      (pricing.length === 0 || pricing.includes(product.pricing)) &&
      (difficulty.length === 0 || difficulty.includes(product.difficulty)) &&
      (!selfHosted || product.selfHosted) &&
      (!openSource || product.openSource),
  );
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "newest":
      sorted.sort(
        (a, b) =>
          b.updatedAt.localeCompare(a.updatedAt) || a.name.localeCompare(b.name),
      );
      break;
    case "stars":
      sorted.sort(
        (a, b) =>
          (b.github?.stars ?? -1) - (a.github?.stars ?? -1) ||
          a.name.localeCompare(b.name),
      );
      break;
    default:
      sorted.sort(
        (a, b) =>
          b.replaces.length - a.replaces.length || a.name.localeCompare(b.name),
      );
  }
  return sorted;
}

const GROUP_LABELS: Record<FilterGroupId, string> = {
  pricing: "Pricing",
  difficulty: "Difficulty",
  hosting: "Hosting",
  license: "License",
};

export function getFilterGroups(
  products: Product[],
  state: DirectoryState,
): FilterGroupData[] {
  return [
    {
      id: "pricing",
      label: GROUP_LABELS.pricing,
      options: PRICING_VALUES.map((value) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        count: countOption(products, state, "pricing", (p) => p.pricing === value),
      })),
    },
    {
      id: "difficulty",
      label: GROUP_LABELS.difficulty,
      options: DIFFICULTY_VALUES.map((value) => ({
        value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        count: countOption(products, state, "difficulty", (p) => p.difficulty === value),
      })),
    },
    {
      id: "hosting",
      label: GROUP_LABELS.hosting,
      options: [
        {
          value: "self-hostable",
          label: "Self-hostable",
          count: countOption(products, state, "hosting", (p) => p.selfHosted),
        },
      ],
    },
    {
      id: "license",
      label: GROUP_LABELS.license,
      options: [
        {
          value: "open-source",
          label: "Open source",
          count: countOption(products, state, "license", (p) => p.openSource),
        },
      ],
    },
  ];
}

function countOption(
  products: Product[],
  state: DirectoryState,
  groupId: FilterGroupId,
  matches: (product: Product) => boolean,
): number {
  return products.filter(
    (product) =>
      (groupId === "pricing" ||
        state.pricing.length === 0 ||
        state.pricing.includes(product.pricing)) &&
      (groupId === "difficulty" ||
        state.difficulty.length === 0 ||
        state.difficulty.includes(product.difficulty)) &&
      (groupId === "hosting" || !state.selfHosted || product.selfHosted) &&
      (groupId === "license" || !state.openSource || product.openSource) &&
      matches(product),
  ).length;
}

export function countActiveFilters(state: DirectoryState): number {
  return (
    state.pricing.length +
    state.difficulty.length +
    (state.selfHosted ? 1 : 0) +
    (state.openSource ? 1 : 0)
  );
}

export function toggleValue(
  state: DirectoryState,
  groupId: FilterGroupId,
  value: string,
): DirectoryState {
  switch (groupId) {
    case "pricing":
      return {
        ...state,
        pricing: toggleIn(state.pricing, value as PricingModel),
        page: 1,
      };
    case "difficulty":
      return {
        ...state,
        difficulty: toggleIn(state.difficulty, value as Difficulty),
        page: 1,
      };
    case "hosting":
      return { ...state, selfHosted: !state.selfHosted, page: 1 };
    case "license":
      return { ...state, openSource: !state.openSource, page: 1 };
  }
}

function toggleIn<T>(values: T[], value: T): T[] {
  return values.includes(value)
    ? values.filter((v) => v !== value)
    : [...values, value];
}

export function getPageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE;
  return items.slice(start, start + PAGE_SIZE);
}