import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryGroups } from "@/lib/categories";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/ui/CategoryCard";

export const metadata: Metadata = {
  title: "Browse categories",
  description:
    "Explore every category in the directory — hosting, analytics, email, AI, project management and more — each with free, open-source and self-hosted alternatives.",
};

export default function CategoriesPage() {
  const groups = getCategoryGroups();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Browse by category
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Every corner of the catalog, grouped by what you need. Each category
          collects the tools and their free, open-source and self-hosted
          alternatives.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-12">
        {groups.map(({ topLevel, totalCount, children }) => (
          <section key={topLevel.slug} aria-labelledby={`category-${topLevel.slug}`}>
            <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
              <h2
                id={`category-${topLevel.slug}`}
                className="text-lg font-semibold tracking-tight text-foreground"
              >
                <Link
                  href={`/categories/${topLevel.slug}`}
                  className="rounded-sm transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {topLevel.name}
                </Link>
              </h2>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {totalCount} product{totalCount === 1 ? "" : "s"}
              </span>
            </div>

            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {children.map(({ category, count }) => (
                <li key={category.slug} className="flex">
                  <CategoryCard
                    category={category}
                    productCount={count}
                    className="h-full w-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}