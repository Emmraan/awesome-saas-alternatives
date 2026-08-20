import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { cn } from "@/lib/cn";
import { ProductLogo } from "./ProductLogo";
import { PricingBadge } from "./PricingBadge";
import { OpenSourceBadge } from "./OpenSourceBadge";
import { SelfHostedBadge } from "./SelfHostedBadge";

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
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-card-hover dark:hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Replaces {product.replaces.length}
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

        {product.replaces.length > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-primary/10 bg-primary/5 px-2.5 py-2">
            <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-[11px] leading-4 text-muted-foreground">
              Replaces{" "}
              <span className="font-medium text-foreground">{replaced.join(", ")}</span>
              {remaining > 0 && <span> and {remaining} more</span>}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-1.5">
          <PricingBadge pricing={product.pricing} />
          <OpenSourceBadge openSource={product.openSource} />
          <SelfHostedBadge selfHosted={product.selfHosted} />
        </div>

        <div className="mt-auto border-t border-border pt-3">
          <span className="block truncate text-[11px] font-medium text-muted-foreground">
            {categoryNames.join(" · ")}
          </span>
        </div>
      </div>
    </Link>
  );
}