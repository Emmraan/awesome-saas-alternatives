# HANDOFF — phase/01

**Goal:** Next.js scaffold + design system base (deps, configs, layout, design tokens, dark mode).

**Branch:** `phase/01-scaffold`

**Status:** complete

**Files touched:**
- `package.json` (new) — deps: next 16.3.1, react 19.2.8, next-themes 0.4.6, lucide-react 1.32.0; dev: tailwindcss 4.3.3, @tailwindcss/postcss 4.3.3, typescript 5.9.3, eslint 9.39.5, eslint-config-next 16.3.1, vitest 4.1.11, zod 4.4.3, lint-staged 16.4.0, husky 9.1.7, semantic-release 25.0.9 + changelog 7.0.0 + git 11.0.1
- `next.config.ts` (new) — `reactStrictMode: true`
- `tsconfig.json` (new; Next auto-amended during build: `jsx: react-jsx`, `.next/dev/types` in include)
- `postcss.config.mjs` (new) — `@tailwindcss/postcss` (Tailwind v4)
- `eslint.config.mjs` (new) — flat config, `eslint-config-next/core-web-vitals` + `/typescript`
- `vitest.config.ts` (new) — node env, `tests/**/*.test.ts` (suite comes in P12)
- `app/layout.tsx` (new) — Inter via next/font, next-themes (class, system), base metadata
- `app/globals.css` (new) — Tailwind v4 `@theme inline` tokens: monochrome + green (primary) + blue (accent), class-based dark mode via `@custom-variant dark`
- `app/page.tsx` (new) — minimal placeholder so build works; replaced in P7
- `.husky/pre-commit` (new) — `npx lint-staged`
- `next-env.d.ts`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` (auto-generated, committed)

**Decisions:**
- **ESLint pinned to v9 (9.39.5), not v10.** `eslint-plugin-react@7.37.5` (pulled by `eslint-config-next`) crashes on ESLint 10 (`context.getFilename is not a function` — jsx-eslint/eslint-plugin-react#3977, vercel/next.js#89764; fix PR #3979 not yet published). Next.js maintainers recommend pinning v9 until upstream compat lands. Re-evaluate bumping to v10 in a later phase.
- **TypeScript pinned to 5.9.3**, not 7.x (native compiler is new latest); 5.9.3 is the mature, fully Next-16-compatible line.
- **lint-staged pinned to 16.4.0**, not 17.x — 17 requires Node >=22.22.1; this machine runs 22.15.1 (16.x needs >=20.17).
- **Tailwind v4** (CSS-first, no tailwind.config) with `@theme inline` mapping semantic CSS vars; design tokens live in `globals.css`.
- Dark mode via `next-themes` + `.dark` class; `@custom-variant dark` wires Tailwind `dark:` variants.

**Verification (run by user, low-end machine rule):**
- `pnpm install` — OK
- `pnpm lint` — clean (after eslint 10 → 9 fix)
- `pnpm typecheck` — clean (`tsc --noEmit`)
- `pnpm build` — `next build` 16.3.1 (Turbopack) compiled successfully, all routes prerendered (`/`, `/_not-found`)

**Next phase:** `phase/02-data-layer` — `lib/types.ts`, `lib/data.ts`, `data/categories.json`, `data/features.json`, `scripts/validate-data.ts`, `data/products.json` placeholder.

**Open issues / follow-ups:**
- Bump eslint → 10 once `eslint-config-next` + `eslint-plugin-react` ship full v10 compat.
- TypeScript 7.x re-evaluation after ecosystem catches up.
- `app/page.tsx` is a placeholder; real homepage is P7.