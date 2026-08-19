"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/ui/SearchBar";

export function HeroSearch() {
  const router = useRouter();

  return (
    <SearchBar
      placeholder="Search 180+ tools — “vercel”, “analytics”, “zapier alternative”…"
      onSubmit={(query) => router.push(`/search?q=${encodeURIComponent(query)}`)}
    />
  );
}