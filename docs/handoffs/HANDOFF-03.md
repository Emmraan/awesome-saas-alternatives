# HANDOFF — phase/03

**Goal:** Populate product data batch A — Infrastructure, Databases/Backend, Auth, Storage,
Analytics, Monitoring — from the canonical source list.

**Branch:** `phase/03-data-products-a`

**Status:** complete

**Files touched:**
- `data/products.json` — 78 products (51 paid SaaS + 27 alternatives), full `productSchema` fields
- `lib/schemas.ts` — relaxed `replaces` from `.min(1)` to optional-empty (paid SaaS entries carry `[]`)
- `scripts/validate-data.ts` — added post-pass check: every `replaces` entry must resolve to an
  existing product `name` (case-insensitive)
- `tests/data.test.ts` — product-loader tests updated from "empty placeholder" to populated-data
  assertions (unique slugs, category lookup incl. descendants, `getProductsByAlternative("vercel")`
  → Coolify, case-insensitive search)
- `PLAN.md` — P3 status marked `[x]`
- `docs/reference/product-source-list.md` (committed with this phase) — canonical table from P0 prep

**Decisions:**
- **`replaces` semantics (user-confirmed):** alternatives list the SaaS they replace
  (`replaces: ["Vercel", ...]`); paid SaaS products get `replaces: []`. Schema relaxed
  `min(1) → min(0)` to allow this. Keeps `getProductsByAlternative("vercel")` returning only true
  alternatives (never the paid SaaS itself).
- **One product per real-world entity.** Shared/duplicate references in the source table collapse to
  one entry (e.g. `airtable` appears in DB #19-20 and internal-tools #111-112 but is encoded once;
  `cloudflare-pages` is both a paid row and its own free alternative — encoded once, `freemium`).
- **Batch A scope:** 51 paid + 27 unique alternatives (Coolify, Dokku, Dokploy, Supabase, PostgreSQL,
  MongoDB Community, Valkey, Redis, Baserow, NocoDB, Keycloak, Authentik, Supabase Auth, MinIO,
  ImageMagick, Nextcloud, Matomo, PostHog, Microsoft Clarity, OpenReplay, RudderStack, Grafana,
  Prometheus, Loki, GlitchTip, Uptime Kuma, Grafana OnCall).
- **No fabricated GitHub metadata:** `github: null` everywhere (P13 sync fills it). `license` is set
  from well-known project data (Apache-2.0, MIT, AGPL-3.0, etc.); unknown/proprietary → `null`.
- **All `replaces` targets resolve within batch A** — verified by the new validator check, so no
  cross-batch dangling references were introduced.

**Verification:**
- `pnpm validate-data` → `✓ 58 categories, 15 features, 78 products — all valid` (exit 0)
- `pnpm typecheck` → clean
- `pnpm test` → 13/13 passed
- `npx eslint lib/schemas.ts scripts/validate-data.ts tests/data.test.ts` → clean

**Next phase:** `phase/04-data-products-b` — batch B (Automation #55-60, Communication #61-68,
Email #69-76, Git/CI #77-84). Expect ~30 paid + ~12 unique alternatives (n8n, Chatwoot, Zammad,
FreeScout, Listmonk, Postal, Mailcow, Forgejo, Gitea, Woodpecker CI, Harbor). All `replaces` targets
must resolve — now enforced by the validator across the whole products file.

**Open issues / follow-ups:**
- P4 must add its paid-SaaS products before their alternatives reference them, or the
  `replaces`-resolution check fails — encode paid rows and alternatives in the same commit.
- vitest CJS-ESM config warning (P2 follow-up) still open; P12 will revisit test config.