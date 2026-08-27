"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SearchX } from "lucide-react";
import type { Category, Product } from "@/lib/types";
import { searchProducts } from "@/lib/search";
import { Reveal } from "@/components/motion/Reveal";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProductCard } from "@/components/ui/ProductCard";
import { SearchBar } from "@/components/ui/SearchBar";

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
          <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product, index) => (
              <Reveal key={product.slug} as="li" delay={(index % 6) * 50} className="flex">
                <ProductCard
                  product={product}
                  categories={categories}
                  className="h-full w-full"
                />
              </Reveal>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}