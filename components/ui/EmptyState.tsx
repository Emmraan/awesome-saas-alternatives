import Link from "next/link";
import { SearchX, type LucideIcon } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
  icon: Icon = SearchX,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  icon?: LucideIcon;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-edge bg-pine/40 px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-line bg-raised">
        <Icon
          className="h-5 w-5 text-dim"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{title}</h3>
        {description && (
          <p className="mx-auto mt-1.5 max-w-[52ch] text-sm leading-6 text-fog">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-9 items-center justify-center rounded-md bg-mint px-5 font-mono text-[12px] font-semibold uppercase tracking-wider text-void transition-colors hover:bg-ink"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
