import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContributeCta() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-primary">
                Open directory
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                See a tool we missed?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                The whole directory is open source — data lives in a JSON file
                on GitHub. Add a product or fix an entry with a pull request,
                no account needed beyond GitHub.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contribute"
                className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Contribute on GitHub
                <ArrowRight
                  className="h-4 w-4"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/alternatives"
                className="inline-flex h-10 items-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
              >
                Browse all tools
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}