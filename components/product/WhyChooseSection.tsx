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
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Why choose"
          title={`Why people pick ${product.name}`}
          description="The deciding facts at a glance — pricing, licensing, hosting and setup effort."
        />

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facts.map((fact) => (
            <li
              key={fact.label}
              className="rounded-lg border border-border bg-card p-4"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary">
                {fact.label}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {fact.value}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}