import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getFeatures, getProduct, getProductSlugs, getProducts } from "@/lib/data";
import {
  getAlternativeProducts,
  getComparisonProducts,
  getProductCategories,
  getReplacedProducts,
  getWhyChooseFacts,
} from "@/lib/product-detail";
import { ProductDetail } from "@/components/product/ProductDetail";

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const allProducts = getProducts();
  const alternatives = getAlternativeProducts(product, allProducts);
  const replacedNames = getReplacedProducts(product, allProducts).map(
    (p) => p.name,
  );

  const title =
    alternatives.length > 0
      ? `${product.name} — free & open-source alternatives`
      : replacedNames.length > 0
        ? `${product.name} — open-source alternative to ${replacedNames[0]}${
            replacedNames.length > 1
              ? ` and ${replacedNames.length - 1} more`
              : ""
          }`
        : product.name;

  const description =
    alternatives.length > 0
      ? `${product.name}: ${alternatives.length} free, open-source and self-hosted alternatives from the directory, compared side by side.`
      : replacedNames.length > 0
        ? `${product.name} is a ${
            product.openSource ? "free, open-source" : "lower-cost"
          } alternative to ${replacedNames[0]}${
            replacedNames.length > 1
              ? ` and ${replacedNames.length - 1} other tools`
              : ""
          }.`
        : product.tagline;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const allProducts = getProducts();
  const categories = getCategories();
  const features = getFeatures();

  return (
    <ProductDetail
      product={product}
      replacedProducts={getReplacedProducts(product, allProducts)}
      alternatives={getAlternativeProducts(product, allProducts)}
      comparisonProducts={getComparisonProducts(product, allProducts)}
      categories={getProductCategories(product, categories)}
      features={features}
      facts={getWhyChooseFacts(product)}
    />
  );
}