import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContributeCta() {
  return (
    <section className="bg-muted/20">
      <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-card">
          <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" aria-hidden="true" />
            <span className="h-3 w-3 rounded-full bg-emerald-400" aria-hidden="true" />
            <span className="ml-3 font-mono text-xs text-muted-foreground">contribute — SaaS Alternatives</span>
          </div>
          <div className="grid gap-8 p-6 sm:grid-cols-[1.2fr_0.8fr] sm:p-8 lg:p-10">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Open directory
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                See a tool we missed?
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                The whole directory is open source — data lives in a{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">data/products.json</code>{" "}
                on GitHub. Add a product or fix an entry with a pull request,
                no account needed beyond GitHub.
              </p>
              <div className="mt-5 rounded-lg border border-border bg-muted/20 p-3 font-mono text-xs">
                <div className="text-muted-foreground">$ git clone & pnpm install</div>
                <div className="text-muted-foreground">$ pnpm validate-data</div>
                <div className="text-emerald-600 dark:text-emerald-400">✓ 181 products — all valid</div>
              </div>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <Link
                href="/contribute"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Contribute on GitHub
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </Link>
              <Link
                href="/alternatives"
                className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Browse all tools
              </Link>
              <p className="text-center text-xs text-muted-foreground">PRs welcome — tested PRs only</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}