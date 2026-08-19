import { cn } from "@/lib/cn";

const TINTS = [
  "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200",
  "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-200",
  "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200",
  "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200",
  "bg-zinc-200 text-zinc-700 dark:bg-zinc-500/20 dark:text-zinc-200",
];

const SIZES = {
  sm: "h-8 w-8 rounded-md text-sm",
  md: "h-10 w-10 rounded-md text-base",
  lg: "h-12 w-12 rounded-md text-lg",
} as const;

function tintIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash % TINTS.length;
}

export function ProductLogo({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 select-none items-center justify-center font-semibold uppercase",
        SIZES[size],
        TINTS[tintIndex(name)],
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}