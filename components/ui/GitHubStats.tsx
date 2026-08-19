import { GitFork, Star } from "lucide-react";
import type { GitHubMetadata } from "@/lib/types";
import { formatCompact } from "@/lib/format";

export function GitHubStats({
  github,
}: {
  github: GitHubMetadata | null;
}) {
  if (!github || (github.stars === null && github.forks === null)) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      {github.stars !== null && (
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span className="tabular-nums">{formatCompact(github.stars)}</span>
        </span>
      )}
      {github.forks !== null && (
        <span className="inline-flex items-center gap-1">
          <GitFork
            className="h-3.5 w-3.5"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <span className="tabular-nums">{formatCompact(github.forks)}</span>
        </span>
      )}
    </div>
  );
}