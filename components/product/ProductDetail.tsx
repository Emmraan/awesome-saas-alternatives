import type { Category, Feature, Product } from "@/lib/types";
import type { ProductFact } from "@/lib/product-detail";
import {
  buildBreadcrumbJsonLd,
  buildSoftwareApplicationJsonLd,
} from "@/lib/product-detail";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ProductDetailHeader } from "./ProductDetailHeader";
import { ReplacesSection } from "./ReplacesSection";
import { AlternativesSection } from "./AlternativesSection";
import { ComparisonSection } from "./ComparisonSection";
import { WhyChooseSection } from "./WhyChooseSection";

export function ProductDetail({
  product,
  replacedProducts,
  alternatives,
  comparisonProducts,
  categories,
  features,
  facts,
}: {
  product: Product;
  replacedProducts: Product[];
  alternatives: Product[];
  comparisonProducts: Product[];
  categories: Category[];
  features: Feature[];
  facts: ProductFact[];
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Alternatives", href: "/alternatives" },
          { label: product.name },
        ]}
      />

      <div className="mt-6">
        <ProductDetailHeader product={product} categories={categories} />
      </div>

      <div className="mt-8 grid gap-6">
        <ReplacesSection
          product={product}
          replacedProducts={replacedProducts}
        />
        <AlternativesSection
          product={product}
          alternatives={alternatives}
          categories={categories}
        />
        <ComparisonSection
          product={product}
          comparisonProducts={comparisonProducts}
          features={features}
        />
        <WhyChooseSection product={product} facts={facts} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildSoftwareApplicationJsonLd(product)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildBreadcrumbJsonLd(product)),
        }}
      />
    </div>
  );
}