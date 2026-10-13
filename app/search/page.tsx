import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { SearchBar } from "@/components/ui/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Search alternatives",
  description:
    "Search the catalog of open-source, free and self-hosted alternatives by tool name, category or the SaaS you want to replace.",
  path: "/search",
});

export default function SearchPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-14 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "search" },
        ]}
      />

      <header className="mt-5">
        <Reveal>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            What are you <span className="text-sky">done paying for?</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fog">
            Find a free, open-source or self-hosted alternative by tool name,
            category, or the SaaS you want to swap out.
          </p>
        </Reveal>
      </header>

      <Suspense
        fallback={
          <div className="mt-8">
            <SearchBar
              defaultValue=""
              placeholder="Search tools, categories, alternatives…"
            />
          </div>
        }
      >
        <SearchResults products={products} categories={categories} />
      </Suspense>
    </div>
  );
}