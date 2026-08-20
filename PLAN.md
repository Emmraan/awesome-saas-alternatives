# PLAN — UI upgrade (generic → open-source-grade)

> Decisions: emerald kept (#10b981), GitHub stars build-time sum, new SA monogram + favicon family, one-package shadcn install. Plan saved 2026-08-20 — slices A→C incremental, each shippable.

## Goal

Make the site feel like a real open-source directory (navbar/hero/footer signals) without AI-slop. Inspiration blend: dub.co (marketing polish, logo wall, feature screenshots), supabase.com (OSS credibility, dark+emerald, code motif), tasteskill.dev (anti-slop editorial, bento, motion restraint). Use frontend skills so output is human-crafted.

## Non-negotiables

- Research → skill → plan → code (using-agent-skills). Skills: `design-taste-frontend` v2, `minimalist-ui`, `frontend-craft`, `frontend-core`, `tailwind-css` v4, `react`/`nextjs`, `seo`, `frontend-performance`.
- `pnpm` only — agent writes `package.json`, you run `pnpm install`. One package install for shadcn/radix/motion/sharp.
- Fast dev: `lint-staged`/`tsc incremental`/`vitest --changed` during; full `lint`/`typecheck`/`test:coverage`/`validate-data` + `pnpm build` (needs `NEXT_PUBLIC_SITE_URL`) per slice.
- Favicon geometry 1:1 with navbar `h-6 w-6` SA monogram.

## What changes vs what is preserved

- **Preserve:** `lib/*` search/directory/seo logic, data shape, routes `/alternatives/[slug]`, `/categories/[slug]`, `/search`, tests.
- **Upgrade:** `app/globals.css` tokens; `components/SiteHeader`/`SiteFooter` + favicons; `components/home/*` hero + bento; `components/ui/*` cards/filter/search polish + `opengraph-image.tsx`.

## Slice A — tokens + shell + favicon

- **Branch suggestion:** `phase/16-design-system-shell`
- **Skills:** `design-taste-frontend`, `minimalist-ui`, `tailwind-css`, `frontend-craft`, `react`
- **Tasks:**
  1. Audit screenshots 375/768/1280 (header/hero/footer).
  2. Expand `app/globals.css:5` tokens: 7 surfaces, `radius 0.75rem`, `--shadow-card`, `--grid-color`, `@theme inline` add `--color-grid`, keep `@custom-variant dark`, emerald primary retained.
  3. Generate favicon family `public/favicon.ico` (16/32), `public/favicon.svg`, `public/apple-touch-icon.png` (180), `public/site.webmanifest` — SA monogram emerald on zinc-900, matches navbar `h-6 w-6 rounded-md`.
  4. Rebuild `SiteHeader.tsx`: shadcn `NavigationMenu`/`Button`/`Separator`, centered `SearchBar` with `⌘K` hint, right `GitHubStar` pill (build-time sum from `data/products.json`, no token) + `Add a tool` primary + `ThemeToggle`.
  5. Rebuild `SiteFooter.tsx`: 4-col IA (Directory / Contribute / Community / Legal) + MIT + GitHub/Social icons + status.
  6. Add `components/ui/GitHubStar.tsx` (build-time).
- **Acceptance:** header shows star pill + search + SA logo; favicons render 16/32/180 and match navbar; footer 4-col; light/dark parity ≥4.5:1; `lint/typecheck` green; no layout shift.

## Slice B — hero & homepage bento

- **Branch suggestion:** `phase/17-homepage-redesign`
- **Skills:** `design-taste-frontend` v2, `frontend-craft`, `frontend-performance`, `seo`
- **Tasks:**
  1. `components/home/Hero.tsx` dark variant + grid texture + green glow, live pill (`181 tools • 58 categories`), dual CTAs (`Browse alternatives` primary + `View on GitHub` secondary with star count).
  2. New `components/home/LogoWall.tsx` (8 popular products, `grayscale opacity-60` masked fade) + `components/home/ProofStrip.tsx` (masonry 7 `ProductLogo`+tagline tiles, `motion` with `prefers-reduced-motion`).
  3. Restyle `SwappableSaaS`/`TopAlternatives`/`CategoryGrid` to `grid-cols-12` bento (featured `col-span-6`, rest `col-span-3`), screenshot/icon slots with `next/image` + `sizes`.
  4. `BadgeExplainer`/`ContributeCta` → terminal-dot card.
- **Acceptance:** editorial hero + bento, not templated; LCP <2.5s, `next/font` Geist kept, `pageMetadata` unchanged, `vitest --changed` green.

## Slice C — cards & directory polish

- **Branch suggestion:** `phase/18-cards-directory`
- **Skills:** `frontend-core`, `tailwind-css`, `react`, `code-reviewer`
- **Tasks:**
  1. `ProductCard`/`CategoryCard` → shadcn `Card` + dot header + emerald icon circle hierarchy.
  2. `FilterPanel` → `Badge`+`Checkbox`, `SearchBar` token unification, `EmptyState` terminal dots.
  3. Align `app/opengraph-image.tsx` with new wordmark.
- **Acceptance:** hierarchy name>tagline>badges>meta, keyboard `aria-current` intact, directory URL-driven filters/pagination green, `lib/` coverage ≥80%.

## Favicon spec

- Wordmark: 24×24 SA monogram emerald (#10b981) on zinc-900, `SaaS Alternatives` word. `public/favicon.ico` (16/32, ~15KB), `public/favicon.svg` vector, `public/apple-touch-icon.png` 180×180 opaque, `public/site.webmanifest` `theme_color #0c0c0d`. Navbar `h-6 w-6 rounded-md` renders SVG at 1:1.

## Packages (one install)

`shadcn` (`class-variance-authority`, `clsx`+`tailwind-merge` existing), `@radix-ui/react-navigation-menu`/`dialog`/`checkbox`, `motion`, `sharp`. Agent writes `package.json`, you run `pnpm install`.

## Verification per slice

- [ ] `pnpm lint` 0/0, `pnpm typecheck` clean, `pnpm test --changed` green, `pnpm validate-data` 58/15/181 ✓
- [ ] `pnpm build` with `NEXT_PUBLIC_SITE_URL` — no prerender regression
- [ ] Screenshots 375/768/1280 + dark toggle parity
- [ ] Favicon 16/32/180 matches navbar
- [ ] Lighthouse LCP <2.5s, no CLS

## Timeline

Slice A → B → C, each `git checkout -b phase/16|17|18-*` from latest `main`, `git merge --squash` one Conventional Commit, `docs/handoffs` optional (already archived). After C, final verification + push.

## Risks

- LCP regression → cap hero images to 3, `priority` only hero, `loading=lazy` rest, `sharp`.
- Dark hero contrast → keep `bg-background` with overlay, axe check.
- Star live fetch → build-time sum from `data/products.json`, zero-token.

---

*Living doc — update after each slice. Approve tweaks before build; pre-flight (no gradient-purple AI tell, dark parity, aria on icons) must pass honest before ship.*
