import { PricingBadge } from "@/components/ui/PricingBadge";
import { OpenSourceBadge } from "@/components/ui/OpenSourceBadge";
import { SelfHostedBadge } from "@/components/ui/SelfHostedBadge";
import { SectionHeading } from "./SectionHeading";

const ITEMS = [
  {
    badge: <PricingBadge pricing="free" />,
    title: "Free",
    description: "No pricing gate — usable at zero cost, no card required.",
  },
  {
    badge: <PricingBadge pricing="freemium" />,
    title: "Freemium",
    description: "A free tier to start; paid plans for scale or extra features.",
  },
  {
    badge: <PricingBadge pricing="paid" />,
    title: "Paid",
    description: "Commercial license — still often a fraction of the incumbent's bill.",
  },
  {
    badge: <OpenSourceBadge openSource />,
    title: "Open source",
    description: "Source you can audit, fork and extend without asking anyone.",
  },
  {
    badge: <SelfHostedBadge selfHosted />,
    title: "Self-hosted",
    description: "Runs on your own hardware or VPS — your data stays yours.",
  },
];

export function BadgeExplainer() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <SectionHeading
          eyebrow="How to read the badges"
          title="Five signals, one glance"
          description="Every card in the directory uses the same five badges, so you can scan a stack of tools without opening each one."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div>{item.badge}</div>
              <h3 className="mt-3 text-sm font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}