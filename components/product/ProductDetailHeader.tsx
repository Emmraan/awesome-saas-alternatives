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
    <header className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          {product.slug} — {product.openSource ? "open source" : "proprietary"}
          {product.selfHosted ? " • self-hosted" : ""}
        </span>
        <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
          <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Active
        </span>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30 shadow-sm">
            <ProductLogo name={product.name} size="lg" />
          </div>
          <div className="min-w-0 flex-1">
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
          <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {difficultyLabel(product.difficulty)}
          </span>
          {product.license && (
            <span className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {product.license}
            </span>
          )}
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center whitespace-nowrap rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-zinc-300 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
          <GitHubStats github={product.github} />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={product.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Visit website
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
          {product.repo && (
            <Link
              href={`https://github.com/${product.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Code className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              View on GitHub
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}