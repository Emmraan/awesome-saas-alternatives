# AGENTS.md — awesome-saas-alternatives

Single source of truth for AI agents working in this repository. Read this file
first before touching anything. `CLAUDE.md` is a thin pointer back here.

## Project

**SaaS Alternatives** — a developer-focused directory/discovery site to find
free, open-source, self-hosted and lower-cost alternatives to popular paid SaaS.

- Tagline: *"Find open-source & free alternatives to the SaaS you already use."*
- Stack: Next.js + TypeScript + Tailwind CSS. Static, JSON-data-driven, no external DB.
- Data: ~170 products encoded in `data/*.json`. GitHub is the CMS.
- Deploy: Vercel. Package manager: **pnpm**.
- License: MIT.

## Workflow (non-negotiable)

1. **Research first, always.** Before ANY task/fix: web-fetch/reference check ->
   load the right skill (`.agents/skills/`) -> plan -> only then code. Never implement blindly.
2. **Branch-per-phase.** `phase/NN-name`, squash-merge to `main`, one commit per
   phase. Cut each branch from the latest `main` AFTER the previous merge.
3. **`pnpm` only.** The agent writes deps into `package.json`; the **user runs
   install/build commands**. Never run heavy installs/builds without the user's
   go-ahead (low-end machine rule).
4. **Fast dev.** Lint/typecheck/build/test run ONLY on new/modified files
   (lint-staged, `tsc incremental`, vitest `--changed`). Never the full suite on
   every change.
5. **No fabrication.** GitHub stars/license/release metadata must be `null` unless
   fetched from the GitHub API.
6. **Conventional Commits** on every commit; `feat`/`fix` types feed semantic-release.

## Repo layout

| Files | Description |
|---|---|
| `AGENTS.md`, `CLAUDE.md`, `LICENSE`, `.gitignore`, `.editorconfig`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, `CHANGELOG.md`, `.nvmrc`, `.vscode/settings.json`, `.agents/`, `.claude/`, `skills-lock.json` | Project config & agent skills |
| `package.json`, `next.config.*`, `tsconfig.json`, `app/layout.tsx`, `app/globals.css` | Scaffold & design system |
| `lib/types.ts`, `lib/data.ts`, `data/*.json`, `scripts/validate-data.ts` | Data layer |
| `components/ui/*`, pages, tests, CI | Features & quality gates |

## Commands

| Task | Command | Who runs |
|---|---|---|
| Install deps | `pnpm install` | user (agent writes deps only) |
| Typecheck | `tsc --noEmit` (incremental) | agent, on changed files |
| Lint | lint-staged (staged files) | agent |
| Test | `vitest` (`--changed`) | agent |
| Validate data | `scripts/validate-data.ts` via pnpm script | agent (from P2) |
| Build | `next build` | user (heavy) |

## Skills

Installed skills live in `.agents/skills/` (and `.claude/skills/`); locked
versions in `skills-lock.json`.