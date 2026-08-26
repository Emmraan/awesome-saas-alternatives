"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SAMark, RepoWordmark } from "./LogoMark";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/alternatives", label: "Directory" },
  { href: "/categories", label: "Categories" },
  { href: "/search", label: "Search" },
  { href: "/contribute", label: "Contribute" },
];

const GITHUB_URL = "https://github.com/Emmraan/awesome-saas-alternatives";

export function SiteHeader({ productCount }: { productCount: number }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-void/92 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 lg:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="SaaS Alternatives: home"
        >
          <SAMark className="transition-transform duration-300 group-hover:scale-105" />
          <RepoWordmark />
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`relative rounded-md px-3.5 py-2 font-mono text-[12.5px] uppercase tracking-wider transition-colors ${
                isActive(item.href)
                  ? "text-mint"
                  : "text-fog hover:bg-raised hover:text-ink"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full bg-mint"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 md:ml-4">
          <span className="hidden rounded-full border border-line bg-pine px-3 py-1 font-mono text-[10.5px] uppercase tracking-widest text-dim lg:inline-flex">
            {productCount} products
          </span>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md border border-line bg-pine px-3 py-1.5 font-mono text-[12px] text-fog transition-all hover:border-edge hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
              <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-line bg-pine p-2 font-mono text-fog transition-colors hover:text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-line bg-void px-5 py-4 md:hidden" aria-label="Mobile">
          <div className="grid gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={`rounded-lg px-4 py-3 font-mono text-[13px] uppercase tracking-wider ${
                  isActive(item.href)
                    ? "bg-minttint text-mint"
                    : "text-fog hover:bg-raised"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
