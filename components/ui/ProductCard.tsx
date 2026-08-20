import Link from "next/link";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ProductLogo } from "./ProductLogo";
import { PricingBadge } from "./PricingBadge";
import { OpenSourceBadge } from "./OpenSourceBadge";
import { SelfHostedBadge } from "./SelfHostedBadge";

const CARD_CLASSES = cn(
  "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm",
  "transition-[border-color,box-shadow] duration-200",
  "hover:border-zinc-300 hover:shadow-card-hover dark:hover:border-zinc-700",
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
    <Link href={`/alternatives/${product.slug}`} className={cn(CARD_CLASSES, className)}>
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.pricing}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40">
            <ProductLogo name={product.name} size="sm" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
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
          <span className="truncate text-[11px] font-medium text-muted-foreground">
            {categoryNames.join(" · ")}
          </span>
          {product.replaces.length > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              Replaces {product.replaces.length}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}