import type { Feature, Product } from "@/lib/types";
import { ComparisonTable } from "@/components/ui/ComparisonTable";

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
    <section className="overflow-hidden rounded-lg border border-line bg-pine shadow-card">
      <div className="flex items-center gap-2 border-b border-line bg-moss/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
        <span aria-hidden="true" className="text-sky">≡</span>
        feature comparison — {comparisonProducts.length} products ×{" "}
        {features.length} features
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
          Side by side
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-fog">
          How {product.name} stacks up against the top alternatives across
          common features.
        </p>

        <div className="mt-6 overflow-x-auto rounded-lg border border-line bg-void">
          <ComparisonTable products={comparisonProducts} features={features} />
        </div>
      </div>
    </section>
  );
}
