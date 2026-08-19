# HANDOFF — phase/06

**Goal:** Build the core UI component library under `components/ui/` — the design-system
primitives every later page (P7-P10) composes — rendering real data, with zero AI-slop patterns.

**Branch:** `phase/06-core-components`

**Status:** complete

**Files touched:**
- `components/ui/PricingBadge.tsx` — pill badge for `free` / `freemium` / `paid`
- `components/ui/OpenSourceBadge.tsx` — renders only when `openSource: true`
- `components/ui/SelfHostedBadge.tsx` — renders only when `selfHosted: true`
- `components/ui/ProductLogo.tsx` — deterministic monogram (slug hash → muted pastel tint, 3 sizes)
- `components/ui/GitHubStats.tsx` — compact stars/forks from `GitHubMetadata`; renders nothing when `null` (no fabrication)
- `components/ui/ProductCard.tsx` — directory card: logo, name, tagline, badges, category footer
- `components/ui/AlternativeCard.tsx` — card variant with a "Replaces …" relationship strip (max 3 + "and N more")
- `components/ui/CategoryCard.tsx` — category card with optional product count
- `components/ui/SearchBar.tsx` — client; `role="search"`, icon, clear button, submit-on-enter
- `components/ui/FilterPanel.tsx` — client; config-driven `FilterGroup[]` checkboxes with counts
- `components/ui/ComparisonTable.tsx` — feature matrix with grouped rows, sticky first column, sr-only cells
- `components/ui/Breadcrumbs.tsx` — `BreadcrumbItem[]`, `aria-current="page"`, chevron separators
- `components/ui/EmptyState.tsx` — icon, title, description, optional action link
- `components/ui/Pagination.tsx` — client; prev/next + windowed pages with ellipsis, `aria-current`
- `components/ui/index.ts` — barrel export of all 14 components + public types
- `lib/cn.ts` — dependency-free `cn` class joiner
- `lib/format.ts` — `formatCompact` (k/M number formatting for GitHubStats)

**Decisions:**
- **Design read:** developer directory/data product for technical buyers → Mode B (Google/Vercel/
  Linear-grade utility). Dials: variance 5-6, motion 3 (CSS hover/focus only, no decorative
  animation), density 6. Warm monochrome zinc tokens + single emerald accent + semantic pastel
  badges (green=free/open-source, amber=freemium, sky=self-hosted, neutral=paid) matching the
  `minimalist-ui` pastel chip spec.
- **Radius lock:** cards `rounded-lg` (8px), buttons/inputs/logo `rounded-md` (6px), tags/badges
  pill — one documented radius scale, applied everywhere. Borders 1px `var(--border)`; shadows only
  on hover and ultra-diffuse (`0 2px 8px rgba(0,0,0,0.05)`).
- **Icons:** kept `lucide-react` (P1 dependency). `design-taste-frontend` permits Lucide when the
  project already depends on it; no new dependency added (user runs installs — low-end machine rule).
  Consistent `strokeWidth={1.75}` on decorative icons.
- **No motion library:** dial 3 → CSS transitions only (`transform`/`box-shadow`/`border-color`),
  honoring reduced-motion by default. No scroll listeners, no `useState` for pointer/scroll values.
- **RSC-first:** 11 of 14 components are server components; only `SearchBar`, `FilterPanel`,
  `Pagination` are `"use client"` (isolated leaves).
- **No fabricated GitHub data:** `GitHubStats` renders nothing when `github: null` (all 181 products
  today) — exit criteria requires this to stay true until P13 sync populates it.
- **Anti-slop self-check passed:** no centered-everything, no AI-purple gradients, no default
  3-col-card-only layout, concrete data-driven copy, focus-visible rings + hover + empty states on
  every interactive surface, one accent color locked.
- **`lib/cn.ts` + `lib/format.ts` added as P6-owned** (new files, not in the P2 ownership rows);
  documented here so ownership map stays accurate.

**Verification:**
- `npx tsc --noEmit` → clean
- `npx eslint components/ui lib/cn.ts lib/format.ts` → clean (0 errors)
- `pnpm test` → 13/13 passed (existing data suite unaffected)
- Render smoke test (temporary `tests/_smoke.test.ts` + throwaway vitest config with `@/` alias)
  → 12/12 passed: ProductCard, AlternativeCard, CategoryCard, all 3 badges, ProductLogo,
  GitHubStats(null), ComparisonTable, Breadcrumbs, EmptyState, Pagination, FilterPanel, SearchBar
  all render with live `getProducts()`/`getCategories()`/`getFeatures()` data. Temp files deleted
  after the run.
- Full `next build` NOT run (heavy — user runs per AGENTS.md low-end machine rule).

**Next phase:** `phase/07-homepage` — Hero + tagline, large SearchBar, trending products,
category grid, popular SaaS→alternatives, badge explainer, contribute CTA. Composes P6 components
with live data; `generateMetadata`; dark mode correct; LCP reasonable.

**Open issues / follow-ups:**
- **Font swap:** `Inter` is the P1 base font; both design skills push Geist. layout.tsx is P1-owned
  — recommend swapping to `Geist`/`Geist Mono` via `next/font` in a later phase (P7 or P14 polish
  pass) to fully clear the "no Inter-only flatness" anti-tell.
- **Vitest `@/` alias:** vitest config (P12-owned) still lacks the `@/` resolve alias — the smoke
  test needed a throwaway config. P12 must add `resolve.alias` to `vitest.config.mts` before any
  component tests are permanent.
- **Typeform/Formbricks etc. categories:** no action — P6 touches no data files.