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
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeading
          eyebrow="Replaces"
          title={`What ${product.name} replaces`}
          description="The paid tools this product can stand in for — each linked to its own page."
        />

        <ul className="mt-8 flex flex-wrap gap-2">
          {replacedProducts.map((replaced) => (
            <li key={replaced.slug}>
              <Link
                href={`/alternatives/${replaced.slug}`}
                className="group inline-flex items-center gap-2.5 rounded-md border border-border bg-card py-1.5 pl-1.5 pr-3 text-sm transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
              >
                <ProductLogo name={replaced.name} size="sm" />
                <span className="font-medium text-foreground">
                  {replaced.name}
                </span>
                <ArrowRight
                  className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}