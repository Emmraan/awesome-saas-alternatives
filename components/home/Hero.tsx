import Link from "next/link";
import { HeroSearch } from "./HeroSearch";

export interface HeroStats {
  products: number;
  alternatives: number;
  categories: number;
}

export function Hero({
  stats,
  popularQueries,
}: {
  stats: HeroStats;
  popularQueries: string[];
}) {
  return (
    <section className="ambient-radial border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-24">
        <div className="max-w-3xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
            Open-source · free · self-hosted
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            Open-source &amp; free alternatives to the SaaS you already use
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            A curated directory of {stats.products}+ tools that replace the
            Vercels, Zapiens and Notions of your stack — free, open-source and
            self-hosted by default.
          </p>

          <div className="mt-8 max-w-xl">
            <HeroSearch />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-xs text-muted-foreground">Popular:</span>
            {popularQueries.map((query) => (
              <Link
                key={query}
                href={`/search?q=${encodeURIComponent(query)}`}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-zinc-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
              >
                {query}
              </Link>
            ))}
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Products
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {stats.products}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Alternatives
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {stats.alternatives}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Categories
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
                {stats.categories}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}