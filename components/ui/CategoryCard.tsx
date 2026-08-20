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
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[border-color,box-shadow] hover:border-zinc-300 hover:shadow-card-hover dark:hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/20 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/60" aria-hidden="true" />
        {productCount !== undefined && (
          <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
            {productCount}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
          {category.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
          {category.description}
        </p>
      </div>
    </Link>
  );
}