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
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Compare"
          title="Feature comparison"
          description={`How ${product.name} stacks up against the top alternatives across common features.`}
        />

        <div className="mt-8 rounded-lg border border-border bg-card p-3 sm:p-4">
          <ComparisonTable
            products={comparisonProducts}
            features={features}
          />
        </div>
      </div>
    </section>
  );
}