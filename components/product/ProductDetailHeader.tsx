import Link from "next/link";
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
    <header className="overflow-hidden rounded-lg border border-line bg-pine shadow-card">
      <div className="flex items-center gap-2 border-b border-line bg-moss/60 px-4 py-2.5 font-mono text-[11.5px] text-dim">
        <span aria-hidden="true" className="text-mint">$</span>
        <span>
          cat ~/alternatives/<span className="text-fog">{product.slug}</span>.md
        </span>
        <span className="ml-auto hidden items-center gap-1.5 sm:inline-flex">
          <span className="pulse-dot h-2 w-2 rounded-full bg-mint" aria-hidden="true" />
          active
        </span>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap gap-1.5">
              <PricingBadge pricing={product.pricing} />
              <OpenSourceBadge openSource={product.openSource} />
              <SelfHostedBadge selfHosted={product.selfHosted} />
              <span className="inline-flex items-center whitespace-nowrap rounded-full border border-edge bg-raised px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wide text-fog">
                {difficultyLabel(product.difficulty)} setup
              </span>
              {product.license && (
                <span className="inline-flex items-center whitespace-nowrap rounded-full border border-edge bg-raised px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wide text-fog">
                  {product.license}
                </span>
              )}
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-2.5 text-[15px] leading-relaxed text-fog sm:text-base">
              {product.tagline}
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <ProductLogo name={product.name} size="lg" />
          </div>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-fog">
          {product.description}
        </p>

        <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-1.5">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center whitespace-nowrap rounded-md border border-line bg-raised px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-dim transition-colors hover:border-edge hover:text-mint"
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
            className="group inline-flex h-11 items-center gap-2.5 rounded-md bg-mint px-6 font-mono text-[12.5px] font-semibold uppercase tracking-wider text-void transition-all hover:bg-ink hover:shadow-[0_0_36px_-10px_rgba(99,232,156,0.55)]"
          >
            Visit website
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </Link>
          {product.repo && (
            <Link
              href={`https://github.com/${product.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2.5 rounded-md border border-line bg-transparent px-6 font-mono text-[12.5px] font-semibold uppercase tracking-wider text-fog transition-all hover:border-edge hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
              </svg>
              View on GitHub
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
