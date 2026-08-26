import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { formatCompact } from "@/lib/format";
import { PricingBadge } from "./PricingBadge";
import { OpenSourceBadge } from "./OpenSourceBadge";
import { SelfHostedBadge } from "./SelfHostedBadge";

export function ProductCard({
  product,
  categories,
  className,
}: {
  product: Product;
  categories?: Category[];
  className?: string;
}) {
  const isAlt = product.replaces.length > 0;
  const stars = product.github?.stars ?? null;

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
        {stars !== null && (
          <span
            className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-dim"
            title="GitHub stars"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
              <path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9l-5.6 2.9 1.2-6.1L3 9.4l6.3-.8L12 3Z" />
            </svg>
            {formatCompact(stars)}
          </span>
        )}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-1.5">
        <PricingBadge pricing={product.pricing} />
        <OpenSourceBadge openSource={product.openSource} />
        <SelfHostedBadge selfHosted={product.selfHosted} />
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-4">
        <span className="truncate font-mono text-[10.5px] uppercase tracking-wider text-dim">
          {categoryNames.join(" · ") || "—"}
        </span>
        <span
          className={`flex shrink-0 items-center gap-1.5 font-mono text-[11px] font-medium ${
            isAlt ? "text-mint" : "text-dim"
          }`}
        >
          {isAlt ? (
            <>
              replaces {product.replaces.length}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </>
          ) : (
            "no match yet"
          )}
        </span>
      </div>
    </Link>
  );
}
