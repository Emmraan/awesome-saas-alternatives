# HANDOFF — phase/13

**Goal:** GitHub sync script + CI + contribution flow. Tasks:
`scripts/sync-github.ts` (stars/forks/license/release, idempotent, `GITHUB_TOKEN`),
`.env.example`, `.github/workflows/validate.yml` (lint + typecheck + test +
validate-data on PR, path-filtered), `.github/workflows/release.yml`
(semantic-release on push to main), `release.config.mjs`, `CONTRIBUTING.md`.
Exit criteria: sync script runs twice safely; CI workflow syntax valid;
CONTRIBUTING complete; release config valid (npm publish off, changelog + git plugins).

**Branch:** `phase/13-sync-ci`

**Status:** complete

**Files touched:**
- `scripts/sync-github-core.ts` (new) — pure, framework-free core:
  - `isGithubStale` (24h default freshness, configurable), `selectReposToSync`
    (idempotent: picks only products whose `github` is missing or stale, honoring
    `force`/`limit`).
  - `mapRepoResponse` / `mapReleaseResponse` — GitHub API → `githubMetadata`
    fields, zod-validated in the CLI layer (`fetchAndSync`).
  - `serializeValue` / `serializeProducts` — **byte-exact** serializer matching
    the hand-authored `data/products.json` layout: objects open at col 0, keys at
    indent 2, closing brace at indent 2, compact arrays, `[\n ... \n]\n` wrapper.
    Round-trips the committed file identically (verified).
- `scripts/sync-github.ts` (new) — CLI: loads `GITHUB_TOKEN` from env or
  `.env`/`.env.local`, optional `--force`, `--limit N`, `--max-age-hours N`;
  fetches repo + latest release per product, writes only changed products back
  to `data/products.json` with the byte-exact serializer; `isMain` guard so the
  module also runs as a plain TS file; the `sync:github` npm script maps to it.
- `tests/sync-github.test.ts` (new, 25 tests) — staleness logic, repo/release
  mapping (incl. sparse/null payloads, bad datetime, empty tag), product
  selection with force/limit/maxAge, serialize round-trip + nested github object,
  and a **byte-identical round-trip against the real `data/products.json`**.
- `package.json` (modified) — `sync:github` and `release` scripts; devDeps
  `@semantic-release/commit-analyzer@^13.0.1`, `@semantic-release/github@^12.0.9`,
  `@semantic-release/npm@^13.1.5`, `@semantic-release/release-notes-generator@^14.1.1`
  (explicit plugin deps; already present transitively in the lockfile).
- `pnpm-lock.yaml` (modified) — importer updated for the 4 explicit plugin devDeps
  (versions already existed as transitive deps; no network fetch needed).
- `.env.example` (new) — documents `GITHUB_TOKEN` (sync script) and
  `NEXT_PUBLIC_SITE_URL` (P11/P14 next.config), with the P12 closure note that
  `.env.local` already holds `NEXT_PUBLIC_SITE_URL` locally.
- `.github/workflows/validate.yml` (new) — PR + push-to-main, path-filtered to
  the files the CI actually checks; `contents: read`; `concurrency`
  cancel-in-progress; pnpm 11.22.0 + Node from `.nvmrc` with pnpm cache;
  `pnpm install --frozen-lockfile`, then lint, typecheck, **`test:coverage`
  (enforces the P12 `lib/` >= 80% gate)**, validate-data.
- `.github/workflows/release.yml` (new) — on push to main only, no cancel;
  full `fetch-depth: 0`; `permissions: contents/issues/pull-requests write`
  (needed for the release commit + GitHub release); runs `pnpm release`
  (semantic-release) via a pinned pnpm.
- `release.config.mjs` (new) — `branches: ["main"]`; plugins:
  commit-analyzer, release-notes-generator, changelog (`CHANGELOG.md`),
  npm (`npmPublish: false` — never publish to npm), git (assets
  `CHANGELOG.md`, `package.json`, `pnpm-lock.yaml`, message
  `chore(release): ${version} [skip ci]`), github. `const config` + default
  export to stay eslint-clean (no anonymous default export).
