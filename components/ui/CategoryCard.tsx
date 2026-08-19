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
        "group block rounded-lg border border-border bg-card p-4",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_2px_8px_rgba(0,0,0,0.05)]",
        "dark:hover:border-zinc-700 dark:hover:shadow-[0_2px_12px_rgba(0,0,0,0.35)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {category.name}
        </h3>
        {productCount !== undefined && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[11px] tabular-nums text-muted-foreground">
            {productCount}
          </span>
        )}
      </div>
      <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
        {category.description}
      </p>
    </Link>
  );
}