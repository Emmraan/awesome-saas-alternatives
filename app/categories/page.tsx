import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryGroups } from "@/lib/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Browse categories",
  description:
    "Explore every category in the directory — hosting, analytics, email, AI, project management and more — each with free, open-source and self-hosted alternatives.",
  path: "/categories",
});

export default function CategoriesPage() {
  const groups = getCategoryGroups();

  return (
    <div className="mx-auto w-full max-w-7xl px-5 py-14 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "categories" },
        ]}
      />

      <header className="mt-5 max-w-2xl">
        <Reveal>
          <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-mint">
            The whole map
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Browse by category
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-fog">
            Every corner of the catalog, grouped by what you need. Each category
            collects the tools and their free, open-source and self-hosted
            alternatives.
          </p>
        </Reveal>
      </header>

      <div className="mt-12 flex flex-col gap-14">
        {groups.map(({ topLevel, totalCount, children }, index) => (
          <Reveal key={topLevel.slug} delay={index * 40} as="section" aria-labelledby={`category-${topLevel.slug}`}>
            <div className="flex items-baseline justify-between gap-3 border-b border-line pb-3">
              <h2
                id={`category-${topLevel.slug}`}
                className="flex items-baseline gap-4 font-display text-xl font-bold tracking-tight text-ink"
              >
                <span aria-hidden="true" className="font-mono text-[13px] font-medium text-dim">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <Link
                  href={`/categories/${topLevel.slug}`}
                  className="transition-colors hover:text-mint"
                >
                  {topLevel.name}
                </Link>
              </h2>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-dim">
                {totalCount} product{totalCount === 1 ? "" : "s"}
              </span>
            </div>

            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {children.map(({ category, count }, childIndex) => (
                <Reveal key={category.slug} as="li" delay={(childIndex % 3) * 70} className="flex">
                  <CategoryCard
                    category={category}
                    productCount={count}
                    className="h-full w-full"
                  />
                </Reveal>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </div>
  );
}