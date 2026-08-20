import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import {
  AlternativeCard,
  Breadcrumbs,
  CategoryCard,
  ComparisonTable,
  EmptyState,
  FilterPanel,
  GitHubStats,
  OpenSourceBadge,
  Pagination,
  PricingBadge,
  ProductCard,
  ProductLogo,
  SearchBar,
  SelfHostedBadge,
  getPageItems,
} from "../components/ui";
import { getCategories, getFeatures, getProducts } from "../lib/data";
import type { Category, Product } from "../lib/types";

vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({
      href,
      children,
      ...rest
    }: {
      href: string;
      children?: React.ReactNode;
    }) => React.createElement("a", { href, ...rest }, children),
  };
});

function product(slug: string): Product {
  const found = getProducts().find((p) => p.slug === slug);
  if (!found) throw new Error(`missing product: ${slug}`);
  return found;
}

function category(slug: string): Category {
  const found = getCategories().find((c) => c.slug === slug);
  if (!found) throw new Error(`missing category: ${slug}`);
  return found;
}

describe("badges and logo", () => {
  it("renders the pricing label for each pricing model", () => {
    expect(renderToString(<PricingBadge pricing="free" />)).toContain("Free");
    expect(renderToString(<PricingBadge pricing="freemium" />)).toContain(
      "Freemium",
    );
    expect(renderToString(<PricingBadge pricing="paid" />)).toContain("Paid");
  });

  it("renders open-source and self-hosted badges only when true", () => {
    expect(renderToString(<OpenSourceBadge openSource />)).toContain(
      "Open source",
    );
    expect(renderToString(<OpenSourceBadge openSource={false} />)).toBe("");
    expect(renderToString(<SelfHostedBadge selfHosted />)).toContain(
      "Self-hosted",
    );
    expect(renderToString(<SelfHostedBadge selfHosted={false} />)).toBe("");
  });

  it("renders the first letter of a product name as its logo", () => {
    const html = renderToString(<ProductLogo name="Coolify" />);
    expect(html).toContain("C");
    expect(html).toContain("uppercase");
  });
});

describe("cards", () => {
  it("renders a product card with name, tagline and category names", () => {
    const html = renderToString(
      <ProductCard product={product("coolify")} categories={getCategories()} />,
    );
    expect(html).toContain("Coolify");
    expect(html).toContain("alternatives/coolify");
    expect(html).toContain("Replaces");
  });

  it("renders an alternative card with the replaced SaaS list", () => {
    const html = renderToString(
      <AlternativeCard
        product={product("coolify")}
        categories={getCategories()}
      />,
    );
    expect(html).toContain("Coolify");
    expect(html).toContain("Replaces");
    expect(html).toContain("Vercel");
  });

  it("caps the replaced list at maxReplaces and shows the remainder", () => {
    const html = renderToString(
      <AlternativeCard product={product("coolify")} maxReplaces={1} />,
    );
    const text = html.replace(/<!-- -->/g, "");
    expect(text).toContain("and 8 more");
  });

  it("renders a category card with an optional product count", () => {
    const html = renderToString(
      <CategoryCard category={category("cloud-hosting")} productCount={7} />,
    );
    expect(html).toContain("Cloud Hosting");
    expect(html).toContain("categories/cloud-hosting");
    expect(html).toContain(">7</span>");
  });
});

describe("GitHubStats", () => {
  it("renders nothing when there is no GitHub metadata", () => {
    expect(renderToString(<GitHubStats github={null} />)).toBe("");
  });

  it("renders compact star and fork counts", () => {
    const html = renderToString(
      <GitHubStats
        github={{
          stars: 2500,
          forks: 400,
          license: "Apache-2.0",
          release: null,
          fetchedAt: null,
        }}
      />,
    );
    expect(html).toContain("2.5k");
    expect(html).toContain("400");
  });
});

describe("SearchBar", () => {
  it("renders with the placeholder and default value", () => {
    const html = renderToString(
      <SearchBar
        defaultValue="vercel"
        onSubmit={() => {}}
        placeholder="Search tools…"
      />,
    );
    expect(html).toContain("Search tools…");
    expect(html).toContain('value="vercel"');
  });

  it("omits the clear button when the input is empty", () => {
    const html = renderToString(
      <SearchBar onSubmit={() => {}} defaultValue="" />,
    );
    expect(html).not.toContain("Clear search");
  });
});

describe("Pagination", () => {
  it("renders nothing when there is a single page", () => {
    expect(
      renderToString(
        <Pagination page={1} totalPages={1} onPageChange={() => {}} />,
      ),
    ).toBe("");
  });

  it("renders page buttons and marks the current page", () => {
    const html = renderToString(
      <Pagination page={2} totalPages={3} onPageChange={() => {}} />,
    );
    expect(html).toContain("Page 2");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Previous page");
    expect(html).toContain("Next page");
  });

  it("builds the page item sequence with ellipses for large ranges", () => {
    expect(getPageItems(1, 3)).toEqual([1, 2, 3]);
    expect(getPageItems(5, 20)).toEqual([1, "…", 4, 5, 6, "…", 20]);
    expect(getPageItems(1, 1)).toEqual([1]);
  });
});

describe("FilterPanel", () => {
  it("renders groups with checked options and counts", () => {
    const html = renderToString(
      <FilterPanel
        groups={[
          {
            id: "pricing",
            label: "Pricing",
            options: [
              { value: "free", label: "Free", count: 42 },
              { value: "paid", label: "Paid", count: 10 },
            ],
          },
        ]}
        selected={{ pricing: ["free"] }}
        onToggle={() => {}}
      />,
    );
    expect(html).toContain("Pricing");
    expect(html).toContain("Free");
    expect(html).toContain(">42</span>");
    expect(html).toContain('checked=""');
  });
});

describe("ComparisonTable", () => {
  it("renders feature groups, rows and product columns", () => {
    const html = renderToString(
      <ComparisonTable
        products={[product("coolify"), product("vercel")]}
        features={getFeatures()}
      />,
    );
    expect(html).toContain("Coolify");
    expect(html).toContain("Vercel");
    expect(html).toContain(getFeatures()[0].group);
    expect(html).toContain(getFeatures()[0].name);
    expect(html).toContain("Feature comparison of");
  });
});

describe("Breadcrumbs", () => {
  it("renders linked items except the last, which is the current page", () => {
    const html = renderToString(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Alternatives", href: "/alternatives" },
          { label: "Coolify" },
        ]}
      />,
    );
    expect(html).toContain('href="/alternatives"');
    expect(html).toContain("Coolify");
    expect(html).toContain('aria-current="page"');
  });
});

describe("EmptyState", () => {
  it("renders title, description and an optional action link", () => {
    const html = renderToString(
      <EmptyState
        title="No results"
        description="Try a different search."
        action={{ label: "Clear filters", href: "/alternatives" }}
      />,
    );
    expect(html).toContain("No results");
    expect(html).toContain("Try a different search.");
    expect(html).toContain('href="/alternatives"');
    expect(html).toContain("Clear filters");
  });
});