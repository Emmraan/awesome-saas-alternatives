# HANDOFF — phase/10

**Goal:** `/categories` (full hierarchy), `/categories/[slug]` (filterable grid),
`/search` (client-side, relevance-ranked, keyboard-friendly). Exit criteria:
"vercel", "self hosted analytics" and "zapier alternative" all return correct
results.

**Branch:** `phase/10-categories-search`

**Status:** complete

**Files touched:**
- `lib/search.ts` (new) — pure, testable search logic, zero React:
  - `tokenize` — lowercase, split on non-alphanumerics, drop stopwords +
    site-specific "alternative"/"alternatives" + single-char tokens.
  - `buildSearchIndex` — resolves each product into per-field lowercase
    haystacks (name, tagline, description, category display names, replaces,
    tags) so category names match words like "analytics" (not just slugs).
  - `scoreEntry` — AND semantics over all tokens (every token must match ≥1
    field) with weighted relevance: replaces=40, name exact=35 / prefix=28 /
    contains=22, category=16, tag=12, tagline=10, description=8.
  - `searchProducts` — ranks by score, then replaces-count desc, then name asc.
    Replaces outranks the product's own name on purpose: on an alternatives
    site, "vercel" should surface Coolify above Vercel.
- `lib/categories.ts` (new) — `getCategoryGroups` returns the full hierarchy:
  per top-level category, its `totalCount` (incl. descendants) and child
  `{ category, count }` list (a childless top-level exposes itself).
- `components/ui/SearchBar.tsx` (modified, P6-owned, backward compatible) —
  added optional controlled-mode props `value` + kept `onChange` (already
  added in this phase for live search); remains uncontrolled when `value` is
  omitted so `HeroSearch` is untouched.
- `components/search/SearchResults.tsx` (new, client) — source of truth is the
  URL `?q=` (`useSearchParams`); local `input` synced via the React "store the
  previous value during render" pattern (no effect, satisfies
  `react-hooks/set-state-in-effect`). Live results as you type, `router.replace`
  keeps URLs shareable + back/forward working, Enter moves focus to results,
  autofocus, EmptyStates for both empty query and no-match.
- `app/search/page.tsx` (new, server) — static shell, breadcrumbs, metadata,
  passes serialized `products`/`categories` to `SearchResults` under
  `<Suspense>` (required for `useSearchParams` during static prerender).
- `app/categories/page.tsx` (new, server) — full-hierarchy index: each
  top-level category is a section (heading links to its page, total count) with
  a `CategoryCard` grid of its children.
- `app/categories/[slug]/page.tsx` (new, server) — filterable grid reusing the
  P8 directory machinery scoped to `getProductsByCategory(slug)` (incl.
  descendants): `generateStaticParams` for all 58 slugs, contextual
  `generateMetadata`, parent + child category chips, `notFound()` on unknown
  slug, redirect canonicalization for out-of-range pages.
- `app/categories/[slug]/not-found.tsx` (new) — localized 404 via `EmptyState`.
- `lib/directory.ts` + `components/directory/DirectoryControls.tsx` +
  `components/directory/DirectoryPagination.tsx` (modified, backward
  compatible) — `buildDirectoryUrl` and the two client wrappers now accept an
  optional `basePath` (default `/alternatives`) so the category grid filters,
  sorts and paginates in-place instead of jumping to `/alternatives`.
- `tests/search.test.ts` (new) — 13 tests: tokenize (stopwords, short tokens,
  splitting), empty/stopword-only → `[]`, empty index → `[]`, and the three
  exit-criteria queries asserted against live data ("vercel" → Coolify before
  Vercel; "self hosted analytics" → exactly Matomo/OpenReplay/RudderStack;
  "zapier alternative" → n8n before Zapier), category/tag matching, and
  `scoreEntry` AND semantics.
- `tests/categories.test.ts` (new) — 4 tests: group count = top-level count,
  structural invariants (parent null, non-empty children), child counts equal
  `getProductsByCategory`, and never above the top-level total.

**Decisions:**
- **Replaces outrank name** in relevance weights. This directory's core query
  is "I want an alternative to X", so a product that replaces the searched SaaS
  beats the SaaS's own page. Verified against live data for all three exit
  queries before writing tests.
- **"alternative"/"alternatives" are stopwords.** The whole site is about
  alternatives, so the word adds no discrimination — dropping it makes
  "zapier alternative" resolve to `["zapier"]` instead of AND-matching zero
  products (n8n never mentions the word "alternative").
- **AND semantics over OR.** Every token must match at least one field, which
  makes "self hosted analytics" return *only* self-hosted analytics (Matomo,
  OpenReplay, RudderStack) rather than every analytics tool. A term with no
  match yields the no-results EmptyState, which is honest UX.
- **Category matching uses display names, not slugs.** Resolved via
  `buildSearchIndex`, so "analytics" hits "Web Analytics" / "Product
  Analytics" naturally.
- **Search is fully client-side** per the plan: the page is static, products
  (181, ~112KB serialized) are passed once to `SearchResults`, and every
  keystroke filters in the browser. `Suspense` wraps `useSearchParams`.
- **No P6 component was rewritten** — `SearchBar` gained optional
  controlled-mode props (`value`/`onChange`), `ProductCard`, `CategoryCard`,
  `EmptyState`, `Breadcrumbs`, `FilterPanel`, `Pagination` all used as-is.
  `DirectoryControls`/`DirectoryPagination`/`lib/directory.ts` got a
  backward-compatible `basePath` param instead of a category-page fork.
- **JSON-LD not extended here.** Relative-URL/absolute-site-base work stays in
  P11 (`lib/seo.ts`) as flagged in HANDOFF-09.

**Verification:**
- `npx tsc --noEmit` → clean (incremental)
- `npx eslint <all 13 new/modified files>` → 0 errors
- `npx vitest run` → 63/63 passed (13 data + 20 directory + 16 product-detail +
  10 search + 4 categories)
- `pnpm validate-data` → ✓ 58 categories / 15 features / 181 products
- Render smoke test (temporary `tests/_smoke-p10.test.tsx` + throwaway
  `vitest.smoke.config.mts` with `@/` alias, `next/link` + `next/navigation`
  mocked) → 6/6 passed: categories index hierarchy, web-analytics category
  page with Matomo, search shell with fallback, live "vercel" results showing
  Coolify, empty-query prompt, and unknown-category notFound. Temp files
  deleted after.
- Full `next build` NOT run (heavy — user runs per AGENTS.md low-end machine
  rule).

**Next phase:** `phase/11-contribute-seo` — `/contribute`, `sitemap.ts`,
`robots.ts`, `llms.txt`, `lib/seo.ts` (site base URL; switch JSON-LD
`item`/`url` values to absolute per HANDOFF-09), metadata/canonical polish.

**Open issues / follow-ups:**
- **`@/` alias still lives only in throwaway smoke configs** — P12 must add it
  to `vitest.config.mts` (noted in HANDOFF-08 and -09 too).
- **`components/home/SectionHeading` cross-import** — promoted to
  `components/ui/` during a later refactor pass (see HANDOFF-09).
- **Search relevance weights are tuned to today's data** — the three
  exit-criteria queries are asserted in `tests/search.test.ts`, so any future
  data change that breaks them fails CI rather than silently regressing UX.