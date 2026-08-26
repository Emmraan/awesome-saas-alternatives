import { cn } from "@/lib/cn";

const TINTS = [
  "bg-minttint text-mint",
  "bg-skytint text-sky",
  "bg-coraltint text-coral",
  "bg-raised text-fog",
  "bg-moss text-dim",
];

const SIZES = {
  sm: "h-8 w-8 rounded-md text-sm",
  md: "h-10 w-10 rounded-md text-base",
  lg: "h-12 w-12 rounded-lg text-lg",
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
        "flex shrink-0 select-none items-center justify-center border border-line font-semibold uppercase",
        SIZES[size],
        TINTS[tintIndex(name)],
        className,
      )}
    >
      {name.charAt(0)}
    </span>
  );
}
