import type { Metadata } from "next";
import {
  getCategories,
  getProducts,
  getProductsByCategory,
  getTopLevelCategories,
} from "@/lib/data";
import {
  getPopularSaaSPairs,
  getTopAlternatives,
} from "@/components/home/home-data";
import { Hero } from "@/components/home/Hero";
import { SwappableSaaS } from "@/components/home/SwappableSaaS";
import { TopAlternatives } from "@/components/home/TopAlternatives";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BadgeExplainer } from "@/components/home/BadgeExplainer";
import { ContributeCta } from "@/components/home/ContributeCta";

export const metadata: Metadata = {
  title: "Open-Source Alternatives to the SaaS You Already Use",
  description:
    "Discover 180+ open-source, free and self-hosted alternatives to popular SaaS like Vercel, Zapier and Notion — and cut your stack's cost without changing your workflow.",
};

const POPULAR_QUERIES = ["vercel", "zapier", "notion", "analytics"];

export default function HomePage() {
  const products = getProducts();
  const categories = getCategories();
  const topLevelCategories = getTopLevelCategories();

  const stats = {
    products: products.length,
    alternatives: products.filter((p) => p.replaces.length > 0).length,
    categories: categories.length,
  };

  const pairs = getPopularSaaSPairs(products, 6);
  const topAlternatives = getTopAlternatives(products, 8);
  const categoryCounts = topLevelCategories.map((category) => ({
    category,
    count: getProductsByCategory(category.slug).length,
  }));

  return (
    <>
      <Hero stats={stats} popularQueries={POPULAR_QUERIES} />
      <SwappableSaaS pairs={pairs} />
      <TopAlternatives products={topAlternatives} categories={categories} />
      <CategoryGrid categories={categoryCounts} />
      <BadgeExplainer />
      <ContributeCta />
    </>
  );
}