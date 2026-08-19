"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { FilterPanel } from "@/components/ui/FilterPanel";
import { cn } from "@/lib/cn";
import {
  SORT_OPTIONS,
  buildDirectoryUrl,
  toggleValue,
  type DirectoryState,
  type FilterGroupData,
  type FilterGroupId,
  type SortKey,
} from "@/lib/directory";

export function DirectoryControls({
  state,
  groups,
  activeCount,
  totalResults,
  showStarsSort,
  basePath = "/alternatives",
  children,
}: {
  state: DirectoryState;
  groups: FilterGroupData[];
  activeCount: number;
  totalResults: number;
  showStarsSort: boolean;
  basePath?: string;
  children: ReactNode;
}) {
  const router = useRouter();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    if (!sheetOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    document.documentElement.style.overflow = "hidden";
    panelRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = "";
    };
  }, [sheetOpen]);

  const closeSheet = () => {
    setSheetOpen(false);
    triggerRef.current?.focus();
  };

  const go = (next: DirectoryState) => {
    router.replace(buildDirectoryUrl(next, basePath), { scroll: false });
  };

  const handleSort = (value: string) => {
    go({ ...state, sort: value as SortKey, page: 1 });
  };

  const handleToggle = (groupId: string, value: string) => {
    go(toggleValue(state, groupId as FilterGroupId, value));
    setSheetOpen(false);
  };

  const selected: Record<string, string[]> = {
    pricing: state.pricing,
    difficulty: state.difficulty,
    hosting: state.selfHosted ? ["self-hostable"] : [],
    license: state.openSource ? ["open-source"] : [],
  };

  const sortOptions = showStarsSort
    ? SORT_OPTIONS
    : SORT_OPTIONS.filter((option) => option.value !== "stars");

  return (
    <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
      <aside className="hidden lg:block lg:w-60 lg:shrink-0">
        <div className="sticky top-20 flex flex-col gap-4">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Filters
          </h2>
          <FilterPanel groups={groups} selected={selected} onToggle={handleToggle} />
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={sheetOpen}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-md border border-input bg-card px-3 text-sm font-medium text-foreground",
              "transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              "lg:hidden",
            )}
          >
            <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                {activeCount}
              </span>
            )}
          </button>

          <label className="ml-auto flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort</span>
            <select
              value={state.sort}
              onChange={(event) => handleSort(event.target.value)}
              className="h-9 rounded-md border border-input bg-card px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="pt-6">{children}</div>
      </div>

      {sheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close filters"
            onClick={closeSheet}
            className="absolute inset-0 cursor-default bg-black/40"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            tabIndex={-1}
            className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-2xl border border-b-0 border-border bg-background p-5 pb-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Filters</h2>
              <button
                type="button"
                onClick={closeSheet}
                aria-label="Close filters"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>
            <FilterPanel groups={groups} selected={selected} onToggle={handleToggle} />
            <button
              type="button"
              onClick={closeSheet}
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Show {totalResults} result{totalResults === 1 ? "" : "s"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}