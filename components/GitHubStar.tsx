import { Star } from "lucide-react";
import { getProducts } from "@/lib/data";

export function GitHubStar() {
  const products = getProducts();
  const totalStars = products.reduce((sum, p) => sum + (p.github?.stars ?? 0), 0);
  const hasStars = totalStars > 0;
  const display = hasStars
    ? totalStars >= 1000
      ? `${(totalStars / 1000).toFixed(1)}k`
      : String(totalStars)
    : null;

  return (
    <a
      href="https://github.com/Emmraan/awesome-saas-alternatives"
      target="_blank"
      rel="noreferrer"
      aria-label="View on GitHub"
      className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-zinc-300 hover:text-foreground dark:hover:border-zinc-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Star className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span>GitHub</span>
      {display && (
        <>
          <span className="h-3 w-px bg-border" aria-hidden="true" />
          <span className="tabular-nums">{display}</span>
        </>
      )}
    </a>
  );
}
