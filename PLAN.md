# PLAN — awesome-saas-alternatives

> **Live tracker + master plan.** Every phase is a branch, a new session, and a deterministic exit criterion.
> Update this file at the end of every phase: mark `[x]`, add completion date + evidence.

## What we're building

**SaaS Alternatives** — a developer-focused, data-driven directory/discovery site that helps users find
free, open-source, self-hosted and lower-cost alternatives to popular paid SaaS.

- Tagline: *"Find open-source & free alternatives to the SaaS you already use."*
- Repo: `awesome-saas-alternatives` (public OSS, MIT)
- Deploy: Vercel (static, JSON-data-driven, **no external DB**)
- Data: full 130-row table (~170 products) encoded in `data/*.json` — GitHub is the CMS

## Non-negotiable global rules

1. **Research first, always.** Before ANY phase/task/fix: web-fetch/reference check -> find & load the
   right skill via `using-agent-skills` -> plan -> only then code. Never implement blindly.
2. **Package manager:** `pnpm`. Agent writes all deps into `package.json`; **the user runs install
   commands**. Agent never runs installs/builds that take minutes without user's go-ahead (low-end
   machine rule).
3. **Fast dev:** lint/typecheck/build/test run **only on new/modified files** (lint-staged,
   `tsc incremental`, vitest `--changed`). Never the full suite on every change.
4. **Git:** branch-per-phase `phase/NN-name`, **squash merge** to `main`, one commit per phase.
   Errors are fixed inside the same phase branch, never after merge.
5. **No fabrication:** GitHub stars/license/release metadata must be null unless fetched from GitHub API.
6. **Agent config files are committed:** `.agents/`, `.claude/`, `skills-lock.json` stay in the repo.

## Git strategy

```
main  <-- phase/00 -- merge -- phase/01 -- merge -- ... -- phase/15 -- merge
            | branch        | branch
            `- session 1    `- session 2    `- ... (each phase = new session)
