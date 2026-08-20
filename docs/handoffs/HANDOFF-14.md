# HANDOFF — phase/14

**Goal:** Docs + release polish. Tasks: `README.md` (what/features/stack/dev/contribute/deploy-on-Vercel/roadmap), `docs/` handoffs, final code-review pass + simplification, version tag. Exit criteria: README complete; no blocking review findings; full test+build+lint green on main.

**Branch:** `phase/14-docs-release`

**Status:** complete

**Files touched:**
- `README.md` (new) — comprehensive front-door docs:
  - Title + tagline + live-site/stack/license badges + TOC (14 sections).
  - **What this is:** 181 products (115 paid + 66 alternatives) across 58 categories / 15 features, JSON-driven, GitHub-as-CMS.
  - **Features:** homepage sections, directory (filters/sort/pagination 24), product pages (badges/comparison/JSON-LD/static params 181), categories (58 slugs), search (stopwords, weighted relevance replaces>name>category>tag>tagline>description, AND semantics), contribute page, full SEO pass.
  - **Tech stack** table (Next.js 16, TS strict, Tailwind v4, Zod, Vitest + coverage gate, ESLint + lint-staged, semantic-release, pnpm 11.22, Node 22).
  - **Quick start:** prerequisites (Node 22, pnpm), install → `cp .env.example .env.local` → `pnpm dev`, plus commands table.
  - **Project structure** tree (app/components/lib/data/scripts/tests/docs/.github) with ownership note pointing to PLAN.md.
  - **Data model:** Category/Feature/Product shapes, Zod single-source-of-truth, validation rules, minimal JSON example, `pnpm validate-data`.
  - **Directory, search & SEO:** URL-driven state, `countOption` contextual counts, search token/weight details, `lib/seo.ts` + sitemap hard-error behaviour.
  - **Tests & quality gate:** commands + 80% `lib/` gate + validate.yml reference.
  - **GitHub sync:** `pnpm sync:github` with `--limit`/`--force`/`--max-age-hours`, byte-exact serializer note, token docs (60 vs 5000 req/hr).
  - **Deploying on Vercel:** 4-step (push → import Next.js → set `NEXT_PUBLIC_SITE_URL` → deploy), env var table, no DB, sitemap fail-fast.
  - **Roadmap:** Done (P0–P13), This phase (P14), Next (P15 AGENTIC_BUILD_GUIDE), Future ideas.
  - **Contributing / License / Acknowledgements** — links to `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`, `product-source-list.md`, `PLAN.md`, `CHANGELOG.md` (auto-generated, not edited).
  - All internal links verified (14 local links OK, external skipped), 2016 words, 17 headings, no skipped hierarchy.
- `PLAN.md` (modified) — marks P14 `[x]` with date + evidence (this phase).
- `docs/handoffs/HANDOFF-14.md` (this file).

**Decisions:**
- **Single README, no duplicate docs-site:** project is a GitHub-first directory; README is the canonical docs surface. `CONTRIBUTING.md` already covers the tested-PR flow, so README links to it rather than duplicating. `CHANGELOG.md` stays auto-generated (not hand-edited).
- **No code simplification churn this phase:** final code-review pass (see Verification) found **no blocking issues** — `tsc` clean, `eslint` 0/0, `vitest` 143/143, coverage `lib/` 98.62%/91.93%/100%/98.91% (>80% gate), `validate-data` 58/15/181 ✓. Structural hotspots (`countOption` dual-filter exclusion, search weight map, product-detail lookups) are intentional trade-offs for small-dataset clarity;Drive-by refactors would risk noisy diffs. Simplification checklist (dead code, generic names, nested ternaries, boolean flags) — none triggered.
- **Version tag deferred to semantic-release:** `release.config.mjs` + `release.yml` auto-tag on push to `main` from Conventional Commits; no manual `git tag` in the phase branch. Next squash-merge will produce `feat: add README and release polish (P14)` and semantic-release will derive the version. This matches P0 global rule (Conventional Commits feed semantic-release) and avoids a manual tag that would diverge from the release pipeline.
- **Follow technical-writer + code-reviewer + code-simplification skills:** README structure follows `technical-writer` (what → install → usage → features → API/data → contributing → license), review uses `code-reviewer` 5-step (context→structure→details→tests→feedback), simplification uses 5 principles (preserve behaviour, follow conventions, clarity > cleverness).

**Verification:**
- `npx tsc --noEmit` → clean (incremental, exit 0).
- `npx eslint .` → 0 errors, 0 warnings (exit 0).
- `npx vitest run` → 143/143 passed (10 files, exit 0).
- `npx vitest run --coverage` → lib coverage Statements 98.62% / Branches 91.93% / Functions 100% / Lines 98.91% (gate ≥80% ✓).
- `npx tsx scripts/validate-data.ts` → ✓ 58 categories, 15 features, 181 products — all valid.
- Link check: `python -c` scanned 33 markdown links (14 local OK, 19 external/https skipped), 2016 words, 17 headings no skipped levels.
- YAML + release config already validated in P13 (unchanged this phase); README references them accurately.

**Next phase:** `phase/15-agentic-build-guide` — `AGENTIC_BUILD_GUIDE.md` — full build-flow report/guide: intake, skill selection, phases, branches, merge strategy, handoffs, maintenance, CHANGELOG/semantic-release setup — reusable for future projects, improvable over time.

**Open issues / follow-ups:**
- **`AGENTIC_BUILD_GUIDE.md` (P15) is the last open deliverable** — needs the full agentic playbook distilled from P0–P14 handoffs.
- **Full `next build` still deferred to user** (low-end machine rule) — must be run with `NEXT_PUBLIC_SITE_URL` set (sitemap hard-errors without it). CI's validate.yml covers correctness via lint/typecheck/tests/validate-data.
- **GitHub metadata stays `null` until `pnpm sync:github` with `GITHUB_TOKEN`** — no fabrication (project rule); README documents the flow.
