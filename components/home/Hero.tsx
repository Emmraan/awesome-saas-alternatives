"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Ticker } from "@/components/motion/Ticker";
import { useCountUp, usePrefersReducedMotion, useScramble } from "@/components/motion/hooks";
import { formatCompact } from "@/lib/format";

export interface HeroStats {
  products: number;
  alternatives: number;
  categories: number;
  swaps: number;
}

export interface LedgerEntry {
  slug: string;
  name: string;
  count: number;
  stars: number | null;
}

function Stat({
  value,
  label,
  delay = 0,
}: {
  value: number;
  label: string;
  delay?: number;
}) {
  const [ref, n] = useCountUp(value);
  return (
    <Reveal delay={delay} className="min-w-0">
      <div className="font-display text-[2.1rem] font-bold leading-none tracking-tight text-ink sm:text-[2.4rem]">
        <span ref={ref}>{n}</span>
        <span className="text-mint">+</span>
      </div>
      <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
        {label}
      </div>
    </Reveal>
  );
}

function StarGlyph() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9l-5.6 2.9 1.2-6.1L3 9.4l6.3-.8L12 3Z" />
    </svg>
  );
}

function SwapGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 7H4m0 0 4-4M4 7l4 4" />
      <path d="M4 17h16m0 0-4-4m4 4-4 4" />
    </svg>
  );
}

function ArrowUpRightGlyph({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function Hero({
  stats,
  ledger,
  pairs,
}: {
  stats: HeroStats;
  ledger: LedgerEntry[];
  pairs: [string, string][];
}) {
  const reduced = usePrefersReducedMotion();
  const [pairIdx, setPairIdx] = useState(0);

  useEffect(() => {
    if (reduced || pairs.length === 0) return;
    const id = setInterval(
      () => setPairIdx((v) => (v + 1) % pairs.length),
      3200,
    );
    return () => clearInterval(id);
  }, [reduced, pairs.length]);

  const safeIdx = pairs.length > 0 ? pairIdx % pairs.length : 0;
  const [from, to] = pairs[safeIdx] ?? ["SaaS", "open source"];
  const paid = useScramble(from);
  const alt = useScramble(to);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-7xl items-start gap-12 px-5 pb-14 pt-14 lg:grid-cols-[1.12fr_0.88fr] lg:px-8 lg:pb-16 lg:pt-20">
        <div>
          <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-mint">
            The open-source swap index
          </p>
          <h1 className="mt-6 font-display text-[2.9rem] font-extrabold leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-[4.4rem]">
            <span
              className="mask-line"
              style={{ "--d": "40ms" } as React.CSSProperties}
            >
              <span>
                Swap{" "}
                <span className="relative inline-block whitespace-nowrap text-coral">
                  {paid}
                  <span key={safeIdx} className="strike-line" aria-hidden="true" />
                </span>
              </span>
            </span>
            <span
              className="mask-line"
              style={{ "--d": "160ms" } as React.CSSProperties}
            >
              <span>
                for <span className="whitespace-nowrap text-mint">{alt}</span>
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-fog">
            {stats.products} open and self-hosted tools that replace the paid
            SaaS in your stack. Data lives in GitHub, not a paywall.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="/alternatives"
              className="group inline-flex items-center gap-2.5 rounded-md bg-mint px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-wider text-void transition-all hover:bg-ink hover:shadow-[0_0_40px_-8px_rgba(99,232,156,0.55)]"
            >
              <SwapGlyph />
              Browse the index
            </Link>
            <a
              href="https://github.com/Emmraan/awesome-saas-alternatives"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-md border border-line bg-pine px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-wider text-fog transition-all hover:border-edge hover:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
              </svg>
              Star on GitHub
              <ArrowUpRightGlyph />
            </a>
          </div>
        </div>

        {/* the live ledger: real data, not a mockup */}
        <Reveal
          delay={140}
          className="rounded-xl border border-line bg-pine/75 p-5 shadow-card sm:p-6"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Ranked by tools replaced
            </h2>
            <Link
              href="/alternatives"
              className="group inline-flex items-center gap-1.5 font-mono text-[11.5px] text-fog transition-colors hover:text-mint"
            >
              Full index
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
          <ul className="mt-4">
            {ledger.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/alternatives/${p.slug}`}
                  className="group grid grid-cols-[2.4rem_1fr_auto] items-baseline gap-3 rounded-md px-2.5 py-[9px] transition-colors hover:bg-raised sm:grid-cols-[2.4rem_1fr_auto_auto]"
                >
                  <span className="font-mono text-[11.5px] text-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-display text-[15.5px] font-semibold text-ink transition-colors group-hover:text-mint">
                    {p.name}
                  </span>
                  <span className="font-mono text-[11.5px] text-mint">
                    ×{p.count} swaps
                  </span>
                  <span className="hidden items-center gap-1 font-mono text-[11.5px] text-dim sm:flex">
                    <StarGlyph />
                    {p.stars !== null ? formatCompact(p.stars) : "—"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line/80 py-9 sm:grid-cols-4">
          <Stat value={stats.products} label="Products mapped" />
          <Stat value={stats.alternatives} label="Open alternatives" delay={80} />
          <Stat value={stats.categories} label="Categories" delay={160} />
          <Stat value={stats.swaps} label="Verified swaps" delay={240} />
        </div>
      </div>

      <Ticker className="mt-2" />
    </section>
  );
}
