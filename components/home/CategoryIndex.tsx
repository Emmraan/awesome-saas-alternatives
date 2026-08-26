import Link from "next/link";
import type { CategoryGroup } from "@/lib/categories";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";

export function CategoryIndex({ groups }: { groups: CategoryGroup[] }) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHead
          title={
            <>
              Find alternatives by <span className="text-sky">what you need</span>
            </>
          }
          description="Hosting, analytics, email, AI, project management and more. Every category has a free or open option."
        />
        <Reveal delay={120}>
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 rounded-md border border-line bg-pine px-4 py-2.5 font-mono text-[12.5px] uppercase tracking-wider text-fog transition-all hover:border-edge hover:text-ink"
          >
            All categories
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </Reveal>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => (
          <Reveal
            key={group.topLevel.slug}
            delay={(i % 3) * 70}
            className="h-full"
          >
            <Link
              href={`/categories/${group.topLevel.slug}`}
              className="group flex h-full flex-col rounded-lg border border-line bg-pine/70 p-5 shadow-card transition-all hover:-translate-y-1 hover:border-edge hover:bg-moss hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className="text-dim transition-colors group-hover:text-mint"
                >
                  <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                </svg>
                <span className="font-mono text-[11px] text-dim">
                  {group.totalCount} tools
                </span>
              </div>
              <h3 className="mt-3.5 font-display text-[1.15rem] font-semibold text-ink transition-colors group-hover:text-mint">
                {group.topLevel.name}
              </h3>
              <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-fog">
                {group.topLevel.description}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {group.children.slice(0, 3).map((child) => (
                  <span
                    key={child.category.slug}
                    className="rounded-full border border-line bg-raised px-2.5 py-0.5 font-mono text-[10.5px] text-fog"
                  >
                    {child.category.name}
                  </span>
                ))}
                {group.children.length > 3 && (
                  <span className="rounded-full border border-line bg-raised px-2.5 py-0.5 font-mono text-[10.5px] text-dim">
                    +{group.children.length - 3}
                  </span>
                )}
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
