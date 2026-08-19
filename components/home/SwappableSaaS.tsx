import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SaaSPair } from "./home-data";
import { ProductLogo } from "@/components/ui/ProductLogo";
import { PricingBadge } from "@/components/ui/PricingBadge";
import { SectionHeading } from "./SectionHeading";

export function SwappableSaaS({ pairs }: { pairs: SaaSPair[] }) {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="Swap your stack"
          title="Popular SaaS, and what replaces them"
          description="The paid tools developers ask about most, matched with open alternatives from the directory."
        />

        <ul className="mt-10 divide-y divide-border rounded-lg border border-border bg-card">
          {pairs.map(({ saas, alternatives }) => (
            <li
              key={saas.slug}
              className="grid gap-4 p-4 sm:grid-cols-[minmax(0,220px)_1fr] sm:gap-6 sm:p-5"
            >
              <div className="flex items-start gap-3">
                <ProductLogo name={saas.name} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {saas.name}
                  </p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <PricingBadge pricing={saas.pricing} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/alternatives/${alt.slug}`}
                    className="group inline-flex items-center gap-2 rounded-md border border-border bg-background py-1.5 pl-1.5 pr-3 text-sm transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
                  >
                    <ProductLogo name={alt.name} size="sm" />
                    <span className="font-medium text-foreground">
                      {alt.name}
                    </span>
                    <PricingBadge pricing={alt.pricing} />
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <Link
            href="/alternatives"
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
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