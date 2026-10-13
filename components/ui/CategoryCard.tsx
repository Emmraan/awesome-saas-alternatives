import Link from "next/link";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/cn";

export function CategoryCard({
  category,
  productCount,
  className,
}: {
  category: Category;
  productCount?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-lg border border-line bg-pine p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-edge hover:bg-moss hover:shadow-card-hover",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-5 h-8 w-[3px] origin-top scale-y-0 rounded-r bg-sky transition-transform duration-300 group-hover:scale-y-100"
      />
      <div className="flex items-start justify-between gap-3">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          aria-hidden="true"
          className="text-dim transition-colors group-hover:text-mint"
        >
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
        </svg>
        {productCount !== undefined && (
          <span className="shrink-0 rounded-full border border-line bg-raised px-2 py-0.5 font-mono text-[11px] tabular-nums text-dim">
            {productCount}
          </span>
        )}
      </div>
      <h3 className="mt-3.5 font-display text-lg font-semibold leading-tight tracking-tight text-ink transition-colors group-hover:text-sky">
        {category.name}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-fog">
        {category.description}
      </p>
    </Link>
  );
}
