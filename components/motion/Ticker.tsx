import Link from "next/link";
import { getProducts } from "@/lib/data";

interface SwapPair {
  slug: string;
  from: string;
  to: string;
}

function buildSwapPairs(limit: number): SwapPair[] {
  return getProducts()
    .filter((p) => p.replaces.length > 0)
    .sort((a, b) => b.replaces.length - a.replaces.length)
    .slice(0, limit)
    .map((p) => ({ slug: p.slug, from: p.replaces[0], to: p.name }));
}

function Row({
  pairs,
  hidden,
}: {
  pairs: SwapPair[];
  hidden: boolean;
}) {
  return (
    <div aria-hidden={hidden} className="flex shrink-0 items-center">
      {pairs.map((p, i) => (
        <Link
          key={`${hidden ? "b" : "a"}-${i}`}
          href={`/alternatives/${p.slug}`}
          tabIndex={hidden ? -1 : 0}
          className="group flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 font-mono text-[12.5px] text-fog transition-colors hover:text-ink"
        >
          <span className="text-dim line-through decoration-coral/60 decoration-[1.5px] transition-colors group-hover:text-coral">
            {p.from}
          </span>
          <span className="text-mint">→</span>
          <span className="text-ink/90">{p.to}</span>
          <span aria-hidden="true" className="ml-3 text-line">
            ✳
          </span>
        </Link>
      ))}
    </div>
  );
}

export function Ticker({ className = "" }: { className?: string }) {
  const pairs = buildSwapPairs(36);
  if (pairs.length === 0) return null;

  return (
    <div
      className={`ticker-shell relative overflow-hidden border-y border-line bg-pine/60 ${className}`}
      role="marquee"
      aria-label="Popular swaps from the catalog"
    >
      <div
        className="ticker-track flex w-max"
        style={{ "--speed": "52s" } as React.CSSProperties}
      >
        <Row pairs={pairs} hidden={false} />
        <Row pairs={pairs} hidden={true} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-void to-transparent" />
    </div>
  );
}
