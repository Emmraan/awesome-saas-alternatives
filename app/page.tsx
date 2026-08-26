import type { Metadata } from "next";
import {
  getCategories,
  getProducts,
  getProductsByAlternative,
} from "@/lib/data";
import { getCategoryGroups } from "@/lib/categories";
import { GITHUB_REPO_URL } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { SwapBoard } from "@/components/home/SwapBoard";
import { MostSwapped } from "@/components/home/MostSwapped";
import { CategoryIndex } from "@/components/home/CategoryIndex";
import { BadgeExplainer } from "@/components/home/BadgeExplainer";
import { ContributeBand } from "@/components/home/ContributeBand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "The open-source swap index",
  description:
    "Find open-source & free alternatives to the SaaS you already use. Every swap is mapped, verified and one click away.",
  path: "/",
});

export default function HomePage() {
  const products = getProducts();
  const categories = getCategories();

  const stats = {
    products: products.length,
    alternatives: products.filter((p) => p.replaces.length > 0).length,
    categories: categories.length,
    swaps: products.reduce((sum, p) => sum + p.replaces.length, 0),
  };

  const ranked = [...products]
    .filter((p) => p.replaces.length > 0)
    .sort(
      (a, b) =>
        b.replaces.length - a.replaces.length ||
        (b.github?.stars ?? 0) - (a.github?.stars ?? 0),
    );

  const ledger = ranked.slice(0, 8).map((p) => ({
    slug: p.slug,
    name: p.name,
    count: p.replaces.length,
    stars: p.github?.stars ?? null,
  }));

  const pairs: [string, string][] = ranked
    .slice(0, 10)
    .map((p) => [p.replaces[0], p.name]);

  const popular = products
    .filter((p) => p.replaces.length === 0 && !p.openSource)
    .map((p) => ({ product: p, alts: getProductsByAlternative(p.name) }))
    .filter((entry) => entry.alts.length > 0)
    .sort(
      (a, b) =>
        b.alts.length - a.alts.length ||
        a.product.name.localeCompare(b.product.name),
    )
    .slice(0, 10)
    .map(({ product, alts }) => ({
      slug: product.slug,
      name: product.name,
      pricing: product.pricing,
      altSlugs: alts.slice(0, 4).map((a) => a.slug),
      altCount: alts.length,
    }));

  const allAltDetails = new Map(
    popular.flatMap((entry) => entry.altSlugs).map((slug) => {
      const p = products.find((candidate) => candidate.slug === slug);
      return p
        ? [
            slug,
            {
              slug: p.slug,
              name: p.name,
              tagline: p.tagline,
              pricing: p.pricing,
              openSource: p.openSource,
              selfHosted: p.selfHosted,
              stars: p.github?.stars ?? null,
            },
          ]
        : [slug, null];
    }),
  );

  const swapBoard = {
    items: popular.map((entry) => ({
      ...entry,
      alts: entry.altSlugs
        .map((slug) => allAltDetails.get(slug))
        .filter((alt): alt is NonNullable<typeof alt> => alt !== null),
    })),
  };

  const mostSwapped = ranked.slice(0, 8).map((p) => ({
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    count: p.replaces.length,
    openSource: p.openSource,
    selfHosted: p.selfHosted,
  }));

  const githubUrl = GITHUB_REPO_URL;

  return (
    <>
      <Hero stats={stats} ledger={ledger} pairs={pairs} />
      <SwapBoard board={swapBoard} />
      <MostSwapped tools={mostSwapped} />
      <CategoryIndex groups={getCategoryGroups().slice(0, 9)} />
      <BadgeExplainer />
      <ContributeBand githubUrl={githubUrl} />
    </>
  );
}
