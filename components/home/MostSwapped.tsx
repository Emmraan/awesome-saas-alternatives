import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { OpenSourceBadge } from "@/components/ui/OpenSourceBadge";
import { SelfHostedBadge } from "@/components/ui/SelfHostedBadge";

export interface SwappedTool {
  slug: string;
  name: string;
  tagline: string;
  count: number;
  openSource: boolean;
  selfHosted: boolean;
}

export function MostSwapped({ tools }: { tools: SwappedTool[] }) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <SectionHead
        title={
          <>
            Most-swapped <span className="text-sky">tools</span>
          </>
        }
        description="Ranked by how many paid SaaS each one replaces. The biggest wins come first."
      />

      <div className="mt-10 space-y-1.5">
        {tools.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i * 50, 250)}>
            <Link
              href={`/alternatives/${p.slug}`}
              className="group grid grid-cols-[3rem_1fr_auto] items-center gap-x-5 rounded-lg px-4 py-4 transition-colors hover:bg-pine sm:grid-cols-[4rem_1.15fr_auto_auto] sm:px-6"
            >
              <span className="font-display text-[1.7rem] font-bold leading-none text-dim transition-colors group-hover:text-mint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display text-[1.25rem] font-semibold leading-tight text-ink transition-colors group-hover:text-mint">
                    {p.name}
                  </h3>
                  <span className="hidden gap-1.5 sm:inline-flex">
                    <OpenSourceBadge openSource={p.openSource} />
                    <SelfHostedBadge selfHosted={p.selfHosted} />
                  </span>
                </div>
                <p className="mt-1 truncate text-[13.5px] text-fog">{p.tagline}</p>
              </div>
              <span
                className="flex items-center gap-2.5"
                title={`Replaces ${p.count} paid tools`}
              >
                <span className="flex items-end gap-[3px]" aria-hidden="true">
                  {Array.from({ length: p.count }).map((_, k) => (
                    <span
                      key={k}
                      className="h-4 w-[3px] rounded-sm bg-mint/75 transition-colors group-hover:bg-mint"
                    />
                  ))}
                </span>
                <span className="whitespace-nowrap font-mono text-[11.5px] text-mint">
                  {p.count} tools
                </span>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="hidden text-dim transition-all group-hover:translate-x-1 group-hover:text-mint sm:block"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
