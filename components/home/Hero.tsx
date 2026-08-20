import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden border-b border-border">
      <div aria-hidden="true" className="ambient-grid absolute inset-0 opacity-[0.55]" />
      <div aria-hidden="true" className="ambient-radial absolute inset-0" />
      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs backdrop-blur">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" aria-hidden="true" />
                <span className="font-medium text-foreground">{stats.products} tools</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{stats.categories} categories</span>
              </span>
              <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
              <span className="hidden items-center gap-1 text-muted-foreground sm:inline-flex">
                <Sparkles className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                Open source
              </span>
            </div>

            <h1 className="mt-5 text-[32px] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[44px] lg:text-[52px]">
              Open-source &amp; free alternatives to the SaaS{" "}
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                you already use
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-[17px] sm:leading-8">
              A curated directory of {stats.products}+ tools that replace the
              Vercels, Zapiens and Notions of your stack — free, open-source
              and self-hosted by default. Data lives in GitHub, not a paywall.
            </p>

            <div className="mt-7 max-w-xl">
              <HeroSearch />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground">Popular:</span>
              {popularQueries.map((query) => (
                <Link
                  key={query}
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur transition-colors hover:border-zinc-300 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
                >
                  {query}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/alternatives"
                className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-[background,transform] hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Browse alternatives
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
              <a
                href="https://github.com/Emmraan/awesome-saas-alternatives"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
                </svg>
                View on GitHub
              </a>
            </div>

            <dl className="mt-8 grid max-w-lg grid-cols-3 gap-4 border-t border-border/70 pt-6">
              <div className="rounded-lg bg-card/50 p-3 backdrop-blur">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Products
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                  {stats.products}
                </dd>
              </div>
              <div className="rounded-lg bg-card/50 p-3 backdrop-blur">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Alternatives
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                  {stats.alternatives}
                </dd>
              </div>
              <div className="rounded-lg bg-card/50 p-3 backdrop-blur">
                <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Categories
                </dt>
                <dd className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                  {stats.categories}
                </dd>
              </div>
            </dl>
          </div>

          {/* right preview — terminal / code motif */}
          <div className="hidden lg:block">
            <div className="relative rounded-xl border border-border bg-card shadow-card">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
                <span className="ml-3 font-mono text-xs text-muted-foreground">search — SaaS Alternatives</span>
              </div>
              <div className="p-4">
                <div className="rounded-lg border border-border bg-muted/40 p-3 font-mono text-xs leading-5">
                  <div className="text-muted-foreground">$ pnpm validate-data</div>
                  <div className="text-emerald-600 dark:text-emerald-400">✓ 58 categories, 15 features, 181 products — all valid</div>
                  <div className="mt-2 text-muted-foreground">$ grep -r &quot;Vercel&quot; data/</div>
                  <div>
                    <span className="text-foreground">Vercel</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300">Coolify</span>
                    <span className="text-muted-foreground">, Dokku</span>
                  </div>
                  <div>
                    <span className="text-foreground">Zapier</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300">n8n</span>
                    <span className="text-muted-foreground">, Huginn</span>
                  </div>
                  <div>
                    <span className="text-foreground">Notion</span>
                    <span className="text-muted-foreground"> → </span>
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 text-emerald-700 dark:text-emerald-300">AppFlowy</span>
                    <span className="text-muted-foreground">, AFFiNE</span>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Free</div>
                    <div className="text-sm font-semibold text-foreground">50 tools</div>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-primary">Open source</div>
                    <div className="text-sm font-semibold text-foreground">63</div>
                  </div>
                  <div className="rounded-lg border border-border bg-background p-2.5">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Self-hosted</div>
                    <div className="text-sm font-semibold text-foreground">65</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
              Data lives in <span className="text-foreground">data/products.json</span> — GitHub is the CMS
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}