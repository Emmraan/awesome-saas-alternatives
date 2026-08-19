# HANDOFF — phase/11

**Goal:** `/contribute` (GitHub contribution flow), `sitemap.ts`, `robots.ts`,
`llms.txt`, `lib/seo.ts` (site base URL), metadata/canonical/OG polish.
Exit criteria: sitemap valid; robots correct; metadata on every dynamic page;
no thin/duplicate SEO pages.

**Branch:** `phase/11-contribute-seo`

**Status:** complete

**Files touched:**
- `lib/seo.ts` (new) — site config + URL helpers:
  - `getSiteUrl()` reads `NEXT_PUBLIC_SITE_URL` lazily (trailing slashes
    stripped; empty when unset).
  - `getAbsoluteUrl(path)` / `getCanonicalUrl(path)` — absolute when the env is
    set, relative fallback otherwise.
  - `pageMetadata({ title, description, path })` — one helper that returns
    `title`, `description`, `alternates.canonical` (absolute) and a full
    `openGraph` block (title/description/url/siteName/locale/type). All pages
    now build metadata through it, so canonical+OG is enforced site-wide.
  - `buildWebSiteJsonLd()` — `WebSite` schema, injected once in the root layout.
  - Constants: `SITE_NAME`, `SITE_TAGLINE`, `SITE_DESCRIPTION`,
    `GITHUB_REPO_URL` (= `https://github.com/Emmraan/awesome-saas-alternatives`,
    user-confirmed) and `GITHUB_DATA_FILE_URL` (blob link to
    `data/products.json`).
- `app/sitemap.ts` (new) — `MetadataRoute.Sitemap` over 5 static pages, all 58
  category pages and all 181 product pages (product entries carry
  `lastModified: product.updatedAt`). Throws a descriptive error when
  `NEXT_PUBLIC_SITE_URL` is unset (absolute URLs are mandatory for sitemaps).
- `app/robots.ts` (new) — `allow: "/"` for all agents; `sitemap` line only when
  the site URL is configured.
- `app/llms.txt/route.ts` (new, `force-static`) — generated `text/plain` index
  per the llmstxt.org spec (H1 → blockquote → prose → `## Pages` / `## Categories`
  / `## Products` file lists → `## Optional` pointing at the JSON data file).
  Rendered from live data at build, so it can never drift from the catalog.
- `app/contribute/page.tsx` (new) — server-rendered GitHub contribution flow:
  breadcrumb, header, 4-step "How it works", the full product schema documented
  in four grouped field cards (Identity / Licensing & hosting / Taxonomy /
  Metadata), a 5-point guidelines checklist (incl. "no fabricated stats"),
  CTAs (Edit products.json, Open an issue, Browse the repository), the
  `pnpm validate-data` command, and a closing PR prompt.
- `app/opengraph-image.tsx` (new) — 1200×630 `ImageResponse` OG card (zinc-950
  + green accent tile, site name + tagline), wired via root-layout
  `openGraph.images: ["/opengraph-image"]`.
- `app/layout.tsx` (modified) — `metadataBase` from the env, site-level
  `robots` (index/follow) + `openGraph` defaults, and a `WebSite` JSON-LD
  script in the body.
- `app/page.tsx`, `app/alternatives/page.tsx`, `app/categories/page.tsx`,
  `app/search/page.tsx` (modified) — metadata now via `pageMetadata()` with
  canonical + OG.
- `app/alternatives/[slug]/page.tsx`, `app/categories/[slug]/page.tsx`
  (modified) — `generateMetadata` now returns `pageMetadata()` with the
  product/category canonical + OG.
- `lib/product-detail.ts` (modified) — `buildBreadcrumbJsonLd` `item` values
  switched to `getAbsoluteUrl(...)` (HANDOFF-09 follow-up closed).
- `tests/seo.test.ts` (new) — 10 tests: env parsing, absolute/relative URL
  fallbacks, `pageMetadata` canonical+OG, `WebSite` JSON-LD, and absolute
  product breadcrumbs with the site URL set (`vi.stubEnv`).
- `.env.local` (local, **gitignored, not committed**) — sets
  `NEXT_PUBLIC_SITE_URL=https://awesome-saas-alternatives.vercel.app` so the
  user can build locally.

**Decisions:**
- **Site URL is env-driven** (user requirement): `lib/seo.ts` reads
  `NEXT_PUBLIC_SITE_URL` lazily. No hardcoded default. `sitemap.ts` hard-errors
  without it rather than emitting relative URLs. `robots.ts` omits the sitemap
  line when unset. Root layout sets `metadataBase` from it so relative
  canonical/OG values are absolutized by Next automatically.
- **Canonical ignores query strings** on the directory, category and search
  pages — filtered/paginated listings canonicalize to their base path
  (`/alternatives`, `/categories/{slug}`, `/search`), which satisfies the
  "no duplicate SEO pages" exit criterion.
- **JSON-LD `item`/`url` now absolute** via `getAbsoluteUrl` — required by
  Schema.org breadcrumbs; the pre-existing product-detail test still passes
  (env is unset in the test runner, so it exercises the relative fallback).
- **`llms.txt` generated, not hand-maintained** — a `force-static` route handler
  renders it from `lib/data` at build. Full per-page `.md` mirrors
  (markdown-for-agents Phase 3) are deliberately out of scope for P11 — 239
  pages — so `llms.txt` links the HTML pages plus the JSON data file as the
  machine-readable source. Flagged as a follow-up.
- **OG image via `next/og`** with the default font (no network fetch at build).
  Root layout references `/opengraph-image`; each page's OG block inherits it
  through Next's metadata merge.
- **`.env.example` deferred to P13** (file ownership map) — P13 must document
  `NEXT_PUBLIC_SITE_URL` + `GITHUB_TOKEN`.

**Verification:**
- `npx tsc --noEmit` → clean (incremental)
- `npx eslint <all 15 new/modified files>` → 0 errors, 0 warnings
- `npx vitest run` → 73/73 passed (63 prior + 10 new `tests/seo.test.ts`)
- `pnpm validate-data` → ✓ 58 categories / 15 features / 181 products
- Render smoke test (temporary `tests/_smoke-p11.test.tsx` + throwaway
  `vitest.smoke.config.mts` with `@/` alias + `next/link` mock, node env +
  `react-dom/server`) → 6/6 passed: contribute page SSR (sections + repo/data
  links), `llms.txt` spec shape (245 links: 5 pages + 58 categories + 181
  products + 1 optional), sitemap (244 entries, product `lastModified`,
  error-without-env), robots (with and without site URL). Temp files deleted.
- Full `next build` NOT run (heavy — user runs per AGENTS.md low-end machine
  rule). **User must run it with `.env.local` present** so `NEXT_PUBLIC_SITE_URL`
  is set (sitemap generation requires it).

**Next phase:** `phase/12-tests` — add the `@/` alias to `vitest.config.mts`
(follow-up from HANDOFF-08/-09/-10) so route handlers and components become
testable in the main suite; grow `lib/` coverage to >= 80%.

**Open issues / follow-ups:**
- **Deployment env:** `NEXT_PUBLIC_SITE_URL` must be configured in the Vercel
  project settings (P13's `.env.example` should document it).
- **Per-page `.md` mirrors** (markdown-for-agents Phase 3) not built — 239 pages
  is a dedicated phase; `llms.txt` links HTML + JSON data for now.
- **OG image font** uses `next/og`'s default; if the user's build shows a font
  issue, load a bundled font into the `ImageResponse` options.
- **`robots` metadata** in the root layout duplicates the `/robots.txt` route
  intent — intentional (belt and braces), both allow crawling.