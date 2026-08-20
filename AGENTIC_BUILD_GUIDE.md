# Agentic build guide — universal

> A deterministic, skill-driven workflow for building complex projects with an AI agent while a human stays in the review loop.

This guide is **project-agnostic**. It defines the intake, planning, skill selection, phased execution, branching, handoffs, verification, maintenance and release flow that any AI agent should follow for **your** next project. Replace the placeholders (`<PROJECT_NAME>`, `<STACK>`, `<DATA_DIR>`) with your project's specifics. [Appendix A](#appendix-a--example-instantiation-awesome-saas-alternatives) shows how the same workflow was instantiated for `awesome-saas-alternatives` (P0→P15) as a concrete example — read it as an example, not the rule.

> **For the AI agent:** read `AGENTS.md` first, then this guide, then the project's `PLAN.md` before touching any code.

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
- [Appendix A — example instantiation: awesome-saas-alternatives](#appendix-a--example-instantiation-awesome-saas-alternatives)
- [Appendix B — file ownership map template](#appendix-b--file-ownership-map-template)
- [Appendix C — command reference template](#appendix-c--command-reference-template)

---

## Who this guide is for

- Any builder (solo or team) who wants an AI agent to do the bulk of implementation while a human reviews at phase boundaries.
- Teams that need a **deterministic** workflow: every phase has a branch, a checkable exit criterion and a handoff — the loop decides done, not confidence.
- AI agents that need to understand **how to build a particular project** without being re-prompted each time — read this guide, then the project's `PLAN.md` which instantiates it.

**Prerequisites (adapt to your stack):** `git`, a package manager (`pnpm` for Node, `uv`/`pip` for Python, `cargo` for Rust, etc.), a GitHub repo, and a deploy target. The examples below use Node 22 + pnpm + Next.js + Vercel — replace them with your stack's equivalents.

---

## Core principles

These rules transfer to **any** project that adopts this guide. Put them in your project's `AGENTS.md` and enforce them.

1. **Research first, always.** Before any task or fix: fetch the relevant reference, load the right skill via `using-agent-skills`, plan, then code. Never implement blindly.
2. **Package manager discipline.** The agent writes dependencies into the manifest (e.g. `package.json`); the **human runs install and build commands**. The agent never runs heavy installs or production builds without an explicit go-ahead (low-end machine rule).
3. **Fast dev.** Lint, typecheck, build and test run **only on new or modified files** (`lint-staged`, `tsc --incremental`, `vitest --changed`, or your stack's equivalent). Full-suite runs are opt-in.
4. **Branch-per-phase, squash-merge.** Every phase is a branch `phase/NN-name`, squash-merged to `main` as one Conventional Commit. Errors are fixed inside the same phase branch.
5. **No fabrication.** Data that comes from an external API (GitHub stars, licenses, prices, etc.) stays `null`/empty until fetched from the source of truth. The agent never invents it.
6. **Agent config is committed.** `.agents/`, `.claude/` and `skills-lock.json` stay in the repo so every session starts from the same skill versions.

---

## Lifecycle at a glance

The orchestrator is `loop-orchestrator` (`DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP`). Each phase is a loop with a **checkable** exit condition — the loop, not confidence, decides when it is done. Maker and checker are separate: `BUILD` does not grade its own work; `VERIFY` and `REVIEW` re-check from a fresh perspective.

```
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
  loop    loop   inner    checker   loop    loop
```

Map the lifecycle to your project's phases in `PLAN.md`. Generic mapping:

| Lifecycle stage | Typical phases | What it means |
|---|---|---|
| DEFINE | P0 | Repo foundation, `PLAN.md` as master plan, `AGENTS.md` as agent contract |
| PLAN | P0–P1 | Phase breakdown, file ownership, skill load map, scaffold |
| BUILD | P2–P11 | Domain layer → components → pages/features → integrations |
| VERIFY | P12 | Test suite + coverage gate |
| REVIEW | P13–P14 | External sync/CI review, docs polish, final `code-reviewer` + `code-simplification` |
| SHIP | P15 + release workflow | Guide, handoffs, squash-merges to `main`, `semantic-release` on push |

For small fixes, scale the loop down (L1–L2: `BUILD → VERIFY` only). For a full app, run the full lifecycle (L4). If unsure between two levels, pick the higher one.

> Concrete example: see [Appendix A](#appendix-a--example-instantiation-awesome-saas-alternatives) for how `awesome-saas-alternatives` mapped P0→P15 to this lifecycle.

---

## Intake — clarifying the brief

Do not skip the intake round when the request is vague. One clarification pass saves a full rebuild.

1. **Surface the 2–3 assumptions that most change the outcome.** Generic prompts the agent should ask:
   - What is the deployment target and must it be static/serverless/with a DB?
   - What is the data budget and source of truth for v1?
   - What must be live on day one vs. what can be `null` until a sync job fills it?
   - What stack and package manager are non-negotiable?
2. **Pin scope and boundaries in writing.** Freeze in `PLAN.md` before any code: tagline, stack, data shape, deploy target, and the file ownership map. The next phase reads `PLAN.md` as the contract.
3. **Present a plan for approval.** Tasks, acceptance criteria and order go in `PLAN.md` → Phase tracker. Wait for approval — this is the one required human gate. After approval, the run continues autonomously through `SHIP` without re-asking.

If the human says “just do it, no need to ask”, skip intake but still present the plan for approval before the autonomous run starts.

---

## Planning — phases, ownership and skills

### Designing the phases

Use `planning-and-task-breakdown`. Split the spec into small, verifiable phases, each with a branch, skill set and exit criterion. Order by dependency.

Generic delivery order template (adapt to your project):

```
P0 foundation → P1 scaffold → P2 domain/data layer → P3–P5 data/content batches
→ P6 design system → P7–P11 features/pages → P12 tests → P13 sync/CI
→ P14 docs/release → P15 agentic-build-guide → final main
```

Every phase = a new session = a new branch = a merge to `main` before the next phase.

### File ownership map

Assign each file pattern to exactly one owner phase to avoid merge conflicts. Example template — replace the paths with your project's layout:

| Files | Owner phase |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.agents/`, `skills-lock.json` | P0 |
| `package.json`, lockfile, `next.config.*`/`vite.config.*`, `tsconfig.json`, `app/layout.tsx` or `src/main.*` | P1 |
| `<DATA_DIR>/*.json` or `<SCHEMA_DIR>/*`, domain loaders, validation scripts | P2 |
| Domain data batches | P3–P5 |
| `components/ui/*` or `src/components/*` | P6 |
| Feature pages/routes | P7–P11 |
| `tests/**`, test config | P12 |
| `.github/workflows/`, sync scripts, `CONTRIBUTING.md`, `.env.example`, `release.config.*` | P13 |
| `README.md`, `docs/**` | P14 |
| `AGENTIC_BUILD_GUIDE.md` | P15 |

If a later phase must touch a file owned by an earlier phase, note it in the handoff and get explicit approval — don't silently drift. The authoritative map for your project lives in `<PROJECT>/PLAN.md` → File ownership map; keep Appendix B in sync.

### Incremental implementation

Inside each phase, use `incremental-implementation`: implement one slice, verify it, commit, repeat. No broad rewrites without a rebuild path. Prefer additive changes; use small PR-shaped slices even inside a single branch.

---

## Branching and merging

Branch naming: `phase/NN-name` in numeric order (e.g. `phase/02-data-layer`). Each branch is cut from the latest `main` **after** the previous merge — this keeps the history conflict-free.

```sh
# Start the next phase from a clean main
git checkout main
git pull
git checkout -b phase/NN-name

# ... implement, verify, hand off ...

# Squash-merge to main as one Conventional Commit per phase
git checkout main
git merge --squash phase/NN-name
git commit -m "feat: <what this phase shipped> (PNN)"
git branch -D phase/NN-name
```

Rules:

- **One commit per phase.** Squash-merge preserves a clean linear history and gives `semantic-release` one commit to analyze per version.
- **Fix errors in the same phase branch, never after merge.** If `VERIFY` or `REVIEW` fails, fix on the phase branch, re-verify, then merge.
- **No merge while the exit criterion is unmet.** The phase loop's deterministic condition — not “it feels done” — decides done.
- Budget: if the same slice fails twice, stop and escalate with evidence instead of silently retrying a third time.

---

## Handoffs and the live tracker

### `PLAN.md` is the live tracker

Every phase row in `PLAN.md` ends with `Status: [ ] pending` → `[x] completed YYYY-MM-DD — evidence`. Update it on the same branch at the end of the phase. The next session reads `<PROJECT>/PLAN.md` → `<PROJECT>/AGENTS.md` → the latest `docs/handoffs/HANDOFF-NN.md` and cuts the next branch.

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

The handoffs are the audit trail. They should surface the “why” (e.g. why a validation is Zod-driven, why a build hard-errors without an env var, why counts are contextual).

### `docs/LOOP.md` (optional)

If you adopt `loop-orchestrator` fully, create `docs/LOOP.md` as the loop's memory across sessions (Goal, Success criteria, Level L1–L4, Phase Status). Read it at session start and continue from the last phase status — never restart a tracked loop.

---

## Skill system

Skills live in `.agents/skills/` (and `.claude/skills/`), pinned in `skills-lock.json`. Load them via `using-agent-skills` — never guess.

- **Always on (Core Kit):** `loop-orchestrator`, `using-agent-skills`, `planning-and-task-breakdown`, `incremental-implementation`, `testing`, `test-master`, `code-reviewer`, `code-simplification`, `version-control`, `sdlc-workflow`, `forward-deployed-engineer`, `technical-writer`.
- **Base (all phases):** `repository-foundation-scaffold` (incremental builds, `lint-staged`, low-end machine rules).
- **Design base for UI phases:** `design-taste-frontend` + `minimalist-ui` — “no AI-slop” UI discipline.
- **Per-phase extras** are mapped in `PLAN.md` → Skill load map. Examples: scaffold phases add `nextjs` + `typescript` + `tailwind-css`; search/category phases add `seo` + `frontend-core`; CI phases add `github-actions-engineering` + `open-source-project-maintainer`; the final guide phase is `technical-writer` only.

**Version control for skills.** `skills-lock.json` records `source`, `skillPath` and `computedHash` per skill. Commit them. If you upgrade a skill, update the lock and note it in the handoff.

**Loading order.** Before any phase: fetch the relevant reference → load the skill → plan → code. The skill's `SKILL.md` is the authoritative workflow — follow it, don't paraphrase it from memory.

---

## Verification — fast dev and quality gates

### Fast-dev defaults (every edit)

- `lint-staged` on staged files (`eslint --fix` or your linter).
- Incremental typecheck/build (`tsc --incremental`, `cargo check`, etc.) on changed files.
- Change-aware tests (`vitest --changed`, `pytest -k changed`, etc.) during development.

Never run the full suite on every keystroke.

### Full-suite checks (before merge and in CI)

Run the full checks as the phase's exit evidence. Example for a Node project (replace with your stack):

```sh
pnpm lint              # lint on all files — must be 0 errors, 0 warnings
pnpm typecheck         # typecheck
pnpm test              # all tests green
pnpm test:coverage     # coverage with gate, e.g. lib/ ≥ 80%
pnpm validate-data     # domain-specific validation, e.g. Zod on JSON
```

Define your gates in `PLAN.md` and enforce them in CI. Example gates: `lib/` coverage ≥ 80% on statements/branches/functions/lines, and domain data validation must be green before any data phase merges.

### Heavy builds

Heavy commands like `next build`, `docker build`, or `cargo build --release` are **not** run by the agent on every phase (low-end machine rule). They are deferred to the human or to the deploy host, but they should fail fast on misconfiguration (e.g. hard-error if a required env var like `NEXT_PUBLIC_SITE_URL` is missing).

### Review

Run `code-reviewer` (five-axis: correctness, performance, maintainability, tests, security) and, when complexity warrants, `code-simplification` (preserve behavior, follow conventions, clarity over cleverness). Fix only blocking findings inside the same phase branch.

---

## Documentation

**README is the front door.** Structure: name + one-line what-it-does → quick install → quick usage → key features → tech stack → data/domain model → scripts → contributing → license. Lead with the most important information.

**CONTRIBUTING is the maintainer contract.** Setup, tested-PR rule (lint + typecheck + tests + domain validation before opening a PR), Conventional Commits, and the contribution flow for your data/content.

**`docs/` mirrors the information architecture.** `docs/handoffs/` is the per-phase log; `docs/reference/` holds canonical source tables or ADRs. Keep `docs/` and any docs-site (Docusaurus/VitePress/MkDocs) in sync — same content type, ordering and frontmatter. See `technical-writer` → Repo docs vs docs website.

**Style rules** (from `technical-writer/references/style-guide.md`): sentence case headings, gerund titles for procedures (“Creating…”), 1–2 sentence intros, prerequisites up front, numbered steps for sequential procedures with one action per step, descriptive link text (never “click here”), alerts used sparingly, consistent placeholder style (`YOUR_API_KEY`), proper heading hierarchy (no skipped levels), and accessibility (alt text, descriptive links, correct heading order).

---

## CI and releases

### Two workflows, two triggers

| Workflow | File | Trigger | What it does |
|---|---|---|---|
| Validate | `.github/workflows/validate.yml` | PRs and pushes to `main`, path-filtered to your source + config | Install (`--frozen-lockfile`) → lint → typecheck → test:coverage → domain validation |
| Release | `.github/workflows/release.yml` | Push to `main` | Install → `semantic-release` |

`validate.yml` is the quality gate — PRs cannot merge below it. `release.yml` is the ship gate — it runs only after a squash-merge to `main`.

Permissions are least-privilege: `validate` has `contents: read`; `release` has `contents: write` + `issues: write` + `pull-requests: write` for tags, releases and changelog commits.

### `semantic-release` setup

Config lives in `release.config.mjs` (also documented in `PLAN.md` → CHANGELOG.md strategy):

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

Dependencies: `semantic-release`, `@semantic-release/changelog`, `@semantic-release/commit-analyzer`, `@semantic-release/git`, `@semantic-release/github`, `@semantic-release/npm`, `@semantic-release/release-notes-generator`. Scripts: `"release": "semantic-release"` and `"prepare": "husky"` (lint-staged hook).

Behavior:

- **Conventional Commits drive versioning** (`feat:` → minor, `fix:` → patch, `feat!:` / `BREAKING CHANGE:` → major). Every squash-merge commit must follow the convention — enforced via the PR template and `CONTRIBUTING.md`.
- **One squash-merge = one release unit.** The config analyzes the single squash commit, derives the version, writes `CHANGELOG.md` via `@semantic-release/changelog`, commits the changelog + manifest + lockfile via `@semantic-release/git` with `[skip ci]` so the release commit does not re-trigger CI, and creates the GitHub release via `@semantic-release/github`.
- **`npmPublish` is off** for non-library projects. For libraries, turn it on. For monorepos, consider `changesets` instead — document the decision so the next project can re-evaluate.
- **Do not edit `CHANGELOG.md` by hand.** The placeholder in P0 exists only so the first release has a file to update; after that the file is auto-generated. The format is Keep a Changelog + SemVer.

### CHANGELOG strategy in practice

1. Phases land on `main` as `feat:`, `fix:`, `docs:`, etc. (always with `[skip ci]` for docs/chore phases if you want to skip CI).
2. On push to `main`, `release.yml` runs `semantic-release`, which reads commits since the last tag, generates notes, writes `CHANGELOG.md`, bumps the manifest, commits and tags the release, and publishes the GitHub release.
3. `CHANGELOG.md` and the release notes are the project's public changelog — `README.md` and `CONTRIBUTING.md` point to them and warn not to hand-edit the file.

---

## Maintenance — day-2 operations

**Dependency discipline.** The agent writes manifests; the human runs installs and production builds. Keep `engines`/`packageManager` and `.nvmrc` in sync. Record approved build approvals in your lockfile's allowlist (e.g. `pnpm-workspace.yaml:approvedBuilds` for `esbuild`).

**Domain data pipeline.** Define your domain schemas as the single source of truth (e.g. `lib/schemas.ts` with Zod). Validation scripts enforce uniqueness, cross-references, and the `null`-unless-fetched rule for external data. Keep the canonical seed table in `docs/reference/<SOURCE>.md` — read it, not ad-hoc chat logs.

**External sync.** If your project mirrors external data (GitHub stars, npm downloads, etc.), put IO in one script and pure helpers in a `*-core.*` module. Make it idempotent: only refetch stale records (e.g. older than `--max-age-hours`), support `--force`, and use a byte-exact serializer so diffs are minimal. Document rate limits and token setup in `.env.example`.

**Tests and coverage.** Put your test config's aliases, coverage gates and setup in one place (e.g. `vitest.config.mts` for Node). Keep tests in `tests/` and run coverage before every phase merge.

**Docs hygiene.** `README.md` is the front door; `CONTRIBUTING.md` is the contribution contract; `docs/handoffs/` is the phase log. The next phase always starts by reading `PLAN.md` → `AGENTS.md` → the latest handoff.

**Low-end machine rule stays after ship.** CI runs lint, typecheck, tests and domain validation — never heavy builds. The deploy host runs the production build; locals run it with the required env vars present.

---

## Reusing this guide for a new project

Copy and adapt this checklist. Improve this guide in place after each new project.

### 1. Seed the repo

- [ ] Run `repository-foundation-scaffold` at the right level: L1 solo starter, L2 team/community, or L3 paid-SaaS. Only create the files that level justifies — never a kitchen sink.
- [ ] Create `PLAN.md` from the template in your previous project's `PLAN.md` (What we're building → Global rules → Git strategy → File ownership map → Skill load map → Phase tracker → Session handoff protocol → CHANGELOG strategy → Delivery order recap) — replace all project-specific values.
- [ ] Create `AGENTS.md` (and `CLAUDE.md` as a thin pointer). Fill in tagline, stack, data shape, and package-manager + branch + fast-dev rules.
- [ ] Pin `.nvmrc`, `.editorconfig`, `.gitignore`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`, `.vscode/settings.json`, and commit `.agents/`, `.claude/`, `skills-lock.json`.
- [ ] Install the skill set you need and record them in `skills-lock.json`.

### 2. Define the phases

- [ ] List phases in delivery order (foundation → scaffold → domain → components → features → tests → sync/CI → docs → guide). Give each a branch name `phase/NN-name`, owner files, extra skills, tasks, and a **checkable** exit criterion.
- [ ] Assign file ownership so no two phases write the same file without explicit coordination.
- [ ] Example: copy [Appendix A](#appendix-a--example-instantiation-awesome-saas-alternatives) and replace the domain batches with your project's entities.

### 3. Run the lifecycle

- [ ] **Intake:** one clarification round, then plan approval.
- [ ] **Branch:** `git checkout -b phase/NN-name` from latest `main`.
- [ ] **Build:** load the phase's skills, implement slices with `incremental-implementation`, keep commits working.
- [ ] **Verify:** full checks (lint, typecheck, test:coverage, domain validation). Fix in the same branch.
- [ ] **Review:** `code-reviewer` (+ `code-simplification` when complexity warrants).
- [ ] **Handoff:** write `docs/handoffs/HANDOFF-NN.md`, mark `PLAN.md` `[x] YYYY-MM-DD — evidence`.
- [ ] **Ship:** `git merge --squash` → one Conventional Commit → push to `main`. The release workflow handles the rest.

### 4. Ship and maintain

- [ ] Keep Conventional Commits clean — they feed `semantic-release`.
- [ ] Never hand-edit `CHANGELOG.md` after the first auto-release.
- [ ] Re-run external sync periodically if your data has stale external fields.
- [ ] Evolve this guide: after each project, add the lesson as a one-paragraph note under the relevant section and update the example in Appendix A.

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Production build fails locally | Required env var missing (e.g. `NEXT_PUBLIC_SITE_URL` for Next.js sitemap) | `cp .env.example .env.local` and set the var; make the build hard-error by design |
| Domain validation fails on references | Reference points to a non-existent entity | Fix the name in your data file or add the missing entity |
| Coverage below gate (e.g. 80%) | New domain code added without tests | Add tests for the new branch; keep the gate in your test config |
| `lint-staged` does nothing on commit | No staged files matching the pattern | Stage the files first; `validate.yml` still runs full lint in CI |
| `semantic-release` does not create a release | No qualifying Conventional Commit since last tag, or branch is not `main` | Ensure the squash commit uses `feat:` / `fix:`; check `release.yml` triggers only on push to `main` |
| External sync hits rate limits | API token missing | Create a PAT, set the token in `.env.local`, re-run |
| External fields still `null` after sync | Source record missing the `repo`/`id` field | Add the source identifier field; the sync script skips entries without it |
| `skills-lock.json` hash mismatch | Skill updated without re-locking | Re-run the skill installer / update flow so `computedHash` reflects the new `SKILL.md` |

---

## Appendix A — example instantiation: awesome-saas-alternatives

> This appendix shows how the universal workflow above was instantiated for one concrete project. Use it as a reference when you instantiate the workflow for your own project — don't copy its domain specifics.

**Project:** SaaS Alternatives — a developer-focused directory that maps paid SaaS to self-hosted/open-source alternatives. Tagline: *"Find open-source & free alternatives to the SaaS you already use."*

**Stack:** Next.js 16 (App Router) + TypeScript 5.9 + Tailwind CSS v4 + Zod + Vitest + `semantic-release` + pnpm 11.22 + Node 22. Deploy: Vercel, static, JSON-data-driven, no external DB.

**Data:** `data/products.json` (181 products = 115 paid + 66 alternatives), `data/categories.json` (58 categories, 17 top-level + 41 children), `data/features.json` (15 features, 8 groups). Canonical seed: `docs/reference/product-source-list.md` (131 rows).

All branches were cut from `main` after the previous merge and squash-merged back as one Conventional Commit per phase.

| Phase | Branch | Skills (extra) | Tasks | Exit criterion |
|---|---|---|---|---|
| P0 | `phase/00-repo-foundation` | `open-source-project-maintainer` | `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `skills-lock.json`, `docs/reference/product-source-list.md` | All files exist + valid, initial commit on `main`, `git status` clean |
| P1 | `phase/01-scaffold` | `nextjs`, `typescript`, `tailwind-css`, `react`, `design-taste-frontend` | `package.json`, `next.config.*`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css`, design tokens, dark-mode base | Configs valid; user verified `pnpm install` / `lint` / `typecheck` / `build` |
| P2 | `phase/02-data-layer` | `typescript`, `frontend-core` | `lib/types.ts`, `lib/data.ts`, `lib/schemas.ts`, `data/categories.json`, `data/features.json`, `scripts/validate-data.ts`, `data/products.json` placeholder, `tests/data.test.ts` | `validate-data` ✓, `tsc` clean, 11 tests green |
| P3 | `phase/03-data-products-a` | `code-documenter` | 78 products — Infra/DB/Auth/Storage/Analytics/Monitoring | `validate-data` ✓ 78 products, `tsc` clean |
| P4 | `phase/04-data-products-b` | `code-documenter` | 40 products — Automation/Communication/Email/Git-CI | `validate-data` ✓ 118 products |
| P5 | `phase/05-data-products-c` | `code-documenter` | 63 products — Design/Productivity/PM/Internal/AI/Security/Billing-CRM | `validate-data` ✓ 181 products — data phase complete |
| P6 | `phase/06-core-components` | `frontend-craft`, `design-taste-frontend`, `minimalist-ui`, `react`, `tailwind-css` | 14 `components/ui/*` + `lib/cn.ts` + `lib/format.ts` | Build pass; components render with live data; no AI-slop |
| P7 | `phase/07-homepage` | `frontend-craft`, `minimalist-ui`, `seo`, `frontend-performance` | 6 homepage sections + `SiteHeader`/`SiteFooter`/`ThemeToggle` | Homepage renders with live data; `generateMetadata` set |
| P8 | `phase/08-directory` | `frontend-core`, `frontend-craft`, `typescript` | `/alternatives` — filters, sort, pagination, mobile drawer; `lib/directory.ts` | Filters + sort + pagination + drawer all work |
| P9 | `phase/09-product-detail` | `seo`, `nextjs`, `frontend-craft` | `/alternatives/[slug]` — badges, comparison, JSON-LD; `lib/product-detail.ts` | All 181 products generate pages |
| P10 | `phase/10-categories-search` | `seo`, `nextjs`, `frontend-core` | `/categories` + `/categories/[slug]` + `/search`; `lib/search.ts`, `lib/categories.ts` | Search queries correct |
| P11 | `phase/11-contribute-seo` | `seo`, `nextjs`, `markdown-for-agents` | `/contribute`, `sitemap.ts`, `robots.ts`, `llms.txt`, `opengraph-image.tsx`, `lib/seo.ts` | Sitemap valid; robots correct; metadata on every page |
| P12 | `phase/12-tests` | `testing`, `test-master`, `code-reviewer` | `@vitest/coverage-v8`, `vitest.config.mts`, schema/component tests — 118 tests total | `pnpm test` green; `lib/` coverage ≥ 80% (achieved 98.62%/91.93%) |
| P13 | `phase/13-sync-ci` | `github-actions-engineering`, `open-source-project-maintainer` | `scripts/sync-github.ts` + `core`, `validate.yml`, `release.yml`, `release.config.mjs`, `CONTRIBUTING.md`, `.env.example`, `husky` + `lint-staged` | Sync idempotent; workflow YAML valid; release config valid |
| P14 | `phase/14-docs-release` | `technical-writer`, `code-documenter`, `code-reviewer`, `code-simplification` | `README.md` + docs polish + final review/simplification pass | README complete; no blocking findings; lint/typecheck/test green |
| P15 | `phase/15-agentic-build-guide` | `technical-writer` | This guide (first repo-specific, then generalized to universal) | Guide complete; user review; covers `CHANGELOG.md` via `semantic-release` |

Git log on `main` (one squash commit per phase, numeric order preserved) and the per-phase handoffs in `docs/handoffs/` are the source of truth for sequencing.

---

## Appendix B — file ownership map template

Adapt this table to your project. The authoritative map for your project lives in `PLAN.md`.

| Files | Owner phase |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `PLAN.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `skills-lock.json`, `docs/reference/<SOURCE>.md` | P0 |
| `package.json`, lockfile, `next.config.*`/`vite.config.*`, `tsconfig.json`, layout/entry files | P1 |
| Domain schemas/types/loaders/validation (`lib/schemas.*`, `<DATA_DIR>/*`, `scripts/validate-data.*`) | P2 |
| Domain data batches | P3–P5 |
| `components/ui/*` or `src/components/*` | P6 |
| Feature pages/routes | P7–P11 |
| `tests/**`, test config | P12 |
| `.github/workflows/`, sync scripts, `CONTRIBUTING.md`, `.env.example`, `release.config.*` | P13 |
| `README.md`, `docs/**` | P14 |
| `AGENTIC_BUILD_GUIDE.md` | P15 |

---

## Appendix C — command reference template

Replace `pnpm`/`next` with your stack's commands. The “who runs” column enforces the low-end machine rule.

| Task | Command example | Who runs |
|---|---|---|
| Install deps | `pnpm install` | human (agent writes manifest only) |
| Typecheck (incremental) | `pnpm typecheck` (`tsc --noEmit`) | agent on changed files |
| Lint (changed) | `pnpm lint` / `lint-staged` on `*.{ts,tsx}` | agent on changed files |
| Tests | `pnpm test` (`vitest run --changed` in dev, full `vitest run` before merge) | agent |
| Coverage gate | `pnpm test:coverage` (e.g. `lib/` ≥ 80%) | agent + CI |
| Validate data | `pnpm validate-data` (`tsx scripts/validate-data.ts`) | agent on data changes + CI |
| External sync | `pnpm sync:github [-- --limit 1] [-- --force]` | human with token |
| Build (heavy) | `pnpm build` (`next build`, needs env var) | human / deploy host — not CI |
| Release | `pnpm release` (`semantic-release`, runs in release workflow on push to `main`) | CI on `main` |
| New phase | `git checkout -b phase/NN-name` from latest `main` | agent |
| Ship phase | `git merge --squash phase/NN-name` → one Conventional Commit | agent |

---

*This guide is a living document. After each new project, add the key lesson as one paragraph under the relevant section and update Appendix A with the new project's instantiation. Keep the core generic and push project-specific details to the appendix. Open a PR — keep it tested and conventional.*
