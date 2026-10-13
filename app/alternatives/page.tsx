import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCategories, getProducts } from "@/lib/data";
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
import { DirectorySearch } from "@/components/directory/DirectorySearch";
import { Reveal } from "@/components/motion/Reveal";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/ui/ProductCard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Alternatives directory",
  description:
    "Browse the full catalog of open-source, free and self-hosted alternatives to popular SaaS — filter by pricing, hosting, license and difficulty.",
  path: "/alternatives",
});

export default async function AlternativesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const state = parseDirectoryState(await searchParams);
  const allProducts = getProducts();
  const categories = getCategories();

  const filtered = sortProducts(filterProducts(allProducts, state), state.sort);
  const total = filtered.length;
  const totalPages = getPageCount(total);
  const page = Math.min(state.page, totalPages);
  if (page !== state.page) {
    redirect(buildDirectoryUrl({ ...state, page }));
  }
  const pageItems = paginate(filtered, page);

  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);
  const hasStars = allProducts.some((product) => product.github?.stars != null);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "alternatives", href: "/" },
          { label: "index" },
        ]}
      />

      <header className="mt-5">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-mint">
                The full catalog
              </p>
              <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
                {state.kind === "alternatives"
                  ? "Open alternatives"
                  : state.kind === "saas"
                    ? "Paid SaaS"
                    : "Every tool, mapped"}
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fog">
                <span className="font-mono text-[13px] text-mint">{total}</span> of {allProducts.length} products
                {state.q && (
                  <>
                    {" "}
                    matching <span className="text-ink">“{state.q}”</span>
                  </>
                )}
                . Filter by what you refuse to keep paying for.
              </p>
            </div>
            <DirectorySearch state={state} />
          </div>
        </Reveal>
      </header>

      <DirectoryControls
        state={state}
        groups={getFilterGroups(allProducts, state)}
        activeCount={countActiveFilters(state)}
        totalResults={total}
        showStarsSort={hasStars}
      >
        {pageItems.length === 0 ? (
          <Reveal>
            <EmptyState
              title="No products match those filters"
              description="Try removing a filter or two — the full catalog is one click away."
              action={{ label: "Clear all filters", href: buildDirectoryUrl({ ...state, pricing: [], difficulty: [], selfHosted: false, openSource: false, page: 1 }) }}
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
              <DirectoryPagination state={state} totalPages={totalPages} />
            </Reveal>
          </div>
        )}
      </DirectoryControls>
    </div>
  );
}