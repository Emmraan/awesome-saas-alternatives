"use client";

import Link from "next/link";
import { useState } from "react";
import type { PricingModel } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { PricingBadge } from "@/components/ui/PricingBadge";
import { OpenSourceBadge } from "@/components/ui/OpenSourceBadge";
import { SelfHostedBadge } from "@/components/ui/SelfHostedBadge";
import { formatCompact } from "@/lib/format";

interface AltItem {
  slug: string;
  name: string;
  tagline: string;
  pricing: PricingModel;
  openSource: boolean;
  selfHosted: boolean;
  stars: number | null;
}

export interface SwapBoardEntry {
  slug: string;
  name: string;
  pricing: PricingModel;
  altCount: number;
  alts: AltItem[];
}

function ArrowGlyph({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function SwapBoard({
  board,
}: {
  board: { items: SwapBoardEntry[] };
}) {
  const [selected, setSelected] = useState(board.items[0]?.slug ?? "");
  const current =
    board.items.find((entry) => entry.slug === selected) ?? board.items[0];

  if (!current) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          title={
            <>
              Popular SaaS, and what <em className="not-italic text-mint">replaces</em> them
            </>
          }
          description="The paid tools developers ask about most, matched with open alternatives from the index. Pick one."
        />
        <Reveal delay={120}>
          <Link
            href="/alternatives"
            className="group inline-flex items-center gap-2 rounded-md border border-line bg-pine px-4 py-2.5 font-mono text-[12.5px] uppercase tracking-wider text-fog transition-all hover:border-edge hover:text-ink"
          >
            Browse all alternatives
            <ArrowGlyph size={14} />
          </Link>
        </Reveal>
      </div>

      <Reveal
        delay={80}
        className="mt-10 grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card lg:grid-cols-[340px_1fr]"
      >
        <div className="bg-pine/90 p-2.5">
          <p className="px-3 pb-2 pt-1.5 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim">
            Paid incumbent
          </p>
          <div className="grid gap-1">
            {board.items.map((entry) => (
              <button
                key={entry.slug}
                type="button"
                onClick={() => setSelected(entry.slug)}
                aria-pressed={selected === entry.slug}
                className={`group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                  selected === entry.slug
                    ? "bg-minttint text-ink ring-1 ring-mint/25"
                    : "text-fog hover:bg-raised hover:text-ink"
                }`}
              >
                <span className="truncate text-[14px] font-medium">{entry.name}</span>
                <span
                  className={`flex shrink-0 items-center gap-1 font-mono text-[10.5px] ${
                    selected === entry.slug ? "text-mint" : "text-dim"
                  }`}
                >
                  {entry.altCount} alt{entry.altCount > 1 ? "s" : ""}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-void/60 p-5 sm:p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-mono text-[12.5px] text-dim">
              <span className="text-coral line-through decoration-[1.5px]">
                {current.name}
              </span>
              <span className="mx-2 text-mint">→</span>
              <span className="text-ink">
                {current.altCount} open alternative
                {current.altCount > 1 ? "s" : ""}
              </span>
            </p>
            <PricingBadge pricing={current.pricing} />
          </div>
          <div key={current.slug} className="mt-5 grid gap-3 sm:grid-cols-2">
            {current.alts.map((alt) => (
              <Link
                key={alt.slug}
                href={`/alternatives/${alt.slug}`}
                className="group flex items-start justify-between gap-4 rounded-lg border border-line bg-pine/80 p-4 transition-all hover:-translate-y-0.5 hover:border-mint/40 hover:bg-moss"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-[1.05rem] font-semibold text-ink transition-colors group-hover:text-mint">
                      {alt.name}
                    </h3>
                    {alt.stars !== null && (
                      <span className="flex items-center gap-1 font-mono text-[10.5px] text-dim">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true">
                          <path d="m12 3 2.7 5.6 6.3.8-4.6 4.3 1.2 6.1L12 16.9l-5.6 2.9 1.2-6.1L3 9.4l6.3-.8L12 3Z" />
                        </svg>
                        {formatCompact(alt.stars)}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-fog">
                    {alt.tagline}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <PricingBadge pricing={alt.pricing} />
                    <OpenSourceBadge openSource={alt.openSource} />
                    <SelfHostedBadge selfHosted={alt.selfHosted} />
                  </div>
                </div>
                <ArrowGlyph size={15} />
              </Link>
            ))}
          </div>
          {current.altCount > current.alts.length && (
            <p className="mt-4 font-mono text-[11.5px] text-dim">
              + {current.altCount - current.alts.length} more on the product page.
            </p>
          )}
        </div>
      </Reveal>
    </section>
  );
}
