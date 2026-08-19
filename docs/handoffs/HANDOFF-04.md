# HANDOFF — phase/04

**Goal:** Populate product data batch B — Automation (#55-60), Communication/Support (#61-68),
Email (#69-76), Git/CI/CD (#77-84) — from the canonical source list.

**Branch:** `phase/04-data-products-b`

**Status:** complete

**Files touched:**
- `data/products.json` — 40 products added (29 paid SaaS + 11 alternatives) → **118 total**
- `tests/data.test.ts` — `getProductsByAlternative("zapier")` now expects `n8n` (was `[]`);
  added `getProductsByAlternative("zendesk")` → `["freescout", "zammad"]`

**Batch breakdown (40 new):**
- **Automation (7):** Zapier, Make, Pipedream, IFTTT, Workato, Tray.io + alternative **n8n**
- **Communication/Support (10):** Intercom, Zendesk, Crisp, Help Scout, Drift, Front, LiveChat +
  alternatives **Chatwoot, Zammad, FreeScout**
- **Email (11):** Mailchimp, ConvertKit, Brevo, SendGrid, Mailgun, Postmark, Amazon SES,
  Microsoft 365 email + alternatives **Listmonk, Postal, Mailcow**
- **Git/CI (12):** GitHub Enterprise, GitLab Premium, Bitbucket, GitHub Actions, CircleCI, Travis CI,
  Docker Hub, GitHub Container Registry + alternatives **Forgejo, Gitea, Woodpecker CI, Harbor**

**Decisions:**
- **n8n flagged `openSource: false`.** n8n is source-available under the Sustainable Use License
  (fair-code), not OSI open-source. `license: "Sustainable Use License"`, `selfHosted: true`,
  `pricing: "free"`. Its OpenSourceBadge will not render; this is intentional accuracy, not an error.
- **One product per real-world entity:** Zendesk appears twice in the source (rows #62-63) but is
  encoded once; Zammad and FreeScout both list `replaces: ["Zendesk"]`. Same for Amazon SES (rows
  #75 vs #124 in security — #124 is Keycloak/Auth0, already handled in P3, not re-encoded).
- **Category mapping:** live-chat/helpdesk products → `customer-support`; email marketing →
  `email-marketing`; delivery APIs → `transactional-email`; mailbox hosting (Microsoft 365 email,
  Mailcow) → parent `email` (no dedicated mailbox subcategory exists); Git hosts → `git-hosting`;
  CI → `ci-cd`; registries (Docker Hub, GHCR, Harbor) → `containers`.
- **No fabricated GitHub metadata:** `github: null` everywhere; `license` set from well-known data
  (MIT/AGPL-3.0/Apache-2.0/GPL-3.0); proprietary paid SaaS → `null`.
- **All `replaces` targets resolve** — 11 unique alternatives reference 29 paid rows; verified by the
  validator's cross-reference pass (e.g. `Mailcow → ["Amazon SES", "Microsoft 365 email"]`).

**Verification:**
- `pnpm validate-data` → `✓ 58 categories, 15 features, 118 products — all valid` (exit 0)
- `pnpm typecheck` → clean
- `pnpm test` → 13/13 passed
- `npx eslint tests/data.test.ts` → clean

**Next phase:** `phase/05-data-products-c` — batch C (Design #85-90, Productivity #91-97,
Scheduling/PM #98-105, Internal Tools #106-112, Search/AI #113-120, Passwords/Security #121-125,
Billing/CRM #126-131). Expect ~28 paid + ~17 unique alternatives (Penpot, Excalidraw, AFFiNE, GIMP,
Inkscape, AppFlowy, Outline, OnlyOffice, Joplin, Cal.com, Plane, OpenProject, Wekan, Appsmith,
ToolJet, Formbricks, LimeSurvey, Meilisearch, Typesense, Qdrant, Weaviate, Ollama, vLLM,
sentence-transformers, Vaultwarden, Lago, SuiteCRM, EspoCRM). Shared refs (Airtable, Keycloak,
Baserow, NocoDB, Supabase, Grafana) already exist — do NOT re-encode.

**Open issues / follow-ups:**
- vitest CJS-ESM config warning (P2 follow-up) still open; P12 will revisit test config.
- `getProductsByAlternative` test now asserts the zendesk→(zammad, freescout) mapping — keep in sync
  if future batches add more Zendesk alternatives.