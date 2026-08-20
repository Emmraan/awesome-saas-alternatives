import Link from "next/link";
import { Search } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { HeaderSearch } from "./HeaderSearch";
import { GitHubStar } from "./GitHubStar";

const NAV_LINKS = [
  { href: "/alternatives", label: "Alternatives" },
  { href: "/categories", label: "Categories" },
  { href: "/contribute", label: "Contribute" },
];

function SAMark() {
  return (
    <span
      aria-hidden="true"
      className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0a0a0a] text-[11px] font-bold tracking-tighter text-[#10b981] ring-1 ring-black/10 dark:ring-white/10"
    >
      SA
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      {/* top hairline glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent"
      />
      <div className="mx-auto flex h-[3.75rem] w-full max-w-7xl items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <SAMark />
            <span className="hidden text-[15px] font-semibold tracking-tight text-foreground sm:inline">
              SaaS Alternatives
            </span>
            <span className="hidden rounded-full border border-border bg-muted/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground md:inline-flex">
              Open source
            </span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 md:flex"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <HeaderSearch />
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Search className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <GitHubStar />
          <Link
            href="/contribute"
            className="hidden sm:inline-flex h-8 items-center rounded-full bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-sm transition-[background,transform] hover:bg-primary/90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            Add a tool
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* mobile nav */}
      <nav
        aria-label="Primary mobile"
        className="flex items-center gap-1 border-t border-border bg-background px-4 py-2 md:hidden"
      >
        {NAV_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 rounded-full bg-muted/60 px-3 py-1.5 text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}