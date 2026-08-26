import Link from "next/link";
import { getProducts, getTopLevelCategories } from "@/lib/data";
import { GITHUB_REPO_URL } from "@/lib/seo";
import { RepoWordmark, SAMark } from "./LogoMark";

export function SiteFooter() {
  const products = getProducts();
  const total = products.length;
  const swaps = products.reduce((sum, p) => sum + p.replaces.length, 0);
  const top = [...products]
    .filter((p) => p.replaces.length > 0)
    .sort((a, b) => b.replaces.length - a.replaces.length)
    .slice(0, 5);
  const categories = getTopLevelCategories().slice(0, 8);

  return (
    <footer className="relative z-0 border-t border-line bg-pine/50">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="group flex w-fit items-center gap-2.5">
              <SAMark className="transition-transform duration-300 group-hover:scale-105" />
              <RepoWordmark />
            </Link>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-fog">
              A developer-focused directory mapping {total} products: paid SaaS
              and their self-hosted, open-source replacements, with {swaps}{" "}
              verified swaps.
            </p>
            <p className="mt-4 font-mono text-[11.5px] text-dim">
              <span className="text-mint">⌁</span> Data lives in GitHub, not a
              paywall.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Most swapped
            </h3>
            <ul className="mt-4 space-y-2.5">
              {top.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/alternatives/${p.slug}`}
                    className="group flex items-baseline justify-between gap-3 text-[13.5px] text-fog transition-colors hover:text-mint"
                  >
                    <span>{p.name}</span>
                    <span className="font-mono text-[10.5px] text-dim transition-colors group-hover:text-mint/70">
                      ×{p.replaces.length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Categories
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="text-[13.5px] text-fog transition-colors hover:text-mint"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
              Project
            </h3>
            <ul className="mt-4 space-y-2.5 text-[13.5px]">
              <li>
                <Link href="/alternatives" className="text-fog transition-colors hover:text-mint">
                  Directory
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-fog transition-colors hover:text-mint">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="text-fog transition-colors hover:text-mint">
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href={GITHUB_REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-fog transition-colors hover:text-mint"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.18a9.7 9.7 0 0 0-3.07 18.9c.49.09.67-.21.67-.47v-1.72c-2.77.6-3.36-1.18-3.36-1.18-.45-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.2-.25-4.51-1.1-4.51-4.9 0-1.08.39-1.96 1.02-2.65-.1-.25-.45-1.26.1-2.64 0 0 .84-.27 2.75 1.02A9.4 9.4 0 0 1 12 7.43a9.4 9.4 0 0 1 2.5.34c1.9-1.29 2.74-1.02 2.74-1.02.55 1.38.2 2.39.1 2.64.63.69 1.02 1.57 1.02 2.65 0 3.81-2.32 4.65-4.52 4.9.36.31.68.92.68 1.85v2.74c0 .26.18.57.67.47A9.7 9.7 0 0 0 12 2.18Z" />
                  </svg>
                  Repository
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-line/70 pt-6 font-mono text-[11px] text-dim sm:flex-row sm:items-center">
          <span>© 2026 awesome-saas-alternatives contributors. MIT license, PRs welcome.</span>
          <span>
            <span className="text-mint">$</span> git clone &amp; make it yours
          </span>
        </div>
      </div>
    </footer>
  );
}
