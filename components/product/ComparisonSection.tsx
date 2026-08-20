import type { Feature, Product } from "@/lib/types";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { SectionHeading } from "@/components/home/SectionHeading";

export function ComparisonSection({
  product,
  comparisonProducts,
  features,
}: {
  product: Product;
  comparisonProducts: Product[];
  features: Feature[];
}) {
  if (comparisonProducts.length < 2) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          feature comparison — {comparisonProducts.length} products × {features.length} features
        </span>
      </div>
      <div className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Compare"
          title="Feature comparison"
          description={`How ${product.name} stacks up against the top alternatives across common features.`}
        />

        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
          <ComparisonTable products={comparisonProducts} features={features} />
        </div>
      </div>
    </section>
  );
}