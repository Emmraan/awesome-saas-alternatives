"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";

export function HeaderSearch() {
  const router = useRouter();
  return (
    <div className="hidden lg:block w-[280px] xl:w-[320px]">
      <SearchBar
        placeholder="Search tools…"
        onSubmit={(query) => {
          const q = query.trim();
          router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
        }}
      />
      <span className="sr-only">Press ⌘K to search</span>
    </div>
  );
}
