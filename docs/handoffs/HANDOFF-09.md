# HANDOFF — phase/09

**Goal:** Build the `/alternatives/[slug]` product detail page — badges, links,
best-alternatives cards, feature comparison table, "why choose" section,
`generateStaticParams`, 404 handling, metadata + JSON-LD.

**Branch:** `phase/09-product-detail`

**Status:** complete

**Files touched:**
- `lib/product-detail.ts` (new) — pure, testable product-page logic, zero React:
  `getReplacedProducts` (resolves a product's `replaces` names to catalog
  products case-insensitively, preserving list order, skipping unknown names),
  `getAlternativeProducts` (products whose `replaces` include this product,
  ranked by replaces-count desc then name), `getComparisonProducts`
  (product first + top `limit-1` alternatives, default cap 4),
  `getProductCategories` (resolves category slugs, drops stale ones),
  `getWhyChooseFacts` (data-driven fact cards: open source w/ license,
  self-hosted, pricing, setup — no fabricated copy), and JSON-LD builders
  `buildSoftwareApplicationJsonLd` (SoftwareApplication schema; free products
  get an `Offer` with `price: "0"`, freemium/paid omit `offers`) +
  `buildBreadcrumbJsonLd` (Home → Alternatives → product).
- `components/product/ProductDetailHeader.tsx` (new, server) — hero card:
  ProductLogo (lg) + h1 + tagline, badge row (Pricing/OpenSource/SelfHosted +
  difficulty + license chips), description, category chips (link to
  `/categories/[slug]`), GitHubStats, and action buttons ("Visit website",
  "View on GitHub" when `repo` set). **All anchors use `next/link` Link** —
  including external URLs (Next.js Link handles external hrefs without
  prefetching); the GitHub logo was replaced with a `Code` icon because
  lucide-react v1.32 removed brand icons (no `Github` export).
- `components/product/ReplacesSection.tsx` (new, server) — "What X replaces"
  pill list linking each replaced SaaS to its own product page; returns `null`
  when empty.
- `components/product/AlternativesSection.tsx` (new, server) — "Best
  alternatives to X" grid of P6 `AlternativeCard`s (ranked); `null` when empty.
- `components/product/ComparisonSection.tsx` (new, server) — "Feature
  comparison" wrapping the P6 `ComparisonTable` in a bordered card; `null`
  when fewer than 2 comparison products.
- `components/product/WhyChooseSection.tsx` (new, server) — "Why people pick X"
  fact cards from `getWhyChooseFacts`; `null` when no facts.
- `components/product/ProductDetail.tsx` (new, server) — composes Breadcrumbs +
  header + the four sections in order (Replaces → Alternatives → Compare →
  Why choose) and emits both JSON-LD scripts.
- `app/alternatives/[slug]/page.tsx` (new, server) — `generateStaticParams`
  (all 181 product slugs), `generateMetadata` (contextual title/description:
  "free & open-source alternatives" for replaced SaaS, "open-source alternative
  to X and N more" for alternatives, name-only otherwise; openGraph), 404 via
  `notFound()`, then composes `ProductDetail` with all related data.
- `app/alternatives/[slug]/not-found.tsx` (new) — localized 404 using the P6
  `EmptyState` with a "Browse all alternatives" action.
- `tests/product-detail.test.ts` (new) — 16 tests covering replaced/alternative
  resolution, ranking, comparison capping (1+3), category resolution, fact
  generation (open-source product vs. closed-source paid), and both JSON-LD
  builders.

**Decisions:**
- **All 115 replaced names resolve to catalog products** (verified against
  `data/products.json` before building), so "What X replaces" can link every
  entry to a real `/alternatives/[slug]` page with no dangling links.
- **`getWhyChooseFacts` is data-derived, never copy-paste:** open-source fact
  only when `openSource` (license named from `license`), self-hosted fact only
  when `selfHosted`, plus always pricing + setup. A closed-source paid SaaS
  like Vercel renders just two facts — honest, no fabricated reasons.
- **Comparison = product + top alternatives, capped at 4 columns.** Max
  alternatives in the catalog is 3 (OpenAI API, Canva Pro), so the table never
  overflows; product always first for context.
- **Static generation:** no dynamic APIs in the page (data loaders are
  module-scope JSON parses), so all 181 product pages prerender at build time.
  `dynamicParams` defaults to true → unknown slugs hit the page → `notFound()`
  → segment `not-found.tsx`. (Full `next build` still deferred to the user per
  the low-end machine rule.)
- **JSON-LD item URLs are relative** (`/`, `/alternatives`, `/alternatives/x`).
  No site URL config exists yet; `lib/seo.ts` + absolute canonical URLs land in
  P11. Revisit then if desired.
- **`<Link>` everywhere, including external URLs.** Next.js `Link` renders a
  plain anchor for external hrefs (no prefetch); keeps the codebase free of raw
  `<a>` in this phase per project convention. Brand-icon gap (no `Github` in
  lucide v1.32) solved with the `Code` icon.
- **No P6 file was modified** — ProductCard/AlternativeCard/ComparisonTable/
  Breadcrumbs/EmptyState/badges/GitHubStats used as-is. Section heading reused
  from `components/home/SectionHeading` (generic presentational component,
  imported rather than duplicated or moved).

**Verification:**
- `npx tsc --noEmit` → clean (incremental)
- `npx eslint app/alternatives lib/product-detail.ts components/product tests/product-detail.test.ts` → 0 errors
- `npx vitest run` → 49/49 passed (13 data + 20 directory + 16 product-detail)
- `pnpm validate-data` → ✓ 58 categories / 15 features / 181 products
- Render smoke test (temporary `tests/_smoke-product.test.tsx` + throwaway
  `vitest.smoke.config.mts` with `@/` alias + `next/link` mocked) → 6/6 passed:
  header w/ name/badges/links/license, replaced-SaaS links (coolify →
  vercel/netlify), best-alternatives cards (zendesk → freescout/zammad),
  comparison renders product-first, full page JSON-LD + breadcrumbs, and
  alternatives-section omission when none exist. Temp files deleted after.
- Full `next build` NOT run (heavy — user runs per AGENTS.md low-end machine
  rule).

**Next phase:** `phase/10-categories-search` — `/categories`, `/categories/[slug]`
(filterable grid), `/search`. Category chips already link to `/categories/[slug]`
(404 until P10 — expected, same as the P8 → P9 `[slug]` link).

**Open issues / follow-ups:**
- **`@/` alias + `next/link` mock still live only in throwaway smoke configs** —
  P12 must add the alias to `vitest.config.mts` (noted in HANDOFF-08 too).
- **JSON-LD uses relative URLs**; P11 (`lib/seo.ts`) should introduce a site
  base URL and switch schema `item`/`url` values to absolute.
- **`components/home/SectionHeading` is imported by product components** —
  consider promoting it to `components/ui/` during a later refactor pass if
  more feature areas start using it.
- **"Why choose" fact cards cap at 4 columns**; products with 2 facts (closed
  source + non-self-hosted) render 2 cards in a 4-col grid — visually fine, but
  revisit sizing during the P14 copy/design audit.
