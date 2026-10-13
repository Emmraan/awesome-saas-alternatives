"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { buildDirectoryUrl, type DirectoryState } from "@/lib/directory";

export function DirectorySearch({
  state,
  basePath = "/alternatives",
}: {
  state: DirectoryState;
  basePath?: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState(state.q);

  // Sync draft when URL q changes (e.g., back/forward)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(state.q);
  }, [state.q]);

  const commit = (value: string) => {
    const next = { ...state, q: value.trim(), page: 1 } as DirectoryState;
    router.replace(buildDirectoryUrl(next, basePath), { scroll: false });
  };

  return (
    <form
      className="relative w-full max-w-sm"
      onSubmit={(e) => {
        e.preventDefault();
        commit(draft);
      }}
    >
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-dim" strokeWidth={1.75} aria-hidden="true" />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== state.q) commit(draft);
        }}
        placeholder="Filter by name or tag…"
        className="w-full rounded-lg border border-line bg-pine py-3 pl-10 pr-10 font-mono text-[13px] text-ink placeholder:text-dim focus:border-mint/50 focus:outline-none"
      />
      {draft && (
        <button
          type="button"
          onClick={() => {
            setDraft("");
            commit("");
          }}
          aria-label="Clear filter"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-dim transition-colors hover:text-coral"
        >
          <X className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    </form>
  );
}
