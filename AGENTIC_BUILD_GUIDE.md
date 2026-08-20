# Agentic build guide

> How this repository was built — and how to reuse the same workflow for your next project.

This guide distills the end-to-end agentic workflow used for **awesome-saas-alternatives** (P0 → P15) into a reusable playbook. It covers intake, skill selection, phased planning, branch and merge discipline, handoffs, verification, maintenance, and automated `CHANGELOG.md` generation via `semantic-release`. Copy the checklists, adapt the phase table, and improve the guide over time.

---

## Table of contents

- [Who this guide is for](#who-this-guide-is-for)
- [Core principles](#core-principles)
- [Lifecycle at a glance](#lifecycle-at-a-glance)
- [Intake — clarifying the brief](#intake--clarifying-the-brief)
- [Planning — phases, ownership and skills](#planning--phases-ownership-and-skills)
- [Branching and merging](#branching-and-merging)
- [Handoffs and the live tracker](#handoffs-and-the-live-tracker)
- [Skill system](#skill-system)
- [Verification — fast dev and quality gates](#verification--fast-dev-and-quality-gates)
- [Documentation](#documentation)
- [CI and releases](#ci-and-releases)
- [Maintenance — day-2 operations](#maintenance--day-2-operations)
- [Reusing this guide for a new project](#reusing-this-guide-for-a-new-project)
- [Troubleshooting](#troubleshooting)
- [Appendix A — concrete timeline for this repo](#appendix-a--concrete-timeline-for-this-repo)
- [Appendix B — file ownership map](#appendix-b--file-ownership-map)
- [Appendix C — command reference](#appendix-c--command-reference)

---

## Who this guide is for

- Builders who want an AI agent to do the bulk of the implementation while a human stays in the review loop.
- Teams that need a **deterministic** workflow: every phase has a branch, an exit criterion, and a handoff — no “the agent thinks it’s done”.
- Anyone starting a JSON-data-driven or Next.js + TypeScript project and wanting a production-ready scaffold without reinventing release hygiene.

**Prerequisites:** `git`, **Node 22+** (see `.nvmrc`), **pnpm 11.22+**, a GitHub repo, and Vercel (or any Next.js host) if you deploy.

---

## Core principles

These six rules are non-negotiable in this repo and transfer directly to the next one.

1. **Research first, always.** Before any task or fix: fetch the relevant reference, load the right skill via `using-agent-skills`, plan, then code. Never implement blindly. See `AGENTS.md`.
2. **`pnpm` only.** The agent writes dependencies into `package.json`; the **user runs install and build commands**. The agent never runs heavy installs or `next build` without an explicit go-ahead (low-end machine rule).
3. **Fast dev.** Lint, typecheck, build and test run **only on new or modified files** (`lint-staged`, `tsc --incremental`, `vitest --changed`). Full-suite runs are opt-in.
4. **Branch-per-phase, squash-merge.** Every phase is a branch `phase/NN-name`, squash-merged to `main` as one Conventional Commit. Errors are fixed inside the same phase branch.
5. **No fabrication.** GitHub stars, licenses and release metadata stay `null` until fetched from the GitHub API via `pnpm sync:github`.
6. **Agent config is committed.** `.agents/`, `.claude/` and `skills-lock.json` stay in the repo so every session starts from the same skill versions.

---

## Lifecycle at a glance

The orchestrator is `loop-orchestrator` (`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`). Each phase is a loop with a checkable exit condition — the loop, not confidence, decides when it is done. Maker and checker are separate: `BUILD` does not grade its own work; `VERIFY` and `REVIEW` re-check from a fresh perspective.

```
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
  loop    loop   inner    checker   loop    loop
```

How this repo mapped the lifecycle to its delivery order:

| Lifecycle stage | Repo phases | What it meant here |
|---|---|---|
| DEFINE | P0 | Repo foundation, `PLAN.md` as master plan, `AGENTS.md` as agent contract |
| PLAN | P0–P1 | Phase breakdown, file ownership, skill load map, scaffold deps |
| BUILD | P2–P11 | Data layer → batches → components → pages → SEO |
| VERIFY | P12 | Vitest suite + `lib/` 80% coverage gate |
| REVIEW | P13–P14 | Sync/CI review, docs polish, final `code-reviewer` + `code-simplification` pass |
| SHIP | P15 + release.yml | This guide, squash-merges to `main`, `semantic-release` on push |

For small fixes, scale the loop down (L1–L2: `BUILD → VERIFY` only). For a full app, run the full lifecycle (L4). If unsure between two levels, pick the higher one.

---

## Intake — clarifying the brief

Do not skip the intake round when the request is vague. One clarification pass saves a full rebuild.

1. **Surface the 2–3 assumptions that most change the outcome.** For this repo those were: must the site be static with no DB? How many products must ship in v1? Does GitHub metadata need to be live or can it be `null` until synced?
2. **Pin scope and boundaries in writing.** The tagline, stack (Next.js + TypeScript + Tailwind, Vercel, pnpm) and data budget (130 rows, ~170 products in `data/*.json`) were frozen in `PLAN.md` before any code was written.
3. **Present a plan for approval.** Tasks, acceptance criteria and order go in `PLAN.md` → Phase tracker. Wait for approval — this is the one required human gate. After approval, the run continues autonomously through `SHIP` without re-asking.

If the user says “just do it, no need to ask”, skip intake but still present the plan for approval before the autonomous run starts.

---

## Planning — phases, ownership and skills

### Designing the phases

Use `planning-and-task-breakdown`. Split the spec into small, verifiable phases, each with a branch, skill set and exit criterion. Order by dependency.

This repo used 16 phases in delivery order:

```
P0 foundation → P1 scaffold → P2 data layer → P3-5 data batches → P6 components
→ P7 homepage → P8 directory → P9 product → P10 cat/search → P11 SEO
→ P12 tests → P13 sync/CI → P14 docs/release → P15 agentic-build-guide → final main
```

Every phase = a new session = a new branch = a merge to `main` before the next phase. See `PLAN.md` → Phase tracker for the full table with exit criteria.

### File ownership map

Assign each file pattern to exactly one owner phase to avoid merge conflicts. This repo’s map lives in `PLAN.md` → File ownership map and is summarized in [Appendix B](#appendix-b--file-ownership-map). Highlights:

- `AGENTS.md`, `PLAN.md`, `.nvmrc`, `.agents/` → P0
- `package.json`, `next.config.*`, `tsconfig.json`, `app/layout.tsx` → P1
- `lib/types.ts`, `lib/data.ts`, `data/*.json`, `scripts/validate-data.ts` → P2
- `components/ui/*` + pages → P6–P11
- `.github/workflows/`, `scripts/sync-github.ts`, `CONTRIBUTING.md` → P13
- `README.md`, `docs/**` → P14
- `AGENTIC_BUILD_GUIDE.md` → P15

If a later phase must touch a file owned by an earlier phase, note it in the handoff and get explicit approval — don’t silently drift.

### Incremental implementation

Inside each phase, use `incremental-implementation`: implement one slice, verify it, commit, repeat. No broad rewrites without a rebuild path. Prefer additive changes; use small PR-shaped slices even inside a single branch.

---

## Branching and merging

Branch naming: `phase/NN-name` in numeric order (e.g. `phase/14-docs-release`). Each branch is cut from the latest `main` **after** the previous merge — this keeps the history conflict-free.

```sh
# Start the next phase from a clean main
git checkout main
git pull
git checkout -b phase/15-agentic-build-guide

# ... implement, verify, hand off ...

# Squash-merge to main as one Conventional Commit per phase
git checkout main
git merge --squash phase/15-agentic-build-guide
git commit -m "feat: add agentic build guide (P15)"
git branch -D phase/15-agentic-build-guide
```

Rules:

- **One commit per phase.** Squash-merge preserves a clean linear history and gives `semantic-release` one commit to analyze per version.
- **Fix errors in the same phase branch, never after merge.** If `VERIFY` or `REVIEW` fails, fix on the phase branch, re-verify, then merge.
- **No merge while the exit criterion is unmet.** The phase loop’s deterministic condition — not “it feels done” — decides done.
- Budget: if the same slice fails twice, stop and escalate with evidence instead of silently retrying a third time.

---

## Handoffs and the live tracker

### `PLAN.md` is the live tracker

Every phase row in `PLAN.md` ends with `Status: [ ] pending` → `[x] completed YYYY-MM-DD — evidence`. Update it on the same branch at the end of the phase. The next session reads `PLAN.md` → `AGENTS.md` → the latest `docs/handoffs/HANDOFF-NN.md` and cuts the next branch.

### Per-phase handoff

At the end of every phase, write `docs/handoffs/HANDOFF-NN.md` on the same branch:

```markdown
# HANDOFF — phase/NN

Goal: <phase goal>
Branch: <branch name>
Status: complete | blocked
Files touched: <list>
Decisions: <key decisions — why, not just what>
Verification: <exit criteria evidence — tests/build output>
Next phase: phase/MM — <one-line brief>
Open issues / follow-ups: <list>
```

This repo’s handoffs `HANDOFF-00` through `HANDOFF-14` are the audit trail. They surface the “why” (e.g. why `countOption` ignores its own group, why `validate-data` uses Zod as single source of truth, why the sitemap hard-errors without `NEXT_PUBLIC_SITE_URL`).

---

## Skill system

Skills live in `.agents/skills/` (and `.claude/skills/`), pinned in `skills-lock.json`. Load them via `using-agent-skills` — never guess.

- **Always on (Core Kit):** `loop-orchestrator`, `using-agent-skills`, `planning-and-task-breakdown`, `incremental-implementation`, `testing`, `test-master`, `code-reviewer`, `code-simplification`, `version-control`, `sdlc-workflow`, `forward-deployed-engineer`, `technical-writer`.
- **Base (all phases):** `repository-foundation-scaffold` (incremental `tsc`, `lint-staged`, low-end machine rules).
- **Design base (P6–P11):** `design-taste-frontend` + `minimalist-ui` — “no AI-slop” UI discipline.
- **Per-phase extras** are mapped in `PLAN.md` → Skill load map (e.g. P1 adds `nextjs` + `typescript` + `tailwind-css`, P10 adds `seo` + `nextjs` + `frontend-core`, P13 adds `github-actions-engineering` + `open-source-project-maintainer`, P15 is `technical-writer` only).

**Version control for skills.** `skills-lock.json` records `source`, `skillPath` and `computedHash` per skill. Commit them. If you upgrade a skill, update the lock and note it in the handoff.

**Loading order.** Before any phase: web-fetch the relevant reference → load the skill → plan → code. The skill’s `SKILL.md` is the authoritative workflow — follow it, don’t paraphrase it from memory.

---

## Verification — fast dev and quality gates

### Fast-dev defaults (every edit)

- `lint-staged` on staged `*.{ts,tsx}` (`eslint --fix`).
- `tsc --noEmit --incremental` on changed files (strict).
- `vitest --changed` during development.

Never run the full suite on every keystroke.

### Full-suite checks (before merge and in CI)

Run the full checks as the phase’s exit evidence:

```sh
pnpm lint              # eslint on all files — must be 0 errors, 0 warnings
pnpm typecheck         # tsc --noEmit
pnpm test              # vitest run — all tests green
pnpm test:coverage     # v8, include lib/**, thresholds 80/80/80/80
pnpm validate-data     # Zod + cross-ref checks on data/*.json
```

For this repo the gates are: `lib/` coverage **≥ 80%** on statements, branches, functions and lines (see `vitest.config.mts`), and `data/*.json` validation (`58 categories / 15 features / 181 products` at P14–P15). At P12 the achieved coverage was Statements 98.62% / Branches 91.93% / Functions 100% / Lines 98.91%.

### `next build`

`next build` is **not** run by the agent on every phase (low-end machine rule — it is the only heavy command). It is deferred to the user or to the deploy host, but it **must be run with `NEXT_PUBLIC_SITE_URL` set** — `app/sitemap.ts` hard-errors without it so a misconfigured deploy fails fast instead of shipping a broken sitemap.

### Review

Run `code-reviewer` (five-axis: correctness, performance, maintainability, tests, security) and, when complexity warrants, `code-simplification` (five principles — preserve behavior, follow conventions, clarity over cleverness). Fix only blocking findings inside the same phase branch.

---

## Documentation

**README is the front door.** Structure: name + one-line what-it-does → quick install → quick usage → key features → tech stack → data model → scripts → contributing → license. Lead with the most important information. This repo’s `README.md` follows `technical-writer` (what → install → usage → features → API/data → contributing → license) and is owned by P14.

**CONTRIBUTING is the maintainer contract.** Setup, tested-PR rule (lint + typecheck + tests + `validate-data` before opening a PR), Conventional Commits, and the “GitHub is the CMS” flow for `data/products.json`. Owned by P13.

**`docs/` mirrors the information architecture.** `docs/handoffs/` is the per-phase log; `docs/reference/product-source-list.md` is the canonical 131-row source table. Both are owned by P0 and P14. Keep `docs/` and the docs-site (if you later add one) in sync — same content type, ordering and frontmatter. See `technical-writer` → Repo docs vs docs website.

**Style rules** (from `technical-writer/references/style-guide.md`): sentence case headings, gerund titles for procedures (“Creating…”), 1–2 sentence intros, prerequisites up front, numbered steps for sequential procedures with one action per step, descriptive link text (never “click here”), alerts used sparingly, consistent placeholder style (`YOUR_API_KEY`), 60-char code lines, proper heading hierarchy (no skipped levels), and accessibility (alt text, descriptive links, correct heading order).

---

## CI and releases

### Two workflows, two triggers

| Workflow | File | Trigger | What it does |
|---|---|---|---|
| Validate | `.github/workflows/validate.yml` | PRs and pushes to `main`, path-filtered (`app/`, `components/`, `data/`, `lib/`, `scripts/`, `tests/`, plus config) | `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm typecheck` → `pnpm test:coverage` → `pnpm validate-data` |
| Release | `.github/workflows/release.yml` | Push to `main` | `pnpm install --frozen-lockfile` → `pnpm release` (`semantic-release`) |

`validate.yml` is the quality gate — PRs cannot merge below it. `release.yml` is the ship gate — it runs only after a squash-merge to `main`.

Permissions are least-privilege: `validate` has `contents: read`; `release` has `contents: write` + `issues: write` + `pull-requests: write` for tags, releases and changelog commits.

### `semantic-release` setup

Config lives in `release.config.mjs` (also noted in `PLAN.md` → CHANGELOG.md strategy):

```js
const config = {
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/npm", { npmPublish: false }],
    ["@semantic-release/git", {
      assets: ["CHANGELOG.md", "package.json", "pnpm-lock.yaml"],
      message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
    }],
    "@semantic-release/github",
  ],
};
export default config;
```

Dependencies (in `package.json`): `semantic-release`, `@semantic-release/changelog`, `@semantic-release/commit-analyzer`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm`, `@semantic-release/release-notes-generator`. Scripts: `"release": "semantic-release"` and `"prepare": "husky"` (lint-staged hook).

Behavior:

- **Conventional Commits drive versioning** (`feat:` → minor, `fix:` → patch, `feat!:` / `BREAKING CHANGE:` → major). Every squash-merge commit must follow the convention — enforced via the PR template and `CONTRIBUTING.md`.
- **One squash-merge = one release unit.** `release.config.mjs` analyzes the single squash commit, derives the version, writes `CHANGELOG.md` via `@semantic-release/changelog`, commits `CHANGELOG.md` + `package.json` + `pnpm-lock.yaml` via `@semantic-release/git` with `[skip ci]` so the release commit does not re-trigger CI, and creates the GitHub release via `@semantic-release/github`.
- **`npmPublish` is off.** This is a directory site, not a published package — the `@semantic-release/npm` step is present only to bump `package.json` version without publishing.
- **Do not edit `CHANGELOG.md` by hand.** The placeholder in P0 exists only so the first release has a file to update; after that the file is auto-generated. The format is Keep a Changelog + SemVer.
- **Monorepo alternative:** `changesets` — not used here. For a single repo, `semantic-release` is the intended choice; document the decision so the next project can re-evaluate.

### CHANGELOG strategy in practice

1. Phases land on `main` as `feat:`, `fix:`, `docs:`, etc. (always with a body and `[skip ci]` for docs/chore phases if you want to skip CI).
2. On push to `main`, `release.yml` runs `semantic-release`, which reads commits since the last tag, generates notes, writes `CHANGELOG.md`, bumps `package.json`, commits and tags the release, and publishes the GitHub release.
3. `CHANGELOG.md` and the release notes are the project’s public changelog — `README.md` and `CONTRIBUTING.md` point to them and warn not to hand-edit the file.

---

## Maintenance — day-2 operations

**Dependency discipline.** The agent writes `package.json`; the human runs `pnpm install` and `pnpm build`. Keep `engines.node` (`>=22.14.0`) and `packageManager` (`pnpm@11.22.0`) in sync with `.nvmrc`. Record approved build approvals (e.g. `esbuild` for `vitest`) in `pnpm-workspace.yaml` via `pnpm-workspace.yaml:approvedBuilds`.

**Data pipeline.** `lib/schemas.ts` is the single source of truth (Zod `productSchema`, `categorySchema`, `featureSchema`). `scripts/validate-data.ts` enforces uniqueness, cross-references (`categories`, `features`, `replaces`), and the `null`-unless-fetched rule for `github`. `docs/reference/product-source-list.md` is the canonical seed table — read it, not the ChatGPT conversation.

**GitHub sync.** `scripts/sync-github.ts` (IO) + `scripts/sync-github-core.ts` (pure helpers: `isGithubStale`, `selectReposToSync`, `mapRepoResponse`, `serializeValue`). Idempotent: only refetches repos whose `github.updatedAt` is older than `--max-age-hours` (default 24), or all with `--force`. Byte-exact serializer so diffs are minimal. Needs `GITHUB_TOKEN` (60 req/hr anonymous, 5000/hr with token) — documented in `.env.example` and `README.md` → GitHub sync.

**Tests and coverage.** `vitest.config.mts` includes `@/` alias, `.tsx` support, `v8` coverage gated at 80% on `lib/`. Keep tests colocated in `tests/` and run `pnpm test:coverage` before every phase merge.

**Docs hygiene.** `README.md` is the front door; `CONTRIBUTING.md` is the contribution contract; `docs/handoffs/` is the phase log. The next phase always starts by reading `PLAN.md` → `AGENTS.md` → the latest handoff.

**Low-end machine rule stays after ship.** CI runs lint, typecheck, tests and `validate-data` — never `next build`. The deploy host (Vercel) runs `next build`; locals run it with `.env.local` present.

---

## Reusing this guide for a new project

Copy and adapt this checklist. Improve this guide in place after each new project.

### 1. Seed the repo

- [ ] Run `repository-foundation-scaffold` at the right level: L1 solo starter, L2 team/community, or L3 paid-SaaS. Only create the files that level justifies — never a kitchen sink.
- [ ] Create `PLAN.md` from the template in this repo’s `PLAN.md` (What we’re building → Global rules → Git strategy → File ownership map → Skill load map → Phase tracker → Session handoff protocol → CHANGELOG strategy → Delivery order recap).
- [ ] Create `AGENTS.md` (and `CLAUDE.md` as a thin pointer). Fill in tagline, stack, data shape, and `pnpm` + branch + fast-dev rules.
- [ ] Pin `.nvmrc`, `.editorconfig`, `.gitignore`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`, `.vscode/settings.json`, and commit `.agents/`, `.claude/`, `skills-lock.json`.
- [ ] Install the skill set you need and record them in `skills-lock.json`.

### 2. Define the phases

- [ ] List phases in delivery order (foundation → scaffold → data → components → pages → SEO → tests → sync/CI → docs → guide).
- [ ] Give each phase a branch name `phase/NN-name`, owner files, extra skills, tasks, and a **checkable** exit criterion.
- [ ] Assign file ownership so no two phases write the same file without explicit coordination.

### 3. Run the lifecycle

- [ ] **Intake:** one clarification round, then plan approval.
- [ ] **Branch:** `git checkout -b phase/NN-name` from latest `main`.
- [ ] **Build:** load the phase’s skills, implement slices with `incremental-implementation`, keep commits working.
- [ ] **Verify:** full checks (`lint`, `typecheck`, `test:coverage`, `validate-data`). Fix in the same branch.
- [ ] **Review:** `code-reviewer` (+ `code-simplification` when complexity warrants).
- [ ] **Handoff:** write `docs/handoffs/HANDOFF-NN.md`, mark `PLAN.md` `[x] YYYY-MM-DD — evidence`.
- [ ] **Ship:** `git merge --squash` → one Conventional Commit → push to `main`. `release.yml` handles the rest.

### 4. Ship and maintain

- [ ] Keep Conventional Commits clean — they feed `semantic-release`.
- [ ] Never hand-edit `CHANGELOG.md` after the first auto-release.
- [ ] Re-run `pnpm sync:github` periodically if the data has GitHub metadata.
- [ ] Evolve this guide: after each project, add the lesson as a one-paragraph note under the relevant section.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `next build` fails locally | `NEXT_PUBLIC_SITE_URL` missing from `.env.local` | `cp .env.example .env.local` and set the URL; `sitemap.ts` hard-errors by design |
| `validate-data` fails on `replaces` | `replaces` entry does not match any product `name` (case-insensitive) | Fix the name in `data/products.json` or add the missing paid product |
| `pnpm test:coverage` below 80% | New `lib/` code added without tests | Add tests in `tests/` for the new branch; keep the gate at 80% in `vitest.config.mts` |
| `lint-staged` does nothing on commit | No staged `*.{ts,tsx}` | Stage the files first; `validate.yml` still runs full `pnpm lint` in CI |
| `semantic-release` does not create a release | No qualifying Conventional Commit since last tag, or branch is not `main` | Ensure the squash commit uses `feat:` / `fix:`; check `release.yml` triggers only on push to `main` |
| `pnpm sync:github` hits rate limits | `GITHUB_TOKEN` missing | Create a PAT (no scopes needed), set `GITHUB_TOKEN` in `.env.local`, re-run |
| GitHub metadata still `null` after sync | Repo not in `data/products.json` or `repo` field empty | Add the `repo: "owner/name"` field; the sync script skips entries without it |
| `skills-lock.json` hash mismatch | Skill updated without re-locking | Re-run the skill installer / update flow so `computedHash` reflects the new `SKILL.md` |

---

## Appendix A — concrete timeline for this repo

All branches were cut from `main` after the previous merge and squash-merged back as one Conventional Commit per phase.

| Phase | Branch | Skills (extra) | Tasks | Exit criterion |
|---|---|---|---|---|
| P0 | `phase/00-repo-foundation` | `open-source-project-maintainer` | `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `skills-lock.json`, `docs/reference/product-source-list.md` | All files exist + valid, initial commit on `main`, `git status` clean |
| P1 | `phase/01-scaffold` | `nextjs`, `typescript`, `tailwind-css`, `react`, `design-taste-frontend` | `package.json`, `next.config.*`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, design tokens, dark-mode base | Configs valid; user verified `pnpm install` / `lint` / `typecheck` / `build` |
| P2 | `phase/02-data-layer` | `typescript`, `frontend-core` | `lib/types.ts`, `lib/data.ts`, `lib/schemas.ts`, `data/categories.json` (58), `data/features.json` (15), `scripts/validate-data.ts`, `data/products.json` placeholder, `tests/data.test.ts` | `validate-data` ✓, `tsc` clean, 11 tests green |
| P3 | `phase/03-data-products-a` | `code-documenter` | 78 products — Infra/DB/Auth/Storage/Analytics/Monitoring (`docs/reference/product-source-list.md` rows 1–40) | `validate-data` ✓ 78 products, `tsc` clean |
| P4 | `phase/04-data-products-b` | `code-documenter` | 40 products — Automation/Communication/Email/Git-CI | `validate-data` ✓ 118 products |
| P5 | `phase/05-data-products-c` | `code-documenter` | 63 products — Design/Productivity/PM/Internal/AI/Security/Billing-CRM | `validate-data` ✓ 181 products — data phase complete |
| P6 | `phase/06-core-components` | `frontend-craft`, `design-taste-frontend`, `minimalist-ui`, `react`, `tailwind-css` | 14 `components/ui/*` + `lib/cn.ts` + `lib/format.ts` | Build pass; components render with live data; no AI-slop |
| P7 | `phase/07-homepage` | `frontend-craft`, `minimalist-ui`, `seo`, `frontend-performance` | 6 homepage sections + `SiteHeader`/`SiteFooter`/`ThemeToggle` | Homepage renders with live data; `generateMetadata` set |
| P8 | `phase/08-directory` | `frontend-core`, `frontend-craft`, `typescript` | `/alternatives` — filters, sort, pagination, mobile drawer; `lib/directory.ts` | Filters + sort + pagination + drawer all work |
| P9 | `phase/09-product-detail` | `seo`, `nextjs`, `frontend-craft` | `/alternatives/[slug]` — badges, comparison, JSON-LD; `lib/product-detail.ts` | All 181 products generate pages; comparison correct |
| P10 | `phase/10-categories-search` | `seo`, `nextjs`, `frontend-core` | `/categories` + `/categories/[slug]` + `/search`; `lib/search.ts`, `lib/categories.ts` | “vercel” / “self hosted analytics” / “zapier alternative” all correct |
| P11 | `phase/11-contribute-seo` | `seo`, `nextjs`, `markdown-for-agents` | `/contribute`, `sitemap.ts`, `robots.ts`, `llms.txt`, `opengraph-image.tsx`, `lib/seo.ts` | Sitemap valid; robots correct; metadata on every page |
| P12 | `phase/12-tests` | `testing`, `test-master`, `code-reviewer` | `@vitest/coverage-v8`, `vitest.config.mts`, `tests/schemas.test.ts` etc. — 118 tests total | `pnpm test` green; `lib/` coverage ≥ 80% |
| P13 | `phase/13-sync-ci` | `github-actions-engineering`, `open-source-project-maintainer` | `scripts/sync-github.ts` + `core`, `validate.yml`, `release.yml`, `release.config.mjs`, `CONTRIBUTING.md`, `.env.example`, `husky` + `lint-staged` | Sync idempotent; workflow YAML valid; release config valid |
| P14 | `phase/14-docs-release` | `technical-writer`, `code-documenter`, `code-reviewer`, `code-simplification` | `README.md` + docs polish + final review/simplification pass | README complete; no blocking findings; lint/typecheck/test green |
| P15 | `phase/15-agentic-build-guide` | `technical-writer` | This guide | Guide complete; user review; covers `CHANGELOG.md` via `semantic-release` |

Git log on `main` (one squash commit per phase, numeric order preserved) and the per-phase handoffs in `docs/handoffs/` are the source of truth for sequencing.

---

## Appendix B — file ownership map

From `PLAN.md` (authoritative):

| Files | Owner phase |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `skills-lock.json`, `docs/reference/product-source-list.md` | P0 |
| `package.json`, `pnpm-lock.yaml`, `next.config.*`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, `components/theme*` | P1 |
| `lib/types.ts`, `lib/data.ts`, `data/categories.json`, `data/features.json`, `scripts/validate-data.ts`, `data/products.json` (placeholder) | P2 |
| `data/products.json` (batches) | P3–P5 |
| `components/ui/*` | P6 |
| `app/page.tsx` + homepage components | P7 |
| `app/alternatives/page.tsx` + `FilterPanel` | P8 |
| `app/alternatives/[slug]/` + `ComparisonTable` | P9 |
| `app/categories/**`, `app/search/` | P10 |
| `app/contribute/`, `app/sitemap.ts`, `app/robots.ts`, `lib/seo.ts`, `llms.txt` | P11 |
| `tests/**`, vitest config | P12 |
| `.github/workflows/`, `scripts/sync-github.ts`, `CONTRIBUTING.md`, `.env.example`, `release.config.mjs` | P13 |
| `README.md`, `docs/**` | P14 |
| `AGENTIC_BUILD_GUIDE.md` | P15 |

---

## Appendix C — command reference

| Task | Command | Who runs |
|---|---|---|
| Install deps | `pnpm install` | user (agent writes `package.json` only) |
| Typecheck (incremental) | `pnpm typecheck` (`tsc --noEmit`) | agent on changed files |
| Lint (changed) | `pnpm lint` / lint-staged on `*.{ts,tsx}` | agent on changed files |
| Tests | `pnpm test` (`vitest run --changed` in dev, full `vitest run` before merge) | agent |
| Coverage gate | `pnpm test:coverage` (v8, `lib/` ≥ 80%) | agent + CI |
| Validate data | `pnpm validate-data` (`tsx scripts/validate-data.ts`) | agent on data changes + CI |
| GitHub sync | `pnpm sync:github [-- --limit 1] [-- --force] [-- --max-age-hours 6]` | user with `GITHUB_TOKEN` |
| Build (heavy) | `pnpm build` (`next build`, needs `NEXT_PUBLIC_SITE_URL`) | user / Vercel — not CI |
| Release | `pnpm release` (`semantic-release`, runs in `release.yml` on push to `main`) | CI on `main` |
| New phase | `git checkout -b phase/NN-name` from latest `main` | agent |
| Ship phase | `git merge --squash phase/NN-name` → one Conventional Commit | agent |

---

*This guide is a living document. After each new project, add the key lesson as one paragraph under the relevant section and update the phase table with the new repo’s timeline. Open a PR — keep it tested and conventional.*
