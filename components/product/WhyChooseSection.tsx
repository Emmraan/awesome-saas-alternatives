import type { Product } from "@/lib/types";
import type { ProductFact } from "@/lib/product-detail";

export function WhyChooseSection({
  product,
  facts,
}: {
  product: Product;
  facts: ProductFact[];
}) {
  if (facts.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-pine shadow-card">
      <div className="flex items-center gap-2 border-b border-line bg-moss/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
        <span aria-hidden="true" className="text-mint">✓</span>
        the facts — {facts.length} signals
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
          Why people pick{" "}
          <span className="text-mint">{product.name}</span>
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-fog">
          The deciding facts at a glance — pricing, licensing, hosting and
          setup effort.
        </p>

        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <li key={fact.label} className="rounded-lg border border-line bg-raised/50 p-4">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mint">
                {fact.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-fog">{fact.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
