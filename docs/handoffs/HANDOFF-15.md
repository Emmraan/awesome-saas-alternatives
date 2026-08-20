# HANDOFF — phase/15

**Goal:** Agentic build guide. Tasks: `AGENTIC_BUILD_GUIDE.md` — full build-flow report/guide: intake, skill selection, phases, branches, merge strategy, handoffs, maintenance, CHANGELOG/semantic-release setup — reusable for future projects, improvable over time. Exit criteria: guide complete; user review; covers CHANGELOG.md generation via semantic-release.

**Branch:** `phase/15-agentic-build-guide`

**Status:** complete

**Files touched:**
- `AGENTIC_BUILD_GUIDE.md` (new) — 4144 words, reusable playbook distilled from P0→P14:
  - Header + intro (what/why/audience) + full TOC (16 sections).
  - **Who this guide is for** + prerequisites (Node 22, pnpm, GitHub, Vercel).
  - **Core principles:** 6 non-negotiables (research→skill→plan→code; pnpm + low-end machine rule; fast-dev incremental; branch-per-phase squash-merge; no fabrication; `.agents/` committed).
  - **Lifecycle at a glance:** `DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP` from `loop-orchestrator` with repo mapping (P0 DEFINE/PLAN, P2–P11 BUILD, P12 VERIFY, P13–P14 REVIEW, P15+release SHIP) and L1–L4 scaling.
  - **Intake:** clarification round, pinning scope, plan approval as the one required human gate.
  - **Planning:** phase design (16-phase delivery order), file ownership map reference (Appendix B), `incremental-implementation`, skill load map.
  - **Branching and merging:** `phase/NN-name` naming, cut-from-latest-main, `git merge --squash` one Conventional Commit per phase, fix-in-same-branch rule, budget/escalation.
  - **Handoffs and live tracker:** `PLAN.md` as live tracker + `docs/handoffs/HANDOFF-NN.md` template from `PLAN.md` Session handoff protocol.
  - **Skill system:** `.agents/skills/` + `skills-lock.json` (hash-pinned), `using-agent-skills` load order, Core Kit (always on) + base `repository-foundation-scaffold` + design base `design-taste-frontend`/`minimalist-ui` + per-phase extras (P1 `nextjs`/`typescript`/`tailwind-css` … P15 `technical-writer` only).
  - **Verification:** fast-dev (`lint-staged`, `tsc incremental`, `vitest --changed`) vs full-suite before merge (`lint`/`typecheck`/`test:coverage`/`validate-data`), `lib/` 80% gate (achieved 98.62%/91.93%/100%/98.91%), `next build` deferred rule.
  - **Documentation:** README vs CONTRIBUTING vs `docs/` IA, sentence-case/gerund/prerequisites style guide application.
  - **CI and releases:** `validate.yml` (PR path-filtered lint→typecheck→test:coverage→validate-data, `contents: read`) vs `release.yml` (push→main `semantic-release`, `contents: write` etc.); `release.config.mjs` walkthrough (commit-analyzer → release-notes-generator → changelog → npm off → git → github), `[skip ci]` asset commit, Conventional Commits versioning, `changesets` monorepo alternative.
  - **Maintenance:** `engines`/`packageManager` sync, `pnpm-workspace.yaml` approved builds, `lib/schemas.ts` as single source of truth, `docs/reference/product-source-list.md` canonical seed, `sync-github` idempotent core/helpers and `GITHUB_TOKEN` rate limits.
  - **Reusing for a new project:** copy-paste checklist (seed repo → define phases → run lifecycle → ship and maintain) with `PLAN.md`/`AGENTS.md`/`skills-lock.json` seeding steps.
  - **Troubleshooting:** 9-entry symptom→cause→fix table (sitemap, `replaces`, coverage, lint-staged, semantic-release, `sync:github`, skill hash).
  - **Appendix A** — concrete P0–P15 timeline table (branches, extra skills, tasks, exit criteria), branches all squash-merged in numeric order on `main`.
  - **Appendix B** — file ownership map (authoritative from `PLAN.md`).
  - **Appendix C** — command reference (who runs each command).
  - Links verified (18 markdown links, 0 missing; 3 intra-doc anchors resolved; no skipped heading levels; living-document close-out note).
