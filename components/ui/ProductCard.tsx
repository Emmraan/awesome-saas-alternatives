import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ProductLogo } from "./ProductLogo";
import { PricingBadge } from "./PricingBadge";
import { OpenSourceBadge } from "./OpenSourceBadge";
import { SelfHostedBadge } from "./SelfHostedBadge";

const CARD_CLASSES = cn(
  "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4",
  "transition-[border-color,box-shadow,transform] duration-200",
  "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
  "dark:hover:border-zinc-700 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);

export function ProductCard({
  product,
  categories,
  className,
}: {
  product: Product;
  categories?: Category[];
  className?: string;
}) {
  const categoryNames = categories
    ? product.categories
        .map((slug) => categories.find((c) => c.slug === slug)?.name)
        .filter((name): name is string => Boolean(name))
        .slice(0, 2)
    : product.categories.slice(0, 2);

  return (
    <Link
      href={`/alternatives/${product.slug}`}
      className={cn(CARD_CLASSES, className)}
    >
      <div className="flex items-start gap-3">
        <ProductLogo name={product.name} size="md" />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
            {product.tagline}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <PricingBadge pricing={product.pricing} />
        <OpenSourceBadge openSource={product.openSource} />
        <SelfHostedBadge selfHosted={product.selfHosted} />
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
        <span className="truncate text-[11px] text-muted-foreground">
          {categoryNames.join(" · ")}
        </span>
        {product.replaces.length > 0 && (
          <span className="shrink-0 text-[11px] text-muted-foreground">
            Replaces {product.replaces.length}
          </span>
        )}
      </div>
    </Link>
  );
}