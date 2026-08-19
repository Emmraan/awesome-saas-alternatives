import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getProducts } from "@/lib/data";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SearchBar } from "@/components/ui/SearchBar";
import { SearchResults } from "@/components/search/SearchResults";

export const metadata: Metadata = {
  title: "Search alternatives",
  description:
    "Search the catalog of open-source, free and self-hosted alternatives by tool name, category or the SaaS you want to replace.",
};

export default function SearchPage() {
  const products = getProducts();
  const categories = getCategories();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Search alternatives
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Find a free, open-source or self-hosted alternative by tool name,
          category, or the SaaS you want to swap out.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="mt-8">
            <SearchBar
              defaultValue=""
              placeholder="Search tools, categories, alternatives…"
              onSubmit={() => {}}
            />
          </div>
        }
      >
        <SearchResults products={products} categories={categories} />
      </Suspense>
    </div>
  );
}