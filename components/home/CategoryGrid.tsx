import type { Category } from "@/lib/types";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeading } from "./SectionHeading";

export function CategoryGrid({
  categories,
}: {
  categories: { category: Category; count: number }[];
}) {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Browse by category"
          title="Find alternatives by what you need"
          description="Hosting, analytics, email, AI, project management and more — every category with a free or open option."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map(({ category, count }, idx) => {
            const span =
              idx === 0
                ? "lg:col-span-7"
                : idx === 1
                  ? "lg:col-span-5"
                  : idx === 2 || idx === 3
                    ? "lg:col-span-6"
                    : "lg:col-span-3";
            return (
              <div key={category.slug} className={span}>
                <CategoryCard
                  category={category}
                  productCount={count}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}