- `PLAN.md` (modified) — marks P15 `[x]` with date + evidence (this phase).
- `docs/handoffs/HANDOFF-15.md` (this file).

**Decisions:**
- **Single living guide at root, not `docs/`:** `PLAN.md` already reserves `AGENTIC_BUILD_GUIDE.md` as the P15-owned root artifact — visible on first clone, stable link from `README.md` (future line) and handoffs. Keeps the glossary searchable without digging into `docs/`.
- **Structure follows `technical-writer` (conceptual → referential → procedural → troubleshooting) with `loop-orchestrator` lifecycle embedded:** conceptual framing (who/why/principles), referential tables (phase timeline, ownership, skill map, command reference), procedural checklists (intake → plan → build → verify → review → ship, and the 4-step reuse checklist), then troubleshooting. This mirrors the README’s what→install→usage→features→API→contributing→license spine.
- **Evidence-first, not lore:** every workflow claim cites a checkable file (`AGENTS.md:20`, `PLAN.md:30 File ownership map`, `release.config.mjs:1`, `.github/workflows/validate.yml:1`, `vitest.config.mts` gate 80). The P0→P15 table is derived from `git log --oneline --reverse` + `docs/handoffs/HANDOFF-0N.md`, not reconstructed from memory.
- **CHANGELOG coverage kept factual and bounded:** document that `CHANGELOG.md` is auto-generated (`@semantic-release/changelog`) and **not hand-edited**, that `release.yml` only runs on push to `main`, and that `changesets` is the monorepo alternative — without speculating on future version numbers. Guide explicitly notes `npmPublish: false` because this is a site, not a published package.
- **No code churn this phase:** docs-only phase, so no lint-scope risk. Still ran the full quality suite as exit evidence (see Verification) to confirm the repo remains green after the new markdown file.

**Verification:**
- `npx eslint .` → 0 errors, 0 warnings (exit 0).
- `npx tsc --noEmit` → clean (exit 0).
- `npx vitest run` → 143/143 passed (10 files, exit 0).
- `npx vitest run --coverage` → lib Statements 98.62% / Branches 91.93% / Functions 100% / Lines 98.91% (gate ≥80% ✓).
- `npx tsx scripts/validate-data.ts` → ✓ 58 categories, 15 features, 181 products — all valid.
- Guide link check: `python -c` scanned 18 markdown links (0 missing), word count 4144, heading hierarchy checked (H1 → H2 → H3 only, no skipped levels; 3 false positives from `#` in code blocks excluded).
- File ownership OK: `AGENTIC_BUILD_GUIDE.md` is P15-owned per `PLAN.md:60`.

**Next phase:** none — delivery complete (`P0 foundation → P1 scaffold → P2 data layer → P3-5 data batches → P6 components → P7 homepage → P8 directory → P9 product → P10 cat/search → P11 SEO → P12 tests → P13 sync/CI → P14 docs/release → P15 agentic-build-guide → final main`). Future work is captured in open issues below. User review of `AGENTIC_BUILD_GUIDE.md` is the last required gate.

**Open issues / follow-ups:**
- **User review of `AGENTIC_BUILD_GUIDE.md`** — confirm tone, depth and reuse checklist match team needs; guide is designed to be improved iteratively after each new project.
- **Full `next build` still deferred to user (low-end machine rule)** — must run with `NEXT_PUBLIC_SITE_URL` set; CI covers correctness via lint/typecheck/tests/validate-data. Vercel runs `next build` on deploy.
- **Future ideas (from README → Roadmap):** richer comparison tables, “I switched from X to Y” notes, scheduled GitHub-metadata refresh workflow, and — once dataset grows — a lightweight API route for the catalog.
