# HANDOFF — phase/07

**Goal:** Build the homepage — hero + tagline, large search bar, trending products,
category grid, popular SaaS→alternatives, badge explainer, contribute CTA — composing
P6 components with live data, with `generateMetadata`, correct dark mode, reasonable LCP.

**Branch:** `phase/07-homepage`

**Status:** complete

**Files touched:**
- `app/page.tsx` — homepage composition (server component): Hero, SwappableSaaS,
  TopAlternatives, CategoryGrid, BadgeExplainer, ContributeCta; `generateMetadata`
  (title + description); live-data stats (181 products / 66 alternatives / 58 categories)
- `app/layout.tsx` — **P1-owned, changed on approval of HANDOFF-06 open issue:** swapped
  Inter → Geist + Geist Mono (`next/font/google`, variable weights, no new dep), metadata
  `title.template`/`default`, and added site chrome (`<SiteHeader>`/`<SiteFooter>` +
  skip-link inside `<main>`). Site-wide chrome rendered here so P8+ pages inherit it.
- `app/globals.css` — **P1-owned, same approval:** `--font-sans` → Geist var, new
  `--font-mono` (→ `font-mono` utility), `::selection` tint, and `@utility ambient-radial`
  (soft ring-tinted radial for the hero, dark-aware via `--ring`).
- `components/SiteHeader.tsx` (new) — sticky, `backdrop-blur`, wordmark + nav
  (Alternatives/Categories/Contribute) + ThemeToggle.
- `components/SiteFooter.tsx` (new) — wordmark, tagline, links, MIT note.
- `components/ThemeToggle.tsx` (new) — client; `useSyncExternalStore` mounted-detection
  (NOT `setState` in effect — that tripped `react-hooks/set-state-in-effect`), Sun/Moon.
- `components/home/` (new, 8 files):
  - `home-data.ts` — pure selectors: `getPopularSaaSPairs` (paid SaaS referenced by
    ≥1 alternative, ranked by alt-count), `getTopAlternatives` (ranked by `replaces.length`).
  - `Hero.tsx` + `HeroSearch.tsx` (client, `useRouter` → `/search?q=`), `SectionHeading.tsx`
    (mono eyebrow + H2 + description), `SwappableSaaS.tsx`, `TopAlternatives.tsx`,
    `CategoryGrid.tsx`, `BadgeExplainer.tsx`, `ContributeCta.tsx`.

**Decisions:**
- **Mode B confirmed** (HANDOFF-06 design read holds): restrained, credible, data-driven.
  One accent (emerald `--ring`), 1px `--border`, radius scale locked, lucide `strokeWidth={1.75}`.
- **"Trending" = data-driven ranking:** no GitHub stars yet (all `null` until P13), so the
  "Top alternatives" section is ranked by number of paid SaaS replaced — the best available
  proxy, stated explicitly in the section copy. Revisit after P13 when stars exist.
- **Popular SaaS section:** top 6 paid products that appear in ≥1 `replaces` array
  (Canva Pro, OpenAI API, Airtable, Algolia, Amazon SES, Auth0…) rendered as
  SaaS-name-left / alternative-chips-right rows. Fully computed from live data.
- **Search wiring:** HeroSearch + "Popular:" chips link to `/search?q=…` (P10 route — 404
  until P10 lands; correct long-term target). Queries verified against live data:
  "vercel"→Vercel,Coolify; "zapier"→Zapier,n8n; "notion"→Notion,AFFiNE,AppFlowy; "analytics"→… .
- **Hero copy is concrete** (counts, real product names) — no AI-slop clichés; left-aligned
  editorial composition, ambient-radial depth, stats as a `dl` with mono labels.
- **No JSON-LD this phase:** homepage `generateMetadata` only. Full schema (WebSite +
  SearchAction, sitemap/robots) deferred to P11 SEO pass — avoids fabricating a production URL.
- **LCP strategy:** hero is plain text + one client SearchBar (isolated leaf) — no images,
  no above-the-fold JS beyond a single tiny client component; fonts self-hosted via `next/font`.
- **ESLint gotcha:** `useEffect(() => setMounted(true), [])` is banned by
  `react-hooks/set-state-in-effect`. Fixed with the `useSyncExternalStore(emptySubscribe, …)`
  mounted pattern (hydrates true on client / false on server) — lint-clean and correct.

**Verification:**
- `npx tsc --noEmit` → clean
- `npx eslint app components/home components/Site* components/ThemeToggle.tsx` → 0 errors
- `npx vitest run` → 13/13 passed (existing data suite unaffected)
- Render smoke test (temporary `tests/_smoke-home.test.tsx` + throwaway `vitest.smoke.config.mts`
  with `@/` alias, `next/navigation` mocked) → 8/8 passed: home-data ranking, Hero,
  SwappableSaaS, TopAlternatives, CategoryGrid, BadgeExplainer, ContributeCta all render
  with live data. Temp files deleted after the run.
- Full `next build` NOT run (heavy — user runs per AGENTS.md low-end machine rule).

**Next phase:** `phase/08-directory` — `/alternatives` grid with FilterPanel
(pricing/hosting/license/difficulty), sorting, pagination, mobile bottom-sheet filters.

**Open issues / follow-ups:**
- **Header/footer ownership:** SiteHeader/SiteFooter/ThemeToggle live under `components/`
  (site chrome) and are now used by the root layout — not covered by the P6 ownership row
  for `components/ui/*`. Keep them P7-owned; revisit in P14 ownership reconciliation.
- **`/search` route 404 until P10** — expected; homepage links and HeroSearch target it.
- **P12 must still add `@/` alias to `vitest.config.mts`** before permanent component tests
  (smoke tests keep needing throwaway configs).
- **P13 sync:** when GitHub stars land, revisit "Top alternatives" ranking signal
  (stars vs. replaces-count) — note in section copy stays truthful meanwhile.