- `CONTRIBUTING.md` (new) — README-style contribution guide: project intro,
  local setup (pnpm/Node via `.nvmrc`), commands table, repo layout/ownership,
  branch-per-phase workflow + Conventional Commits, tested-PR rule, how to add a
  product, `sync:github` usage + `GITHUB_TOKEN`, PR/review/release flow, license.

**Decisions:**
- **Pure core + thin CLI split** — `sync-github-core.ts` has no fs/env/side
  effects (unit-testable); all IO lives in `sync-github.ts`.
- **Idempotency by default** — products with a fresh `github` block (< 24h) are
  skipped; `--force` overrides. Two consecutive real-API runs sync different
  repos (first coolify, second dokku), proving "runs twice safely".
- **Serializer is byte-exact, not JSON.stringify** — the committed file uses a
  non-standard layout (objects `{` at col 0, keys + closing brace at indent 2,
  compact arrays, CRLF in the working copy but LF in git). A generic
  `JSON.stringify(data, null, 2)` would rewrite all ~3800 lines. The custom
  serializer matches the file byte-for-byte (LF-normalized) so sync diffs are
  tiny (only the changed `github` block).
- **`GITHUB_TOKEN` optional at runtime** — script degrades to the
  unauthenticated 60 req/hr limit and warns; token recommended for the full
  catalog (~170 products × 2 calls). `.env.example` documents it; token never
  committed.
- **Release workflow is push-to-main only, non-cancellable** — release must
  never be interrupted mid-publish; validate.yml owns PR safety via
  cancel-in-progress + frozen lockfile.
- **Explicit plugin devDeps** — semantic-release loads plugins listed in config
  from the project's own deps; pinning them explicitly (matching the transitive
  versions already locked) makes the release workflow deterministic.

**Verification:**
- `npx vitest run` → 143/143 passed (10 files, incl. 25 new sync tests).
- `npx tsc --noEmit` → clean (incremental).
- `npx eslint` on all new/modified files → 0 errors, 0 warnings.
- YAML validity: `validate.yml` + `release.yml` parsed successfully with
  `js-yaml` (workflow syntax valid).
- `release.config.mjs` structurally validated: branches `["main"]`, plugins
  include changelog + git, npm `npmPublish: false`.
- Real-API run: `npx tsx scripts/sync-github.ts --limit 1` twice → first synced
  coollabsio/coolify (60796★, release v4.3.9), second run skipped it (fresh) and
  synced dokku/dokku (32107★, release v0.38.27). Diff on `data/products.json`
  was **10 insertions / 1 deletion** (one `github` block) — then reverted; no
  data changes are part of this phase's commit.
- `pnpm-lock.yaml` importer matches package.json; `pnpm install --frozen-lockfile`
  will resolve from the already-locked transitive versions.

**Next phase:** `phase/14-docs-release` — README (what/features/stack/dev/
contribute/deploy-on-Vercel/roadmap), `docs/` handoffs, final code-review +
simplification pass, version tag. Note: user runs `pnpm install` once before
that to refresh the lockfile for the 4 explicit plugin devDeps.

**Open issues / follow-ups:**
- **`data/products.json` stays `github: null` until the user runs
  `pnpm sync:github` with a `GITHUB_TOKEN`** — no fabricated metadata (project
  rule); the script is ready and verified, the data population is a later,
  user-initiated step.
- **Full `next build` still deferred** to the user (low-end machine rule);
  CI's validate.yml does not run `next build` by design (build is covered by
  lint/typecheck/tests + the P14 final pass).
- **`pnpm install` needs one user run** to sync `pnpm-lock.yaml` importers with
  the new explicit plugin devDeps (fast: all versions already in the lockfile).