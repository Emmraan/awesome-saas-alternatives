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
        "inline-flex items-center whitespace-nowrap rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium leading-4 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
        className,
      )}
    >
      Self-hosted
    </span>
  );
}