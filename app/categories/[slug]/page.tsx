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
import { Reveal } from "@/components/motion/Reveal";
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
    <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "categories", href: "/categories" },
          { label: category.slug },
        ]}
      />

      <header className="mt-5 max-w-2xl">
        <Reveal>
          <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-mint">
            Category
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            {category.name}
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-fog">
            {category.description}
          </p>
        </Reveal>
        <Reveal delay={80} className="mt-6 flex items-center gap-2 rounded-lg border border-line bg-moss/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-dim">
          <span className="text-mint">$</span> cat categories/{category.slug} — {total} tools · {allProducts.length} in scope
        </Reveal>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {parent && (
          <Link
            href={`/categories/${parent.slug}`}
            className="inline-flex items-center gap-1 rounded-md border border-line bg-raised px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim transition-colors hover:border-edge hover:text-mint"
          >
            ← {parent.name}
          </Link>
        )}
        {children.map((child) => (
          <Link
            key={child.slug}
            href={`/categories/${child.slug}`}
            className="inline-flex items-center gap-1 rounded-md border border-line bg-raised px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim transition-colors hover:border-edge hover:text-mint"
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
          <Reveal>
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
          </Reveal>
        ) : (
          <div className="flex flex-col gap-6">
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pageItems.map((product, index) => (
                <Reveal key={product.slug} as="li" delay={(index % 6) * 50} className="flex">
                  <ProductCard
                    product={product}
                    categories={categories}
                    className="h-full w-full"
                  />
                </Reveal>
              ))}
            </ul>

            <Reveal delay={120} className="flex flex-col items-center gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
              <p className="font-mono text-[12px] text-dim" role="status">
                Showing {rangeStart}–{rangeEnd} of {total} products
              </p>
              <DirectoryPagination
                state={state}
                totalPages={totalPages}
                basePath={basePath}
              />
            </Reveal>
          </div>
        )}
      </DirectoryControls>
    </div>
  );
}