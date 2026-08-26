import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export function ContributeBand({ githubUrl }: { githubUrl: string }) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-24 pt-4 lg:px-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-xl border border-mint/25 bg-gradient-to-br from-minttint via-pine to-pine p-8 shadow-card sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-mint/10 blur-3xl"
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl">
                Found a tool we missed?
                <br />
                <span className="text-mint">The catalog is a JSON file.</span>
              </h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fog">
                Add one entry to{" "}
                <code className="rounded bg-void/60 px-1.5 py-0.5 font-mono text-[13px] text-mint">
                  data/products.json
                </code>
                , run the validator and open a PR. The merge button is the only
                deploy pipeline.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contribute"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-mint px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-wider text-void transition-all hover:bg-ink hover:shadow-[0_0_40px_-8px_rgba(99,232,156,0.5)]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M6 9v3a3 3 0 0 0 3 3h6" />
                </svg>
                How to contribute
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-md border border-mint/40 px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-wider text-mint transition-all hover:border-mint hover:bg-minttint"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
                </svg>
                The repository
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <path d="M7 17 17 7M8 7h9v9" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
