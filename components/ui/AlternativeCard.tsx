import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { PricingBadge } from "./PricingBadge";

export function AlternativeCard({
  product,
  categories,
  maxReplaces = 3,
  className,
}: {
  product: Product;
  categories?: Category[];
  maxReplaces?: number;
  className?: string;
}) {
  const replaced = product.replaces.slice(0, maxReplaces);
  const remaining = product.replaces.length - replaced.length;

  const categoryNames = categories
    ? product.categories
        .map((slug) => categories.find((c) => c.slug === slug)?.name)
        .filter((name): name is string => Boolean(name))
        .slice(0, 2)
    : product.categories.slice(0, 2);

  return (
    <Link
      href={`/alternatives/${product.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-lg border border-line bg-pine p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-edge hover:bg-moss hover:shadow-card-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-5 h-8 w-[3px] origin-top scale-y-0 rounded-r bg-mint transition-transform duration-300 group-hover:scale-y-100"
      />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-display text-[1.18rem] font-semibold leading-tight tracking-tight text-ink transition-colors group-hover:text-mint">
            {product.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-[13.5px] leading-snug text-fog">
            {product.tagline}
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-mint/35 bg-minttint px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wide text-mint">
          Replaces {product.replaces.length}
        </span>
      </div>

      {product.replaces.length > 0 && (
        <div className="mt-3.5 flex items-start gap-2 rounded-md border border-mint/20 bg-minttint/60 px-2.5 py-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0 text-mint">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
          <p className="font-mono text-[11px] leading-4 text-fog">
            Replaces{" "}
            <span className="font-medium text-ink">{replaced.join(", ")}</span>
            {remaining > 0 && <span> and {remaining} more</span>}
          </p>
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <span className="truncate font-mono text-[10.5px] uppercase tracking-wider text-dim">
          {categoryNames.join(" · ") || "—"}
        </span>
        <PricingBadge pricing={product.pricing} />
      </div>
    </Link>
  );
}
