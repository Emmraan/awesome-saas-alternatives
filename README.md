# SaaS Alternatives

> **Find open-source & free alternatives to the SaaS you already use.**

A developer-focused directory that maps **181 products** — paid SaaS and their self-hosted, open-source and lower-cost alternatives — across **58 categories** and **15 feature dimensions**. Static, JSON-driven, no external DB. GitHub is the CMS.

- **Live site:** `https://awesome-saas-alternatives.vercel.app` (set `NEXT_PUBLIC_SITE_URL` when you deploy your own)
- **Stack:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Zod · Vitest
- **License:** [MIT](LICENSE)

![Hero section — open-source alternatives](https://res.cloudinary.com/dxqqsk0xm/image/upload/v1787247220/e83fc0cf-3f24-432e-bf73-d65f5d8b61ce.png)

---

## Table of contents

- [What this is](#what-this-is)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Quick start](#quick-start)
- [Project structure](#project-structure)
- [Data model](#data-model)
- [Directory, search & SEO](#directory-search--seo)
- [Available scripts](#available-scripts)
- [Tests & quality gate](#tests--quality-gate)
- [GitHub sync](#github-sync)
- [Deploying on Vercel](#deploying-on-vercel)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## What this is

Every team pays for the same handful of SaaS — Vercel, Zapier, Notion, Datadog, Auth0 — even though a mature open-source alternative exists for most of them. This site makes the swap obvious:

- **Paid SaaS → alternatives** — each paid product lists its verified open-source/self-hosted replacements (e.g. Vercel → Coolify, Zapier → n8n, Notion → AppFlowy / AFFiNE).
- **Alternative → who it replaces** — each alternative shows the paid tools it replaces, a feature comparison table, and “why choose it” facts.
- **Browse by category or search** — 58 categories in a hierarchy (Infrastructure → Serverless, etc.) and a relevance-ranked search over names, descriptions, tags and the `replaces` graph.

The whole catalog lives in `data/products.json` (181 entries), validated by Zod and cross-reference checks. No database, no CMS — open a PR against the JSON file to contribute.

## Features

- **Homepage** — hero with live stats, popular SaaS → alternatives pairs, top alternatives by “most replaced”, category grid, badge explainer and contribute CTA.
- **Directory (`/alternatives`)** — filterable, sortable, paginated grid. Filters: pricing (free/freemium/paid), difficulty (easy/medium/hard), self-hostable, open-source. Sort: most replaced / name / newest / stars. Pagination 24 per page, URL-driven, mobile drawer.
- **Product pages (`/alternatives/[slug]`)** — badges (pricing, hosting, license, difficulty), external links, “replaces” links, best-alternatives cards, feature comparison table, JSON-LD (`SoftwareApplication` + `BreadcrumbList`), `generateStaticParams` for all 181 products.
- **Categories (`/categories`, `/categories/[slug]`)** — grouped index by top-level category, per-category filterable grid (reuses directory machinery), static params for all 58 slugs.
- **Search (`/search`)** — client-side, tokenised, stop-word aware, weighted relevance (`replaces` > name > category > tag > tagline > description) with AND semantics.
- **Contribute (`/contribute`)** — four-step GitHub flow, schema docs, guidelines and CTAs.
- **SEO pass** — `sitemap.ts` (5 static + 58 category + 181 product URLs), `robots.ts`, `llms.txt`, `opengraph-image.tsx`, canonical + OG via `lib/seo.ts` on every page, `WebSite` JSON-LD on the layout.
- **Design system** — Tailwind CSS v4 tokens, Geist + Geist Mono, `next-themes` dark mode, monochrome + emerald/blue accents, minimal anti-slop UI.
- **Data quality** — Zod schemas as single source of truth, cross-reference validation, idempotent GitHub metadata sync that never fabricates numbers.

## Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 16 (App Router) | Static generation, `generateStaticParams`, `generateMetadata` |
| Language | TypeScript 5.9 (strict, incremental) | `tsc --noEmit` on changed files |
| Styling | Tailwind CSS v4 + PostCSS | `@import "tailwindcss"`, CSS variables, `@theme inline`, `next/font` |
| Themes | `next-themes` | `class` attribute, system preference |
| Validation | Zod 4 | `lib/schemas.ts` → `scripts/validate-data.ts` |
| Testing | Vitest 4 + `@vitest/coverage-v8` | 143 tests, `lib/` coverage ≥ 80% |
| Linting | ESLint 9 + `eslint-config-next` | `lint-staged` on staged `*.{ts,tsx}` |
| Release | `semantic-release` + changelog/git/github plugins | Runs on push to `main`, npm publish off |
| Package manager | pnpm 11.22 | `packageManager` field + `pnpm-workspace.yaml` |
| Runtime | Node 22 (`≥22.14`, see `.nvmrc`) | Vercel + local |

## Quick start

### Prerequisites

- **Node.js 22+** — use the version pinned in `.nvmrc` (e.g. `nvm use` or `fnm use`).
- **pnpm 11.22+** — `corepack enable` is recommended.

### Install and run

```sh
# 1. Clone and install
git clone https://github.com/Emmraan/awesome-saas-alternatives.git
cd awesome-saas-alternatives
pnpm install

# 2. Configure the site URL (required for sitemap / canonicals / build)
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_SITE_URL to your URL:
# NEXT_PUBLIC_SITE_URL=http://localhost:3000  (dev)
# NEXT_PUBLIC_SITE_URL=https://awesome-saas-alternatives.vercel.app  (prod)

# 3. Start the dev server
pnpm dev
# → http://localhost:3000
```

> `.env.example` also documents `GITHUB_TOKEN` for the GitHub sync script. See [GitHub sync](#github-sync).

### Useful commands

| Command | What it does |
|---|---|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build (needs `NEXT_PUBLIC_SITE_URL`) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint over the whole repo |
| `pnpm typecheck` | TypeScript type-check (incremental) |
| `pnpm test` | Vitest suite |
| `pnpm test:coverage` | Tests + `lib/` coverage gate (≥ 80%) |
| `pnpm validate-data` | Validate `data/*.json` against Zod schemas |
| `pnpm sync:github` | Refresh GitHub stars/forks/license/release |

## Project structure

```
app/                Next.js App Router — layout, pages, sitemap/robots/llms.txt/OG
  alternatives/      Directory + [slug] product pages (comparison, JSON-LD)
  categories/        Index + [slug] filtered grids
  search/            Client-side search page (Suspense)
  contribute/        Contribution flow page
  api/               (none — fully static)
components/
  ui/                ProductCard, AlternativeCard, badges, SearchBar, FilterPanel,
                     ComparisonTable, Breadcrumbs, EmptyState, Pagination, …
  home/              Hero, SwappableSaaS, TopAlternatives, CategoryGrid, …
  product/           Header, ReplacesSection, AlternativesSection, ComparisonSection
  directory/         DirectoryControls, DirectoryPagination (thin client wrappers)
  SiteHeader.tsx / SiteFooter.tsx / ThemeToggle.tsx
lib/
  schemas.ts         Zod schemas — single source of truth
  types.ts           Re-exports derived TS types
  data.ts            Loaders + helpers (getProducts, getCategories, searchProducts, …)
  directory.ts       Filter/sort/pagination + URL state (pure, tested)
  search.ts          Tokenize + weighted relevance search (pure, tested)
  product-detail.ts  Replaces/alternatives/comparison + JSON-LD builders
  categories.ts      Category groups + counts
  seo.ts             Site URL, pageMetadata(), WebSite JSON-LD
  format.ts / cn.ts  Formatting + tailwind-merge helper
data/
  products.json      181 products (115 paid SaaS + 66 alternatives)
  categories.json    58 categories (17 top-level + 41 children)
  features.json      15 features in 8 groups
scripts/
  validate-data.ts   Zod + cross-reference validation (categories, features, replaces)
  sync-github.ts     CLI — fetches GitHub metadata
  sync-github-core.ts Pure helpers (staleness, mapping, byte-exact serializer)
tests/               Vitest suite — data, lib/*, components, sync core
.github/workflows/
  validate.yml       PR checks: install → lint → typecheck → test:coverage → validate-data
  release.yml        Push-to-main → semantic-release
```

Project structure follows a clear separation of `app`, `components`, `lib`, `data` and `scripts`.

## Data model

`lib/schemas.ts` defines everything. Key shapes:

**Category** — `{ slug, name, description, parent: slug | null }` — flat hierarchy (58 entries).

**Feature** — `{ id, name, description, group }` — 15 entries across `deployment`, `integration`, `security`, …

**Product** — `{ slug, name, tagline, description, website, repo: "owner/name" | null, license, openSource, selfHosted, pricing: "free" | "freemium" | "paid", difficulty: "easy" | "medium" | "hard", categories: slug[], replaces: string[], features: slug[], tags: string[], github, createdAt, updatedAt, status }`.

Rules enforced by `scripts/validate-data.ts`:

- `slug` is kebab-case and unique.
- `categories` / `features` must reference existing slugs/ids.
- `replaces` entries must match an existing product `name` (case-insensitive).
- `github` is `null` in PRs — populated only by `pnpm sync:github` via the GitHub API (no fabrication).

Adding a product:

```json
{
  "slug": "coolify",
  "name": "Coolify",
  "tagline": "Open-source, self-hostable PaaS",
  "description": "Self-host your apps, databases and services on your own servers.",
  "website": "https://coolify.io",
  "repo": "coollabsio/coolify",
  "license": "Apache-2.0",
  "openSource": true,
  "selfHosted": true,
  "pricing": "free",
  "difficulty": "medium",
  "categories": ["cloud-hosting", "serverless"],
  "replaces": ["Vercel", "Netlify"],
  "features": ["self-hosted", "open-source", "docker"],
  "tags": ["paas", "deployment"],
  "github": null,
  "createdAt": "2026-08-19T00:00:00.000Z",
  "updatedAt": "2026-08-19T00:00:00.000Z",
  "status": "active"
}
```

Validate locally before pushing: `pnpm validate-data`.

Full contribution flow — see [CONTRIBUTING.md](CONTRIBUTING.md) and [/contribute](https://awesome-saas-alternatives.vercel.app/contribute).

## Directory, search & SEO

- **Directory state** is URL-driven (`?pricing=free,freemium&difficulty=easy&selfhosted=true&sort=stars&page=2`). `lib/directory.ts` exports `parseDirectoryState`, `buildDirectoryUrl`, `filterProducts`, `sortProducts`, `getFilterGroups`, `countOption` (counts shown in the filter panel are contextual — they ignore the group being counted), `paginate`.
- **Search** (`lib/search.ts`) — `tokenize` lowercases, splits on `[^a-z0-9]+`, drops tokens < 2 chars and a stopword set (including “alternative/alternatives”). `scoreEntry` weights fields: `replaces` 40 > name 35/28/22 > category 16 > tag 12 > tagline 10 > description 8. AND semantics across tokens; ties broken by `replaces.length` then name.
- **SEO** (`lib/seo.ts`) — `getSiteUrl()` reads `NEXT_PUBLIC_SITE_URL` (empty string locally is handled gracefully; `sitemap.ts` hard-errors without it so deploys never ship a broken sitemap). `pageMetadata()` sets `canonical` + `openGraph`; breadcrumbs emit absolute URLs.

## Available scripts

See [`package.json`](package.json) `scripts`. All scripts go through `pnpm`; the agent writes `package.json` but you run installs/builds (low-end machine rule — no heavy builds in CI without opt-in).

## Tests & quality gate

```sh
pnpm test           # 143 tests — data, directory, search, categories,
                    # product-detail, schemas, format, components, sync-github
pnpm test:coverage  # v8, include lib/**, thresholds 80/80/80/80
pnpm typecheck      # tsc --noEmit (incremental)
pnpm lint           # eslint on all files; lint-staged on staged files
pnpm validate-data  # zod + cross-refs — 58 / 15 / 181 ✓
```

Coverage is gated at **≥ 80%** on `lib/` (statements, branches, functions, lines). The PR workflow [`validate.yml`](.github/workflows/validate.yml) enforces `test:coverage` — PRs cannot merge below the gate.

## GitHub sync

GitHub stars/forks/license/release are populated from the live GitHub API, not invented.

```sh
# One-time: create a PAT at https://github.com/settings/tokens (no scopes needed)
# Add it to .env.local as GITHUB_TOKEN=...

# Refresh all stale products (> 24h), one API call per product (repo + release)
pnpm sync:github

# Common flags
pnpm sync:github -- --limit 1          # sync one product (useful for testing)
pnpm sync:github -- --force            # re-fetch everything, ignore freshness
pnpm sync:github -- --max-age-hours 6  # custom freshness window
```

Details:

- Pure helpers live in `scripts/sync-github-core.ts` (`isGithubStale`, `selectReposToSync`, `mapRepoResponse`, `serializeValue`); IO/env lives in `scripts/sync-github.ts`.
- The serializer is byte-exact to the hand-authored `data/products.json` layout, so diffs are tiny (only the changed `github` block).
- Without a token you get 60 requests/hour; with a token, 5000/hour. The catalog is ~60 repos × 2 calls.

## Deploying on Vercel

This is a fully static site — no database, no server.

1. Push the repository to GitHub.
2. Import it in [Vercel](https://vercel.com/new) — framework preset **Next.js** is detected automatically.
3. Set the environment variable:

   | Name | Value | Where |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://your-domain.vercel.app` | Vercel → Project → Settings → Environment Variables (Production + Preview) |

   Locally this lives in `.env.local`; see [`.env.example`](.env.example).

4. Deploy. Vercel runs `next build` — `app/sitemap.ts` will error if the URL is missing, so a mis-configured deploy fails fast.

No other infrastructure is required. `next build` is the only heavy command; CI intentionally does not run it (lint/typecheck/tests cover correctness).

## Roadmap

What’s shipped and what’s next.

- **Done (P0–P13):** repo foundation, Next.js scaffold + design tokens, data layer + Zod validation, 181 products across 58 categories / 15 features, core UI components, homepage / directory / product / categories / search / contribute pages, full SEO pass (sitemap, robots, `llms.txt`, OG), 143 tests with `lib/` ≥ 80% gate, GitHub sync script + CI + `CONTRIBUTING.md` + `semantic-release` config.
- **This phase (P14):** README, docs polish, final review + simplification pass.
- **Future ideas:** richer comparisons (pricing tables, deploy guides), user-submitted “I switched from X to Y” notes, periodic GitHub-metadata refresh via scheduled workflow, and — once the dataset grows — a lightweight API route for the catalog.

## Contributing

Contributions are welcome — especially new products.

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) (setup, tested-PR rule, Conventional Commits).
2. Add or edit `data/products.json` (see [Data model](#data-model)).
3. Run `pnpm validate-data`, `pnpm lint`, `pnpm typecheck`, `pnpm test`.
4. Open a PR against `main` — CI runs validation automatically.

Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and the disclosure process in [SECURITY.md](SECURITY.md) for vulnerabilities.

## License

[MIT](LICENSE) — copyright 2026 awesome-saas-alternatives contributors.

## Acknowledgements

- Product inventory seeded from a curated table of 131 paid products and ~60 unique alternatives.
- Built with the `.agents/skills` skill system and a branch-per-phase workflow — each phase ships via a squash-merge with one Conventional Commit.
- Changelog is auto-generated by `semantic-release` — do not edit [`CHANGELOG.md`](CHANGELOG.md) by hand.

