import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { SectionHeading } from "@/components/home/SectionHeading";

export function ReplacesSection({
  product,
  replacedProducts,
}: {
  product: Product;
  replacedProducts: Product[];
}) {
  if (replacedProducts.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/60" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">replaces — {replacedProducts.length} tools</span>
      </div>
      <div className="p-6 sm:p-8">
        <SectionHeading
          eyebrow="Replaces"
          title={`What ${product.name} replaces`}
          description="The paid tools this product can stand in for — each linked to its own page."
        />

        <ul className="mt-6 flex flex-wrap gap-2">
          {replacedProducts.map((replaced) => (
            <li key={replaced.slug}>
              <Link
                href={`/alternatives/${replaced.slug}`}
                className="group inline-flex items-center gap-2.5 rounded-full border border-border bg-background py-1.5 pl-1.5 pr-3 text-sm shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <ProductLogo name={replaced.name} size="sm" />
                <span className="text-sm font-medium tracking-tight text-foreground">{replaced.name}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}