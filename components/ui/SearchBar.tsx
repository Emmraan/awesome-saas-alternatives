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
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
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
        className="h-11 w-full rounded-md border border-input bg-background pl-9 pr-9 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground [&::-webkit-search-cancel-button]:appearance-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      {current.length > 0 && (
        <button
          type="button"
          onClick={() => updateValue("")}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}