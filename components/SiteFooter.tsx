import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div>
          <p className="text-sm font-semibold text-foreground">
            SaaS Alternatives
          </p>
          <p className="mt-1 max-w-xs text-xs leading-5 text-muted-foreground">
            A community directory of open-source, free and self-hosted tools
            that replace the SaaS you already pay for.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/alternatives"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Browse all alternatives
          </Link>
          <Link
            href="/contribute"
            className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Add a tool
          </Link>
        </div>
        <p className="text-xs text-muted-foreground">
          MIT licensed · data lives in this repo, GitHub is the CMS
        </p>
      </div>
    </footer>
  );
}