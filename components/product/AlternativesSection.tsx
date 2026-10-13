import type { Category, Product } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { AlternativeCard } from "@/components/ui/AlternativeCard";

export function AlternativesSection({
  product,
  alternatives,
  categories,
}: {
  product: Product;
  alternatives: Product[];
  categories: Category[];
}) {
  if (alternatives.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-lg border border-line bg-pine shadow-card">
      <div className="flex items-center gap-2 border-b border-line bg-moss/60 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
        <span aria-hidden="true" className="text-mint">⌁</span>
        alternatives — {alternatives.length} tools
        <span className="ml-auto hidden normal-case tracking-normal sm:block">
          ranked by replacements
        </span>
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-[1.7rem]">
          Open alternatives to{" "}
          <span className="text-mint">{product.name}</span>
        </h2>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-fog">
          Open, self-hosted and lower-cost options in the directory — ranked by
          how much each one replaces.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {alternatives.map((alternative, index) => (
            <Reveal key={alternative.slug} delay={(index % 3) * 70}>
              <AlternativeCard
                product={alternative}
                categories={categories}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
