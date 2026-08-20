import type { Product } from "@/lib/types";
import type { ProductFact } from "@/lib/product-detail";
import { SectionHeading } from "@/components/home/SectionHeading";

export function WhyChooseSection({
  product,
  facts,
}: {
  product: Product;
  facts: ProductFact[];
}) {
  if (facts.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/60" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">why choose — {facts.length} signals</span>
      </div>
      <div className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Why choose"
          title={`Why people pick ${product.name}`}
          description="The deciding facts at a glance — pricing, licensing, hosting and setup effort."
        />

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <li key={fact.label} className="rounded-xl border border-border bg-muted/20 p-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">{fact.label}</p>
              <p className="mt-2 text-sm leading-6 text-foreground">{fact.value}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}