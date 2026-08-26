import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductLogo } from "@/components/ui/ProductLogo";

export function ReplacesSection({
  product,
  replacedProducts,
}: {
  product: Product;
  replacedProducts: Product[];
}) {
  if (replacedProducts.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-pine shadow-card">
      <div className="flex items-center gap-2 border-b border-line bg-moss/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
        <span aria-hidden="true" className="text-coral">×</span>
        replaces — {replacedProducts.length} tools
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
          What <span className="text-coral">{product.name}</span> replaces
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-fog">
          The paid tools this product can stand in for — each linked to its own
          page.
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {replacedProducts.map((replaced) => (
            <li key={replaced.slug}>
              <Link
                href={`/alternatives/${replaced.slug}`}
                className="group inline-flex items-center gap-2.5 rounded-md border border-line bg-void/60 py-1.5 pl-1.5 pr-3 transition-colors hover:border-coral/40 hover:bg-coraltint/40"
              >
                <ProductLogo name={replaced.name} size="sm" />
                <span className="text-sm font-medium tracking-tight text-fog transition-colors group-hover:text-ink">
                  {replaced.name}
                </span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-dim transition-transform group-hover:translate-x-0.5 group-hover:text-coral">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
