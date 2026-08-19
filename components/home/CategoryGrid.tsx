import type { Category } from "@/lib/types";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { SectionHeading } from "./SectionHeading";

export function CategoryGrid({
  categories,
}: {
  categories: { category: Category; count: number }[];
}) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Browse by category"
          title="Find alternatives by what you need"
          description="Hosting, analytics, email, AI, project management and more — every category with a free or open option."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map(({ category, count }) => (
            <CategoryCard
              key={category.slug}
              category={category}
              productCount={count}
            />
          ))}
        </div>
      </div>
    </section>
  );
}