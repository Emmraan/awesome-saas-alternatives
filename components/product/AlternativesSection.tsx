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
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">alternatives — {alternatives.length} tools</span>
        <span className="ml-auto hidden text-xs text-muted-foreground sm:block">Ranked by replacements</span>
      </div>
      <div className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Alternatives"
          title={`Best alternatives to ${product.name}`}
          description="Open, self-hosted and lower-cost options in the directory — ranked by how much each one replaces."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alternative) => (
            <AlternativeCard key={alternative.slug} product={alternative} categories={categories} className="h-full" />
          ))}
        </div>
      </div>
    </section>
  );
}