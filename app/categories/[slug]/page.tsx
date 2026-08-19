import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  getCategory,
  getCategories,
  getCategorySlugs,
  getChildCategories,
  getProductsByCategory,
} from "@/lib/data";
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
} from "@/lib/directory";
import { DirectoryControls } from "@/components/directory/DirectoryControls";
import { DirectoryPagination } from "@/components/directory/DirectoryPagination";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/ui/ProductCard";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};

  return pageMetadata({
    title: `${category.name} — open-source alternatives`,
    description: `Free, open-source and self-hosted ${category.name.toLowerCase()} alternatives from the directory — ${category.description}`,
    path: `/categories/${category.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  const state = parseDirectoryState(await searchParams);
  const basePath = `/categories/${category.slug}`;
  const allProducts = getProductsByCategory(category.slug);
  const categories = getCategories();
  const children = getChildCategories(category.slug);
  const parent = category.parent ? getCategory(category.parent) : undefined;

  const filtered = sortProducts(filterProducts(allProducts, state), state.sort);
  const total = filtered.length;
  const totalPages = getPageCount(total);
  const page = Math.min(state.page, totalPages);
  if (page !== state.page) {
    redirect(buildDirectoryUrl({ ...state, page }, basePath));
  }
  const pageItems = paginate(filtered, page);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const hasStars = allProducts.some((product) => product.github?.stars != null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {category.description}
        </p>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {parent && (
          <Link
            href={`/categories/${parent.slug}`}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-zinc-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
          >
            {parent.name}
          </Link>
        )}
        {children.map((child) => (
          <Link
            key={child.slug}
            href={`/categories/${child.slug}`}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-zinc-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
          >
            {child.name}
          </Link>
        ))}
      </div>

      <DirectoryControls
        state={state}
        groups={getFilterGroups(allProducts, state)}
        activeCount={countActiveFilters(state)}
        totalResults={total}
        showStarsSort={hasStars}
        basePath={basePath}
      >
        {pageItems.length === 0 ? (
          <EmptyState
            title="No products match those filters"
            description="Try removing a filter or two — the full category is one click away."
            action={{
              label: "Clear all filters",
              href: buildDirectoryUrl(
                {
                  ...state,
                  pricing: [],
                  difficulty: [],
                  selfHosted: false,
                  openSource: false,
                  page: 1,
                },
                basePath,
              ),
            }}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((product) => (
                <li key={product.slug} className="flex">
                  <ProductCard
                    product={product}
                    categories={categories}
                    className="h-full w-full"
                  />
                </li>
              ))}
            </ul>

            <div className="flex flex-col items-center gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <p className="text-sm text-muted-foreground" role="status">
                Showing {rangeStart}–{rangeEnd} of {total} products
              </p>
              <DirectoryPagination
                state={state}
                totalPages={totalPages}
                basePath={basePath}
              />
            </div>
          </div>
        )}
      </DirectoryControls>
    </div>
  );
}