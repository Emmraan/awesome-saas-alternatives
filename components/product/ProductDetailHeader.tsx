import Link from "next/link";
import { ArrowUpRight, Code } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { GitHubStats } from "@/components/ui/GitHubStats";
import { OpenSourceBadge } from "@/components/ui/OpenSourceBadge";
import { PricingBadge } from "@/components/ui/PricingBadge";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { SelfHostedBadge } from "@/components/ui/SelfHostedBadge";

const difficultyLabel = (value: Product["difficulty"]): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export function ProductDetailHeader({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  return (
    <header className="rounded-lg border border-border bg-card p-5 sm:p-8">
      <div className="flex items-start gap-4 sm:gap-5">
        <ProductLogo name={product.name} size="lg" />
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>
          <p className="mt-1 text-sm leading-6 text-muted-foreground sm:text-base">
            {product.tagline}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-1.5">
        <PricingBadge pricing={product.pricing} />
        <OpenSourceBadge openSource={product.openSource} />
        <SelfHostedBadge selfHosted={product.selfHosted} />
        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium leading-4 text-muted-foreground">
          {difficultyLabel(product.difficulty)}
        </span>
        {product.license && (
          <span className="inline-flex items-center whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium leading-4 text-muted-foreground">
            {product.license}
          </span>
        )}
      </div>

      <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
        {product.description}
      </p>

      <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
        <ul className="flex flex-wrap gap-1.5">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex items-center whitespace-nowrap rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <GitHubStats github={product.github} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5 border-t border-border pt-5">
<Link
          href={product.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Visit website
          <ArrowUpRight
            className="h-4 w-4"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </Link>
        {product.repo && (
          <Link
            href={`https://github.com/${product.repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
          >
            <Code className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            View on GitHub
          </Link>
        )}
      </div>
    </header>
  );
}