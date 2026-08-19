"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export type PageItem = number | "…";

export function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const candidates = new Set([
    1,
    totalPages,
    page - 1,
    page,
    page + 1,
  ]);
  const pages = [...candidates]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const items: PageItem[] = [];
  let previous = 0;
  for (const p of pages) {
    if (previous !== 0 && p - previous > 1) {
      items.push("…");
    }
    items.push(p);
    previous = p;
  }
  return items;
}

const BUTTON_CLASSES =
  "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-card px-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={BUTTON_CLASSES}
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {getPageItems(page, totalPages).map((item, index) =>
        item === "…" ? (
          <span
            key={`ellipsis-${index}`}
            aria-hidden="true"
            className="px-1 text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={cn(
              BUTTON_CLASSES,
              item === page &&
                "border-transparent bg-primary font-medium text-primary-foreground hover:bg-primary",
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={BUTTON_CLASSES}
      >
        <ChevronRight
          className="h-4 w-4"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>
    </nav>
  );
}