"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";

export function SearchBar({
  defaultValue = "",
  placeholder = "Search tools, categories, alternatives…",
  onSubmit,
  autoFocus = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  onSubmit: (query: string) => void;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(defaultValue);

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(value.trim());
      }}
      className="relative"
    >
      <label htmlFor="global-search" className="sr-only">
        Search products
      </label>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        id="global-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}