import type { Category, Product } from "@/lib/types";
import { AlternativeCard } from "@/components/ui/AlternativeCard";
import { SectionHeading } from "@/components/home/SectionHeading";

export function AlternativesSection({
  product,
  alternatives,
  categories,
}: {
  product: Product;
  alternatives: Product[];
  categories: Category[];
}) {
  if (alternatives.length === 0) return null;

  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Alternatives"
          title={`Best alternatives to ${product.name}`}
          description="Open, self-hosted and lower-cost options in the directory — ranked by how much each one replaces."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alternative) => (
            <AlternativeCard
              key={alternative.slug}
              product={alternative}
              categories={categories}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}