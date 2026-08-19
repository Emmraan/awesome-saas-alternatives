import { cn } from "@/lib/cn";

export function OpenSourceBadge({
  openSource,
  className,
}: {
  openSource: boolean;
  className?: string;
}) {
  if (!openSource) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium leading-4 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
        className,
      )}
    >
      Open source
    </span>
  );
}