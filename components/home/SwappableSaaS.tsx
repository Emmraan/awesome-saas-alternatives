import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SaaSPair } from "./home-data";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { PricingBadge } from "@/components/ui/PricingBadge";
import { SectionHeading } from "./SectionHeading";

export function SwappableSaaS({ pairs }: { pairs: SaaSPair[] }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Swap your stack"
          title="Popular SaaS, and what replaces them"
          description="The paid tools developers ask about most, matched with open alternatives from the directory."
        />

        <ul className="mt-10 grid gap-4">
          {pairs.map(({ saas, alternatives }) => (
            <li
              key={saas.slug}
              className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-card dark:hover:border-zinc-700 sm:flex-row sm:items-center sm:justify-between sm:p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40">
                  <ProductLogo name={saas.name} size="sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight text-foreground">
                    {saas.name}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <PricingBadge pricing={saas.pricing} />
                    <span className="hidden text-xs text-muted-foreground sm:inline">→ open alternatives</span>
                  </div>
                </div>
                <ArrowRight className="ml-2 hidden h-3.5 w-3.5 text-muted-foreground sm:block" strokeWidth={1.75} aria-hidden="true" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/alternatives/${alt.slug}`}
                    className="group/alt inline-flex items-center gap-2 rounded-full border border-border bg-background py-1 pl-1 pr-3 text-sm transition-colors hover:border-primary/20 hover:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <ProductLogo name={alt.name} size="sm" />
                    <span className="text-sm font-medium tracking-tight text-foreground">
                      {alt.name}
                    </span>
                    <span className="hidden sm:inline-flex">
                      <PricingBadge pricing={alt.pricing} />
                    </span>
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            href="/alternatives"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
          >
            Browse all alternatives
            <ArrowRight
              className="h-4 w-4 text-muted-foreground"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}