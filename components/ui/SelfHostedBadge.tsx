import { cn } from "@/lib/cn";

export function SelfHostedBadge({
  selfHosted,
  className,
}: {
  selfHosted: boolean;
  className?: string;
}) {
  if (!selfHosted) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border border-edge bg-raised px-2.5 py-0.5 font-mono text-[10.5px] font-medium uppercase tracking-wide leading-4 text-fog",
        className,
      )}
    >
      Self-hosted
    </span>
  );
}
