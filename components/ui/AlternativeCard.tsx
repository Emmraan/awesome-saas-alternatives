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
        "group flex flex-col gap-3 rounded-lg border border-border bg-card p-4",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        "dark:hover:border-zinc-700 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
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

      {product.replaces.length > 0 && (
        <div className="flex items-start gap-2 rounded-md bg-muted px-2.5 py-2">
          <ArrowRight
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <p className="text-[11px] leading-4 text-muted-foreground">
            Replaces{" "}
            <span className="font-medium text-foreground">
              {replaced.join(", ")}
            </span>
            {remaining > 0 && (
              <span> and {remaining} more</span>
            )}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-1.5">
        <PricingBadge pricing={product.pricing} />
        <OpenSourceBadge openSource={product.openSource} />
        <SelfHostedBadge selfHosted={product.selfHosted} />
      </div>

      <div className="mt-auto border-t border-border pt-3">
        <span className="block truncate text-[11px] text-muted-foreground">
          {categoryNames.join(" · ")}
        </span>
      </div>
    </Link>
  );
}