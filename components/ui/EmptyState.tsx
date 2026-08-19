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
    <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-muted">
        <Icon
          className="h-5 w-5 text-muted-foreground"
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto mt-1 max-w-[52ch] text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}