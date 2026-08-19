import type { PricingModel } from "@/lib/types";
import { cn } from "@/lib/cn";

const styles: Record<PricingModel, string> = {
  free: "bg-emerald-50 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  freemium: "bg-amber-50 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  paid: "bg-zinc-100 text-zinc-600 dark:bg-zinc-500/15 dark:text-zinc-400",
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
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-4",
        styles[pricing],
        className,
      )}
    >
      {labels[pricing]}
    </span>
  );
}