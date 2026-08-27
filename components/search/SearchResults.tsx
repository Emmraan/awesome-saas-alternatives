"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, SearchX, Star } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { searchProducts, tokenize } from "@/lib/search";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { PricingBadge } from "@/components/ui/PricingBadge";
import { SearchBar } from "@/components/ui/SearchBar";
import { formatCompact } from "@/lib/format";

function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return <>{text}</>;
  const pattern = new RegExp(`(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, index) =>
        tokens.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={index}>{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function SearchResults({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [input, setInput] = useState(query);
  const [prevQuery, setPrevQuery] = useState(query);

  if (prevQuery !== query) {
    setPrevQuery(query);
    setInput(query);
  }

  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => searchProducts(query, products, categories),
    [query, products, categories],
  );

  const updateQuery = (value: string) => {
    setInput(value);
    const trimmed = value.trim();
    router.replace(
      trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : "/search",
      { scroll: false },
    );
  };

  return (
    <div className="mt-8">
      <Reveal>
        <SearchBar
          value={input}
          autoFocus
          placeholder="Search tools, categories, alternatives…"
          onChange={updateQuery}
          onSubmit={() => {
            resultsRef.current?.focus({ preventScroll: true });
          }}
        />
      </Reveal>

      {query.trim() === "" ? (
        <Reveal delay={80} className="mt-10">
          <EmptyState
            title="Search the directory"
            description="Try a tool like “vercel”, a need like “self hosted analytics”, or “zapier alternative” to see what can replace it."
            icon={Search}
          />
        </Reveal>
      ) : results.length === 0 ? (
        <Reveal delay={80} className="mt-10">
          <EmptyState
            title={`No results for “${query.trim()}”`}
            description="Nothing in the catalog matches that yet — try a tool name, a category or the SaaS you want to replace."
            action={{ label: "Browse all alternatives", href: "/alternatives" }}
            icon={SearchX}
          />
        </Reveal>
      ) : (
        <div ref={resultsRef} tabIndex={-1} className="mt-10 focus-visible:outline-none">
          <Reveal className="flex items-center gap-2 rounded-lg border border-line bg-moss/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-dim" role="status">
            <span className="text-mint">≡</span> {results.length} match{results.length === 1 ? "" : "es"} — ranked by relevance · for “{query.trim()}”
          </Reveal>
          <ul className="mt-5 divide-y divide-line/70 overflow-hidden rounded-xl border border-line bg-pine/50">
            {results.map((product, index) => {
              const isAlt = product.replaces.length > 0;
              return (
                <Reveal key={product.slug} as="li" delay={(index % 6) * 30}>
                  <Link
                    href={`/alternatives/${product.slug}`}
                    className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-moss sm:px-6"
                  >
                    <span className="hidden w-8 shrink-0 text-right font-mono text-[11px] text-dim sm:block">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[1.15rem] font-semibold text-ink transition-colors group-hover:text-mint">
                          <Highlight text={product.name} query={query} />
                        </span>
                        <PricingBadge pricing={product.pricing} />
                      </span>
                      <span className="mt-1 block truncate text-[13px] text-fog">
                        <Highlight text={product.tagline} query={query} />
                      </span>
                    </span>
                    {product.github?.stars != null && (
                      <span className="hidden shrink-0 items-center gap-1 font-mono text-[11px] text-dim md:flex">
                        <Star className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                        {formatCompact(product.github.stars)}
                      </span>
                    )}
                    <span className={`flex shrink-0 items-center gap-1.5 font-mono text-[11px] ${isAlt ? "text-mint" : "text-dim"}`}>
                      {isAlt ? `replaces ${product.replaces.length}` : "no match yet"}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="hidden shrink-0 text-dim transition-transform group-hover:translate-x-1 group-hover:text-mint sm:block">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}