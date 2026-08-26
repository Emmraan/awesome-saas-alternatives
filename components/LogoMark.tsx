type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 26, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="8"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.5"
      />
      <path
        d="M9 12h11m0 0-3.4-3.4M20 12l-3.4 3.4"
        stroke="var(--color-mint)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 21H12m0 0 3.4-3.4M12 21l3.4 3.4"
        stroke="var(--color-sky)"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SAMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={
        "flex h-7 w-7 items-center justify-center rounded-md bg-[#0a0a0a] text-[11px] font-bold tracking-tighter text-mint ring-1 ring-black/10 dark:ring-white/10 " +
        (className ?? "")
      }
    >
      SA
    </span>
  );
}

export function RepoWordmark() {
  return (
    <span className="font-mono text-[13px] font-semibold tracking-tight text-ink">
      <span className="text-mint">awesome</span>
      <span className="text-dim">/</span>saas-alternatives
    </span>
  );
}
