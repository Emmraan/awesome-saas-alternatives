"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  defaultValue = "",
  value,
  placeholder = "Search tools, categories, alternatives…",
  onSubmit,
  onChange,
  autoFocus = false,
}: {
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  onSubmit?: (query: string) => void;
  onChange?: (value: string) => void;
  autoFocus?: boolean;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  const updateValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(current.trim());
      }}
      className="relative"
    >
      <label htmlFor="global-search" className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        id="global-search"
        type="search"
        value={current}
        onChange={(event) => updateValue(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-11 w-full rounded-full border border-border bg-card pl-10 pr-20 text-sm text-foreground shadow-sm backdrop-blur transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(16,185,129,0.12)] focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
      />
      <div className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 sm:flex">
        {current.length > 0 ? (
          <button
            type="button"
            onClick={() => updateValue("")}
            aria-label="Clear search"
            className="pointer-events-auto inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          </button>
        ) : (
          <span className="hidden items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-1 font-mono text-[11px] text-muted-foreground lg:inline-flex">
            ⌘ K
          </span>
        )}
      </div>
      {current.length > 0 && (
        <button
          type="button"
          onClick={() => updateValue("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:hidden"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}