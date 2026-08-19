# HANDOFF — phase/02

**Goal:** Data layer — types, loaders, validation, category/feature data.

**Branch:** `phase/02-data-layer`

**Status:** complete

**Files touched:**
- `lib/schemas.ts` (new) — zod v4 schemas as the single source of truth:
  `categorySchema`, `featureSchema`, `productSchema`, `pricingModelSchema`,
  `difficultySchema`, `productStatusSchema`, `githubMetadataSchema` (+ derived TS types)
- `lib/types.ts` (new) — re-exports schema-derived types (Product, Category, Feature,
  PricingModel, Difficulty, ProductStatus, GitHubMetadata, GitHubRelease)
- `lib/data.ts` (new) — loaders: `getCategories`, `getCategory`, `getTopLevelCategories`,
  `getChildCategories`, `getCategorySlugs`, `getFeatures`, `getFeature`, `getFeatureGroups`,
  `getProducts`, `getProduct`, `getProductSlugs`, `getProductsByCategory` (incl. descendants),
  `getProductsByAlternative`, `searchProducts`
- `data/categories.json` (new) — 58 categories, full hierarchy via `parent` (17 roots:
  infrastructure, backend, auth, storage, analytics, monitoring, automation, communication,
  email, git-ci, design, productivity, pm, internal, ai, security, billing-crm)
- `data/features.json` (new) — 15 features grouped (deployment/license/integration/security/
  ux/platform/data/pricing)
- `data/products.json` (new) — empty `[]` placeholder; batches land in P3-P5
- `scripts/validate-data.ts` (new) — zod parse of all three JSON files + cross-ref checks:
  unique slugs, parent refs resolve, product→category/feature refs resolve; exit code 1 on error
- `tests/data.test.ts` (new) — 11 loader tests
- `package.json` — added `validate-data` script (`tsx scripts/validate-data.ts`) + `tsx` devDep
- `pnpm-workspace.yaml` — approved `esbuild` build script (pnpm 11 blocks it by default,
  breaking the install)

**Decisions:**
- **Schema-first.** Zod schemas are the single source of truth; `lib/types.ts` only re-exports
  inferred types — zero drift between runtime validation and compile-time types.
- **Slugs/labels** use lowercase kebab-case (`slugSchema`); GitHub repo uses `owner/name`.
- **GitHub metadata lives on the product** (`github: { stars, forks, license, release, fetchedAt }`
  all nullable, or `null`) and stays `null` until P13 sync — no fabricated stars.
- **Validation is data-driven**, not duplicated in loaders: `validate-data` parses the JSON
  through the same schemas the loaders use, so a bad edit fails fast in CI, not at build.
- **tsx** chosen to run the TS validation script (no `ts-node`, no compile step).
- **esbuild approved** in `pnpm-workspace.yaml` because pnpm 11 hard-fails the install
  otherwise (`ERR_PNPM_IGNORED_BUILDS`).

**Verification:**
- `pnpm validate-data` → `✓ 58 categories, 15 features, 0 products — all valid` (exit 0)
- `pnpm typecheck` (`tsc --noEmit`) → clean
- `pnpm test` → 1 file, 11 tests passed
- `npx eslint <new files>` → clean
- User ran `pnpm install` (tsx 4.23.12 added; husky hook ran).

**Next phase:** `phase/03-data-products-a` — batch A of ~170 products (Infrastructure/Backend/
Auth/Storage/Analytics/Monitoring) following `productSchema`; every `category`/`feature` ref
must resolve; validate-data zero errors.

**Open issues / follow-ups:**
- `data/products.json` intentionally empty; P3-P5 populate it.
- vitest warns the Vite config loads as CommonJS (`vitest.config.ts` ESM-in-CJS); cosmetic,
  revisit when P12 touches test config.
- `esbuild` was approved globally for the repo — a deliberate, documented allowlist entry.