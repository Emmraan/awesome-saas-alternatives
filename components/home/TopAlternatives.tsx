import type { Category, Product } from "@/lib/types";
import { AlternativeCard } from "@/components/ui/AlternativeCard";
import { SectionHeading } from "./SectionHeading";

export function TopAlternatives({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  return (
    <section className="border-b border-border bg-card/30">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Top alternatives"
          title="Most-swapped tools"
          description="Ranked by how many paid SaaS each one replaces — the biggest wins come first."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <AlternativeCard
              key={product.slug}
              product={product}
              categories={categories}
            />
          ))}
        </div>
      </div>
    </section>
  );
}