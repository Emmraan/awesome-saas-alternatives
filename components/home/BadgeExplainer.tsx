import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "./SectionHead";
import { PricingBadge } from "@/components/ui/PricingBadge";
import { OpenSourceBadge } from "@/components/ui/OpenSourceBadge";
import { SelfHostedBadge } from "@/components/ui/SelfHostedBadge";

export function BadgeExplainer() {
  const items = [
    {
      badge: <PricingBadge pricing="free" />,
      title: "Free",
      body: "No pricing gate. Usable at zero cost, no card required.",
    },
    {
      badge: <PricingBadge pricing="freemium" />,
      title: "Freemium",
      body: "A free tier to start; paid plans for scale or extra features.",
    },
    {
      badge: <PricingBadge pricing="paid" />,
      title: "Paid",
      body: "Commercial license, still often a fraction of the incumbent's bill.",
    },
    {
      badge: <OpenSourceBadge openSource />,
      title: "Open source",
      body: "Source you can audit, fork and extend without asking anyone.",
    },
    {
      badge: <SelfHostedBadge selfHosted />,
      title: "Self-hosted",
      body: "Runs on your own hardware or VPS. Your data stays yours.",
    },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
      <SectionHead
        title={
          <>
            Five signals, <span className="text-sky">one glance</span>
          </>
        }
        description="Every card in the directory uses the same five badges, so you can scan a stack of tools without opening each one."
      />
      <Reveal
        delay={100}
        className="mt-10 rounded-xl border border-line bg-pine/60 p-6 shadow-card sm:p-9"
      >
        <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.title} className="flex items-start gap-5">
              <div className="mt-0.5 shrink-0">{item.badge}</div>
              <div>
                <dt className="font-display text-[1.05rem] font-semibold text-ink">
                  {item.title}
                </dt>
                <dd className="mt-1 text-[13px] leading-relaxed text-fog">
                  {item.body}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}
