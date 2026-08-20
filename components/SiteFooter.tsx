import Link from "next/link";
import { Star } from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Directory",
    links: [
      { label: "All alternatives", href: "/alternatives" },
      { label: "Categories", href: "/categories" },
      { label: "Search", href: "/search" },
    ],
  },
  {
    title: "Contribute",
    links: [
      { label: "Add a tool", href: "/contribute" },
      { label: "Contribution guide", href: "/contribute" },
      { label: "Validate data", href: "https://github.com/Emmraan/awesome-saas-alternatives#data-model" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/Emmraan/awesome-saas-alternatives" },
      { label: "Report an issue", href: "https://github.com/Emmraan/awesome-saas-alternatives/issues" },
      { label: "Discussions", href: "https://github.com/Emmraan/awesome-saas-alternatives/discussions" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "MIT License", href: "/LICENSE" },
      { label: "Code of Conduct", href: "https://github.com/Emmraan/awesome-saas-alternatives/blob/main/CODE_OF_CONDUCT.md" },
      { label: "Security", href: "https://github.com/Emmraan/awesome-saas-alternatives/blob/main/SECURITY.md" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span
                aria-hidden="true"
                className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0a0a0a] text-[11px] font-bold tracking-tighter text-[#10b981] ring-1 ring-black/10 dark:ring-white/10"
              >
                SA
              </span>
              <span className="text-sm font-semibold tracking-tight text-foreground">
                SaaS Alternatives
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                Open source
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
              A community directory of 181 open-source, free and self-hosted
              tools that replace the SaaS you already pay for. Data lives in
              this repo — GitHub is the CMS.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://github.com/Emmraan/awesome-saas-alternatives"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="GitHub repository"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/intent/tweet?text=Find%20open-source%20alternatives%20to%20the%20SaaS%20you%20already%20use%20—%20https%3A%2F%2Fawesome-saas-alternatives.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                aria-label="Share on X"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  <path d="M18.9 2H22l-6.93 7.93L23.25 22h-6.31l-4.94-6.46L6.35 22H3.25l7.41-8.47L2.78 2h6.45l4.47 5.9L18.9 2Zm-1.1 18h1.73L6.05 3.9H4.2L17.8 20Z" />
                </svg>
              </a>
              <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
                MIT licensed
              </span>
            </div>
          </div>

          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p>© 2026 SaaS Alternatives contributors. Built with Next.js + Tailwind — PRs welcome.</p>
          <p className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Data lives in this repo, GitHub is the CMS
          </p>
        </div>
      </div>
    </footer>
  );
}