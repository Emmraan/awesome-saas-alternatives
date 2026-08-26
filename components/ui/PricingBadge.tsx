import type { PricingModel } from "@/lib/types";
import { cn } from "@/lib/cn";

const styles: Record<PricingModel, string> = {
  free: "border-mint/35 bg-minttint text-mint",
  freemium: "border-sky/35 bg-skytint text-sky",
  paid: "border-coral/40 bg-coraltint text-coral",
};

const labels: Record<PricingModel, string> = {
  free: "Free",
  freemium: "Freemium",
  paid: "Paid",
};

export function PricingBadge({
  pricing,
  className,
}: {
  pricing: PricingModel;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wide leading-4",
        styles[pricing],
        className,
      )}
    >
      {labels[pricing]}
    </span>
  );
}
