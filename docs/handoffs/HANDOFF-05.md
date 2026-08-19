# HANDOFF — phase/05

**Goal:** Populate product data batch C — Design (#85-90), Productivity/Docs (#91-97),
Scheduling/PM (#98-105), Internal Tools (#106-112), Search/AI (#113-120), Passwords/Security
(#121-125), Billing/CRM (#126-131) — from the canonical source list.

**Branch:** `phase/05-data-products-c`

**Status:** complete

**Files touched:**
- `data/products.json` — 63 products added (35 paid SaaS + 28 alternatives) → **181 total**
- `data/products.json` — Authentik `replaces` updated: added `"Cloudflare Access"` (source row #125)

**Batch breakdown (63 new):**
- **Design (13):** Figma, Miro, Canva Pro, Photoshop, Illustrator + alternatives **Penpot, Excalidraw,
  AFFiNE, GIMP, Inkscape**
- **Productivity/Docs (13):** Notion, Confluence, Google Docs, Dropbox Paper, Evernote, Google Keep +
  alternatives **AppFlowy, Outline, OnlyOffice, Joplin**
- **Scheduling/PM (12):** Calendly, Linear, Jira, Trello, Asana, Monday.com, ClickUp + alternatives
  **Cal.com, Plane, OpenProject, Wekan**
- **Internal Tools (8):** Retool, Typeform, Google Forms + alternatives **Appsmith, ToolJet,
  Formbricks, LimeSurvey**
- **Search/AI (10):** Algolia, Pinecone, OpenAI API, Replicate + alternatives **Meilisearch,
  Typesense, Qdrant, Weaviate, Ollama, vLLM, sentence-transformers**
- **Security (5):** 1Password, LastPass, Bitwarden Premium, Cloudflare Access + alternative
  **Vaultwarden**
- **Billing/CRM (9):** Stripe Billing, Chargebee, HubSpot CRM, Salesforce, Pipedrive, Zoho CRM +
  alternatives **Lago, SuiteCRM, EspoCRM**

**Decisions:**
- **Outline flagged `openSource: false`.** Outline's GitHub license is BSL-1.1 (source-available, not
  OSI-approved). Follows the n8n precedent from HANDOFF-04: `license: "BSL-1.1"`, `selfHosted: true`,
  `pricing: "freemium"`. Its OpenSourceBadge will not render — intentional accuracy.
- **OpenAI rows merged into one product.** Source rows #117/#118/#120 (OpenAI API, local inference,
  embeddings) are one real-world entity → `openai-api`. The alternatives cover all three: Ollama
  replaces OpenAI API (local inference), vLLM replaces OpenAI API + Replicate (serving), and
  sentence-transformers replaces OpenAI API (embeddings).
- **Authentik's `replaces` extended.** Row #125 (Cloudflare Access → Authentik) adds a new relationship
  to an existing P3 product. Only `replaces` was touched; no re-encoding of the product.
- **Category mapping:** search/vector engines (Algolia, Pinecone, Meilisearch, Typesense, Qdrant,
  Weaviate) → `databases` (no dedicated search category exists); LLM APIs → `llm`; model serving
  (Replicate, vLLM, sentence-transformers) → `ml-platform`; scheduling (Calendly, Cal.com) →
  `productivity` (no scheduling category); forms (Typeform, Google Forms, Formbricks, LimeSurvey) →
  `internal`; password managers → `password-management`; billing → `billing`; CRMs → `crm`;
  Cloudflare Access → `identity` (zero-trust, matches Authentik).
- **No fabricated GitHub metadata:** `github: null` everywhere; `license` set from well-known data
  (MIT/AGPL-3.0/GPL-3.0/GPL-2.0/MPL-2.0/Apache-2.0/BSD-3-Clause); proprietary paid SaaS → `null`.
- **All `replaces` targets resolve** — 28 unique alternatives reference 35 paid rows + 1 cross-batch
  update (Authentik); verified by the validator's cross-reference pass (e.g.
  `Vaultwarden → ["1Password", "LastPass", "Bitwarden Premium"]`).

**Verification:**
- `pnpm validate-data` → `✓ validate-data: 58 categories, 15 features, 181 products — all valid`
  (exit 0)
- `npx tsc --noEmit` → clean
- `pnpm test` → 13/13 passed
- No TS files changed → no eslint run needed (lint-staged covers staged files only)

**Next phase:** `phase/06-core-components` — Core UI components (SearchBar, ProductCard,
AlternativeCard, ProductLogo, PricingBadge, OpenSourceBadge, SelfHostedBadge, GitHubStats,
CategoryCard, FilterPanel, ComparisonTable, Breadcrumbs, EmptyState, Pagination) under
`components/ui/`. Skills: Core + `frontend-craft`, `design-taste-frontend`, `minimalist-ui`,
`react`, `tailwind-css`. Exit criteria: build pass; components render with real data; no AI-slop.

**Open issues / follow-ups:**
- Data phase complete: 181 products across all source-list rows. Any future data corrections land in
  P6+ branches or a small follow-up branch.
- vitest CJS-ESM config warning (P2 follow-up) still open; P12 will revisit test config.