```

- Branch naming: `phase/NN-name`. Merge order = numeric order.
- Each branch is cut from the latest `main` AFTER the previous merge -> conflict-free.
- Merge: `git merge --squash phase/NN-name` (clean linear history).
- Phase incomplete -> no merge. Bug -> fix in the same branch, re-verify, then merge.

## File ownership map (conflict avoidance)

| Files | Owner phase |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `skills-lock.json`, `docs/reference/product-source-list.md` | P0 |
| `package.json`, `pnpm-lock.yaml`, `next.config.*`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `components/theme*` | P1 |
| `lib/types.ts`, `lib/data.ts`, `data/categories.json`, `data/features.json`, `scripts/validate-data.ts`, `data/products.json` (placeholder) | P2 |
| `data/products.json` (batches) | P3-P5 |
| `components/ui/*` (SearchBar, Cards, Badges, GitHubStats, CategoryCard, FilterPanel, ComparisonTable, Breadcrumbs, EmptyState, Pagination) | P6 |
| `app/page.tsx` + homepage components | P7 |
| `app/alternatives/page.tsx` + `FilterPanel` | P8 |
| `app/alternatives/[slug]/` + `ComparisonTable` | P9 |
| `app/categories/**`, `app/search/` | P10 |
| `app/contribute/`, `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`, `llms.txt` | P11 |
| `tests/**`, vitest config | P12 |
| `.github/workflows/`, `scripts/sync-github.ts`, `CONTRIBUTING.md`, `.env.example`, `release.config.mjs` | P13 |
| `README.md`, `docs/**` | P14 |
| `AGENTIC_BUILD_GUIDE.md` | P15 |

## Skill load map

**Always on (Core Kit):** `loop-orchestrator` - `using-agent-skills` - `planning-and-task-breakdown` -
`incremental-implementation` - `testing` - `test-master` - `code-reviewer` - `code-simplification` -
`version-control` - `sdlc-workflow` - `forward-deployed-engineer` - `technical-writer`

**Fast-dev/base (all phases):** `repository-foundation-scaffold` (incremental tsc, lint-staged,
low-end machine rules)

**Design base (P6-P11):** `design-taste-frontend` + `minimalist-ui` — UI must never look AI-generated
(anti-slop).

| Phase | Branch | Extra skills |
|---|---|---|
| P0 | `phase/00-repo-foundation` | `open-source-project-maintainer` |
| P1 | `phase/01-scaffold` | `nextjs`, `typescript`, `tailwind-css`, `react`, `design-taste-frontend` |
| P2 | `phase/02-data-layer` | `typescript`, `frontend-core` |
| P3-P5 | `phase/03/04/05-data-products-*` | `code-documenter` |
| P6 | `phase/06-core-components` | `frontend-craft`, `design-taste-frontend`, `minimalist-ui`, `react`, `tailwind-css` |
| P7 | `phase/07-homepage` | `frontend-craft`, `minimalist-ui`, `seo`, `frontend-performance` |
| P8 | `phase/08-directory` | `frontend-core`, `frontend-craft`, `typescript` |
| P9 | `phase/09-product-detail` | `seo`, `nextjs`, `frontend-craft` |
| P10 | `phase/10-categories-search` | `seo`, `nextjs`, `frontend-core` |
| P11 | `phase/11-contribute-seo` | `seo`, `nextjs`, `markdown-for-agents` |
| P12 | `phase/12-tests` | `testing`, `test-master`, `code-reviewer` |
| P13 | `phase/13-sync-ci` | `github-actions-engineering`, `open-source-project-maintainer` |
| P14 | `phase/14-docs-release` | `technical-writer`, `code-documenter`, `code-reviewer`, `code-simplification` |
| P15 | `phase/15-agentic-build-guide` | `technical-writer` |

## Phase tracker

### P0 — Repo foundation
- **Branch:** `phase/00-repo-foundation` - **Skills:** Core + `open-source-project-maintainer` + `repository-foundation-scaffold`
- **Tasks:** `git init`, MIT `LICENSE`, `.gitignore`, `.editorconfig`, `AGENTS.md`, `CLAUDE.md`,
  `PLAN.md` (this file), `CHANGELOG.md` (placeholder), `CODE_OF_CONDUCT.md`, `SECURITY.md`,
  `.nvmrc`, `.vscode/settings.json` (watcher excludes + incremental), commit `.agents/ .claude/ skills-lock.json`
- **Exit criteria:** all files exist + valid; initial commit on `main`; git clean
- **Status:** [x] completed 2026-08-19 — all foundation files created + valid;
  committed on `phase/00-repo-foundation`, merged to `main` (fast-forward; git
  rejects squash into an empty head — see HANDOFF-00); `git status` clean. (No
  code yet, so no lint/typecheck/tests applicable.)

### P1 — Next.js scaffold + design system base
- **Branch:** `phase/01-scaffold` - **Skills:** Core + `nextjs`, `typescript`, `tailwind-css`, `react`, `design-taste-frontend`
- **Tasks:** Write `package.json` deps (Next.js, TS, Tailwind, `next-themes`, lucide-react, `lint-staged`,
  vitest, zod, `semantic-release` + changelog/git plugins). `next.config.*`, `tsconfig` (incremental, strict),
  base `layout.tsx`, `globals.css` design tokens (monochrome + green/blue accent), dark-mode base.
  **User runs `pnpm install` after this phase.**
- **Exit criteria:** package.json + configs valid; build/lint verified by user post-install
- **Status:** [x] completed 2026-08-19 — scaffold + design tokens on `phase/01-scaffold`;
  user verified `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass
  (see HANDOFF-01; eslint pinned to v9 pending upstream v10 compat).

### P2 — Data layer (types + loaders + validation)
- **Branch:** `phase/02-data-layer` - **Skills:** Core + `typescript`, `frontend-core`
- **Tasks:** `lib/types.ts` (Product, Category, Feature, enums), `lib/data.ts` (loaders),
  `data/categories.json` (full hierarchy), `data/features.json`, `scripts/validate-data.ts` (zod),
  `data/products.json` placeholder
- **Exit criteria:** `validate-data` passes on categories/features; `tsc --noEmit` clean; loader tests green
- **Status:** [x] completed 2026-08-19 — `lib/schemas.ts` (zod schemas, single source of truth),
  `lib/types.ts` (re-exports derived types), `lib/data.ts` (loaders), `data/categories.json`
  (58 categories, full hierarchy), `data/features.json` (15 features, grouped),
  `data/products.json` (empty placeholder), `scripts/validate-data.ts` (zod + cross-ref checks),
  `tests/data.test.ts` (11 loader tests). Added `tsx` devDep + `validate-data` pnpm script;
  approved `esbuild` build in `pnpm-workspace.yaml`. Verified: `pnpm validate-data` ✓
  (58 cats / 15 features / 0 products), `pnpm typecheck` clean, `pnpm test` 11/11 green
  (see HANDOFF-02).

### P3-P5 — Product data batches (~170 total)
- **Branches:** `phase/03-data-products-a`, `phase/04-data-products-b`, `phase/05-data-products-c`
- **Skills:** Core + `code-documenter`
- **Source:** `docs/reference/product-source-list.md` (canonical table — read THIS, not the ChatGPT
  conversation; it is the single source of truth for all 131 rows + ~60 unique alternatives)
- **Batches:** P3: Infrastructure/Backend/Auth/Storage/Analytics/Monitoring - P4: Automation/Communication/
  Email/Git-CI - P5: Design/Productivity/PM/Internal/AI/Security/Billing-CRM
- **Exit criteria:** `validate-data` zero errors; all alternative refs resolve; ~170 products total
- **Status:** [x] P3 completed 2026-08-19 — 78 products (51 paid + 27 alternatives) on
  `phase/03-data-products-a`: Infra/DB/Auth/Storage/Analytics/Monitoring; `validate-data` ✓ 78
  products, typecheck clean, 13/13 tests (see HANDOFF-03).
  [x] P4 completed 2026-08-19 — 40 products (29 paid + 11 alternatives) on
  `phase/04-data-products-b`: Automation/Communication/Email/Git-CI; `validate-data` ✓ 118 products
  (58 cats / 15 features), typecheck clean, 13/13 tests (see HANDOFF-04).
  [x] P5 completed 2026-08-19 — 63 products (35 paid + 28 alternatives) on
  `phase/05-data-products-c`: Design/Productivity/PM/Internal/AI/Security/Billing-CRM;
  `validate-data` ✓ 181 products (58 cats / 15 features), typecheck clean, 13/13 tests
  (see HANDOFF-05). Data phase complete.

### P6 — Core UI components
- **Branch:** `phase/06-core-components` - **Skills:** Core + `frontend-craft`, `design-taste-frontend`, `minimalist-ui`, `react`, `tailwind-css`
- **Tasks:** SearchBar, ProductCard, AlternativeCard, ProductLogo, PricingBadge, OpenSourceBadge,
  SelfHostedBadge, GitHubStats, CategoryCard, FilterPanel, ComparisonTable, Breadcrumbs, EmptyState, Pagination
- **Exit criteria:** build pass; components render with real data; no AI-slop patterns
- **Status:** [x] completed 2026-08-19 — 14 components + barrel under `components/ui/`
  (badges, ProductLogo, GitHubStats, ProductCard, AlternativeCard, CategoryCard, SearchBar,
  FilterPanel, ComparisonTable, Breadcrumbs, EmptyState, Pagination) + `lib/cn.ts` + `lib/format.ts`.
  Verified: `tsc --noEmit` clean, eslint clean, `pnpm test` 13/13, render smoke test 12/12 with
  live data (temp test + throwaway vitest alias config, deleted after). Full `next build` deferred
  to user (low-end machine rule). See HANDOFF-06.

### P7 — Homepage
- **Branch:** `phase/07-homepage` - **Skills:** Core + `frontend-craft`, `minimalist-ui`, `seo`, `frontend-performance`
- **Tasks:** Hero + tagline, large search bar, trending products, category grid, popular SaaS->alternatives,
  badge explainer section, contribute CTA
- **Exit criteria:** homepage renders with live data; `generateMetadata` set; dark mode correct; LCP reasonable
- **Status:** [x] completed 2026-08-19 — homepage composed of 6 server-rendered sections on
  `phase/07-homepage` (Hero + large SearchBar + stats, SwappableSaaS, TopAlternatives,
  CategoryGrid, BadgeExplainer, ContributeCta) plus site chrome (`SiteHeader`, `SiteFooter`,
  `ThemeToggle`) wired into the root layout; swapped Inter→Geist/Geist Mono (HANDOFF-06 open
  issue, P1-owned files changed with approval). Verified: `tsc` clean, eslint clean,
  `pnpm test` 13/13, render smoke test 8/8 with live data (temp files deleted). Full
  `next build` deferred to user (low-end machine rule). See HANDOFF-07.

### P8 — Directory page (`/alternatives`)
- **Branch:** `phase/08-directory` - **Skills:** Core + `frontend-core`, `frontend-craft`, `typescript`
- **Tasks:** full grid, FilterPanel (pricing/hosting/license/difficulty), sorting (stars/name), pagination,
  mobile bottom-sheet filters
- **Exit criteria:** filters + sort + pagination work; mobile drawer works; build passes
- **Status:** [x] completed 2026-08-19 — `/alternatives` on `phase/08-directory`: server-rendered
  grid with URL-driven filters (pricing/hosting/license/difficulty), sort (replaces/name/newest/
  stars), 24-per-page pagination + redirect canonicalization, sticky desktop FilterPanel sidebar,
  mobile bottom-sheet drawer (dialog semantics, Escape, focus restore, scroll lock). Logic lives in
  `lib/directory.ts` (pure, tested); thin client wrappers (`DirectoryControls`, `DirectoryPagination`)
  reuse P6 FilterPanel/Pagination untouched. Verified: `tsc` clean, eslint clean, `pnpm test`
  33/33 (20 new directory tests), render smoke test 6/6 with live data (temp files deleted).
  Full `next build` deferred to user (low-end machine rule). See HANDOFF-08.

### P9 — Product detail + comparison
- **Branch:** `phase/09-product-detail` - **Skills:** Core + `seo`, `nextjs`, `frontend-craft`
- **Tasks:** `/alternatives/[slug]` (badges, links, best-alternatives cards, feature comparison table,
  "why choose"), `generateStaticParams`, 404 handling, metadata + JSON-LD
- **Exit criteria:** all seeded products generate pages; comparison table correct; SEO metadata present
- **Status:** [x] completed 2026-08-19 — `/alternatives/[slug]` on `phase/09-product-detail`:
  `lib/product-detail.ts` (pure logic + JSON-LD builders, all 115 replaced names
  resolve to catalog products), 5 server components under `components/product/`
  (header w/ badges+links, replaces, best-alternatives, comparison, why-choose),
  static params for all 181 products, segment `not-found.tsx`, contextual
  `generateMetadata` (title/description/OG). Verified: `tsc` clean, eslint clean,
  `pnpm test` 49/49 (16 new), `pnpm validate-data` ✓, render smoke test 6/6 with
  live data (temp files deleted). Full `next build` deferred to user (low-end
  machine rule). See HANDOFF-09.

### P10 — Categories + search
- **Branch:** `phase/10-categories-search` - **Skills:** Core + `seo`, `nextjs`, `frontend-core`
- **Tasks:** `/categories`, `/categories/[slug]` (filterable grid), `/search` (client-side over
  name/desc/tags/category/alternatives, keyboard-friendly)
- **Exit criteria:** "vercel", "self hosted analytics", "zapier alternative" queries return correct results
- **Status:** [x] completed 2026-08-19 — on `phase/10-categories-search`: `lib/search.ts`
  (tokenize + stopwords incl. "alternative(s)", per-field index, AND-semantics
  relevance: replaces>name>category>tag>tagline>description) and `lib/categories.ts`
  (`getCategoryGroups` full hierarchy + counts); `/categories` index (grouped by
  top-level with child CategoryCards), `/categories/[slug]` filterable grid
  (reuses P8 directory machinery via a new backward-compatible `basePath` on
  `buildDirectoryUrl`/`DirectoryControls`/`DirectoryPagination`; static params
  for all 58 slugs, segment not-found), `/search` (static page + client
  `SearchResults` under Suspense: live relevance-ranked filtering, URL-driven,
  keyboard-friendly). `SearchBar` gained optional controlled `value`/`onChange`.
  Verified: `tsc` clean, eslint clean on all 13 files, `pnpm test` 63/63
  (10 search + 4 categories new, incl. all three exit-criteria queries),
  `pnpm validate-data` ✓ 181, render smoke test 6/6 (temp files deleted).
  Full `next build` deferred to user (low-end machine rule). See HANDOFF-10.

### P11 — Contribute page + SEO pass
- **Branch:** `phase/11-contribute-seo` - **Skills:** Core + `seo`, `nextjs`, `markdown-for-agents`
- **Tasks:** `/contribute` (GitHub contribution flow), `sitemap.ts`, `robots.ts`, `llms.txt`,
  metadata polish, canonical/OG everywhere
- **Exit criteria:** sitemap valid; robots correct; metadata on every dynamic page; no thin/duplicate SEO pages
- **Status:** [x] completed 2026-08-19 — on `phase/11-contribute-seo`: `lib/seo.ts`
  (env-driven `NEXT_PUBLIC_SITE_URL`, absolute URL helpers, `pageMetadata()`,
  WebSite JSON-LD, GitHub repo/data-file URLs), `app/sitemap.ts` (5 static +
  58 category + 181 product pages, hard-error without env), `app/robots.ts`,
  `app/llms.txt/route.ts` (generated spec-shaped text index), `/contribute`
  (4-step flow, full schema docs, guidelines, CTAs), `app/opengraph-image.tsx`,
  root layout `metadataBase` + site OG/robots + WebSite JSON-LD, canonical + OG
  via `pageMetadata()` on every page, absolute breadcrumb JSON-LD items.
  Verified: `tsc` clean, eslint 0/0 on all 15 files, `pnpm test` 73/73 (10 new
  seo tests), `pnpm validate-data` ✓ 181, render smoke test 6/6 (temp files
  deleted). `.env.local` (gitignored) created with `NEXT_PUBLIC_SITE_URL`;
  `.env.example` deferred to P13. Full `next build` deferred to user (low-end
  machine rule) — must run with `.env.local` present. See HANDOFF-11.

### P12 — Tests + quality gate
- **Branch:** `phase/12-tests` - **Skills:** Core (testing-heavy)
- **Tasks:** Vitest suite: data validation, alternative relationships, search, GitHub metadata parsing,
  key component renders; coverage of `lib/`
- **Exit criteria:** `pnpm test` green; `lib/` coverage >= 80%
- **Status:** [x] completed 2026-08-20 — on `phase/12-tests`: closed the P12
  follow-up from HANDOFF-11 (`@/` alias in `vitest.config.mts`, `.tsx` include,
  v8 coverage w/ 80% thresholds on `lib/`); added `@vitest/coverage-v8` + 
  `test:coverage` script; 3 new test files (45 tests): `tests/schemas.test.ts`
  (data validation + GitHub metadata parsing, 20), `tests/format.test.ts`
  (`formatCompact`/`cn`, 7), `tests/components.test.tsx` (key UI renders via
  `renderToString` + mocked `next/link`, 18). Verified: `pnpm test` 118/118,
  `tsc` clean, eslint 0/0, coverage `lib/` Statements 98.62% / Branches 91.93% /
  Functions 100% / Lines 98.91% (gate >= 80% ✓). See HANDOFF-12.

### P13 — GitHub sync + CI + contribution flow
- **Branch:** `phase/13-sync-ci` - **Skills:** Core + `github-actions-engineering`, `open-source-project-maintainer`
- **Tasks:** `scripts/sync-github.ts` (stars/forks/license/release, idempotent, `GITHUB_TOKEN`),
  `.env.example`, `.github/workflows/validate.yml` (lint + typecheck + test + validate-data on PR,
  path-filtered), `.github/workflows/release.yml` (semantic-release on push to main), `release.config.mjs`,
  `CONTRIBUTING.md`
- **Exit criteria:** sync script runs twice safely; CI workflow syntax valid; CONTRIBUTING complete;
  release config valid (npm publish off, changelog + git plugins)
- **Status:** [ ] pending

### P14 — Docs + release polish
- **Branch:** `phase/14-docs-release` - **Skills:** Core + `technical-writer`, `code-documenter`, `code-reviewer`, `code-simplification`
- **Tasks:** README (what/features/stack/dev/contribute/deploy-on-Vercel/roadmap), `docs/` handoffs,
  final code-review pass + simplification, version tag
- **Exit criteria:** README complete; no blocking review findings; full test+build+lint green on main
- **Status:** [ ] pending

### P15 — Agentic build guide
- **Branch:** `phase/15-agentic-build-guide` - **Skills:** Core + `technical-writer`
- **Tasks:** **`AGENTIC_BUILD_GUIDE.md`** — pura build flow report/guide: intake, skills selection,
  phases, branches, merge strategy, handoffs, maintenance, CHANGELOG/semantic-release setup —
  reusable for future projects, improvable over time
- **Exit criteria:** guide complete; user review; covers CHANGELOG.md generation via semantic-release
- **Status:** [ ] pending

## Session handoff protocol

At the end of every phase, write `docs/handoffs/HANDOFF-NN.md` on the same branch:

```
# HANDOFF — phase/0N
Goal: <phase goal>
Branch: <branch name>
Status: complete | blocked
Files touched: <list>
Decisions: <key decisions>
Verification: <exit criteria evidence - tests/build output>
Next phase: phase/0M - <1-line brief>
Open issues / follow-ups: <list>
```

Then mark the phase `[x]` in this file. Next session reads: `PLAN.md` -> `AGENTS.md` ->
`docs/handoffs/HANDOFF-NN.md`, cuts the next branch from latest `main`, and implements.

## CHANGELOG.md strategy

- Single repo -> **semantic-release** (https://github.com/semantic-release/semantic-release).
- `release.config.mjs` uses `@semantic-release/changelog` + `@semantic-release/git`; npm publish disabled.
- Runs via `.github/workflows/release.yml` on push to `main`; squash-merge PRs produce one conventional
  commit per phase, so version + CHANGELOG auto-generate.
- PRs must follow Conventional Commits (enforced via PR template + CONTRIBUTING.md).
- Documented in `AGENTIC_BUILD_GUIDE.md` (P15).
- changesets (https://github.com/changesets/changesets) is the monorepo alternative - not used here.

## Delivery order recap

```
P0 foundation -> P1 scaffold -> P2 data layer -> P3-5 data batches -> P6 components
-> P7 homepage -> P8 directory -> P9 product -> P10 cat/search -> P11 SEO
-> P12 tests -> P13 sync/CI -> P14 docs/release -> P15 agentic-build-guide -> final main
```

Every phase = new session = new branch = merge to main before the next.