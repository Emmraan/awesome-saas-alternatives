# HANDOFF — phase/08

**Goal:** Build the `/alternatives` directory page — full product grid with
FilterPanel (pricing/hosting/license/difficulty), sorting (stars/name), pagination,
and a mobile bottom-sheet filter drawer.

**Branch:** `phase/08-directory`

**Status:** complete

**Files touched:**
- `lib/directory.ts` (new) — pure, testable directory logic, zero React: `PAGE_SIZE`,
  `DirectoryState`/`SortKey`/`FilterGroupData` types, `parseDirectoryState` (URL →
  state, tolerant of garbage), `buildDirectoryUrl` (state → URL, omits defaults),
  `filterProducts` (OR within a group, AND across groups), `sortProducts`
  (`replaces` default / `name-asc` / `name-desc` / `newest` / `stars`),
  `getFilterGroups` (facet counts computed against the OTHER active filters, so
  counts stay truthful as filters narrow), `countActiveFilters`, `toggleValue`
  (add/remove/flip + reset page to 1), `getPageCount`/`paginate`.
- `components/directory/DirectoryControls.tsx` (new, client) — single component
  owning the whole layout region: sticky desktop sidebar (FilterPanel, `lg:block`),
  toolbar row with mobile "Filters (N)" trigger + native sort `<select>`, and the
  mobile bottom sheet. All mutations navigate via `router.replace(…, { scroll: false })`
  so filters never jump the scroll. Sheet: `role="dialog" aria-modal`, Escape close,
  focus trap-ish (focus panel on open, restore trigger on close), body scroll lock,
  backdrop dismiss, "Show N results" apply button. Reduced-motion safe (no entry
  animation — intentionally static, globals.css is P1-owned).
- `components/directory/DirectoryPagination.tsx` (new, client) — thin wrapper giving
  the P6 `Pagination` an `onPageChange` that pushes a new URL (scroll to top on page
  change).
- `app/alternatives/page.tsx` (new, server) — `await searchParams`, parse → filter →
  sort → clamp page → paginate, with `redirect()` canonicalization when the requested
  page exceeds `totalPages` (stale `?page=` never lingers). Composes Breadcrumbs,
  page header, DirectoryControls (children = card grid + range caption + pagination),
  EmptyState ("No products match those filters" with clear-all link). `metadata` set.
- `tests/directory.test.ts` (new) — 20 tests covering parse (defaults, valid, garbage,
  array param, negative page), URL round-trip, filter semantics (AND across / OR within),
  all sort keys, facet-count truthfulness (counts vs other filters), toggle behaviour,
  active-count, and pagination math.

**Decisions:**
- **Server-side filtering via URL search params** (not in-browser filtering). Filter /
  sort / pagination state lives in the URL (`?pricing=free,paid&difficulty=easy&
  selfhosted=true&opensource=true&sort=name-asc&page=2`). Benefits: shareable/deep-linkable,
  back/forward works, SEO keeps the default view server-rendered, and the FilterPanel /
  Pagination stay thin presentational controls. Page renders dynamically (searchParams
  is a dynamic API) — acceptable on Vercel, consistent with "no external DB".
- **Facet counts stay truthful:** each group's option counts are computed against the
  *other* active filters (not the group's own), so a count is always "results you'd get
  adding this option". Implemented in `getFilterGroups` → `countOption`.
- **Sort default = "Most replaced"** (replaces-count desc), matching the homepage
  "Top alternatives" ranking decision in HANDOFF-07 (stars are null until P13).
- **"GitHub stars" sort is data-gated:** `showStarsSort = any(product.github?.stars != null)`.
  The option is hidden while stars are all null (P13 will populate them) so we never ship
  a sort that visibly does nothing. The sort logic itself (`sortProducts` "stars") is
  implemented and tested now.
- **Pagination:** 24/page (clean 2/3-col grid rows), P6 `Pagination` reused via a
  tiny client wrapper (server can't pass callbacks). `page` is clamped + redirected.
- **Mobile sheet kept static** (no slide-up animation): entry animation would need
  either a `useEffect`-driven state toggle (banned by `react-hooks/set-state-in-effect`)
  or a P1-owned globals.css keyframe. Static sheet + backdrop is reduced-motion-safe
  and touch friendly. Revisit animation in P14 polish if desired.
- **No component changes to P6 files** (FilterPanel/Pagination/ProductCard/EmptyState/
  Breadcrumbs used as-is, structurally-typed group data from `lib/directory.ts`).

**Verification:**
- `npx tsc --noEmit` → clean (incremental)
- `npx eslint app/alternatives lib/directory.ts components/directory tests/directory.test.ts` → 0 errors
- `npx vitest run` → 33/33 passed (13 existing data + 20 new directory tests)
- Render smoke test (temporary `tests/_smoke-directory.test.tsx` + throwaway
  `vitest.smoke.config.mts` with `@/` alias + `next/navigation` mocked) → 6/6 passed:
  DirectoryControls renders live filter groups, ProductCard renders live data,
  DirectoryPagination renders page buttons, filter semantics match URL semantics
  end-to-end, EmptyState renders, pagination slices the catalog deterministically.
  Temp files deleted after the run.
- Full `next build` NOT run (heavy — user runs per AGENTS.md low-end machine rule).
  Note: `/alternatives` is a dynamic route (searchParams) so the build emits a
  server-rendered route, not a static page — expected and fine on Vercel.

**Next phase:** `phase/09-product-detail` — `/alternatives/[slug]` (badges, links,
best-alternatives cards, feature comparison table, "why choose"), `generateStaticParams`,
404 handling, metadata + JSON-LD. ProductCard already links to `/alternatives/[slug]`
(404 until P9 lands — expected, same as `/search` until P10).

**Open issues / follow-ups:**
- **Stars sort option appears automatically once P13 populates `github.stars`.**
- **`useSearchParams` still unused site-wide** — no Suspense boundary required so far;
  P10 `/search` is the first place likely to need one (or URL-state there too).
- **P12 must add `@/` alias to `vitest.config.mts`** so permanent component tests stop
  needing throwaway configs (P8 smoke test used one again).
- **Directory page uses a mono "Filters" eyebrow on the sidebar** — counts within the
  1-per-3-sections eyebrow budget, but revisit during P14 copy/design audit.