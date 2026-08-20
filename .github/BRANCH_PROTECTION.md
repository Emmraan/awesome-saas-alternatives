# Branch protection — `main`

`main` is protected. Do not push directly — open a PR that passes `validate`.

## Required settings (GitHub UI)

`Settings → Branches → Add classic branch protection rule → Branch name pattern: main`

- [x] **Require a pull request before merging**
  - Required approvals: `1`
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (if `CODEOWNERS` exists later)
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Search and add: `validate (lint + typecheck + test + validate-data)` — exact job name from `.github/workflows/validate.yml:49`
  - Do **not** require `codeql` or `links` as blocking — they run weekly/PR and may flake on external 429. Keep them as informational.
  - Do **not** require `release` — it runs only on `main` post-merge.
- [x] **Require conversation resolution before merging**
- [x] **Do not allow bypassing the above settings** (admins included)
- [x] **Restrict deletions** and [x] **Restrict force pushes**

### Via `gh` CLI (one-shot)

```sh
gh api repos/Emmraan/awesome-saas-alternatives/branches/main/protection \
  -X PUT \
  -f required_status_checks[strict]=true \
  -f required_status_checks[contexts][]="validate (lint + typecheck + test + validate-data)" \
  -f enforce_admins=true \
  -f required_pull_request_reviews[dismiss_stale_reviews]=true \
  -f required_pull_request_reviews[required_approving_review_count]=1 \
  -f restrictions=null \
  -f allow_force_pushes=false \
  -f allow_deletions=false
```

## Why this shape

- `validate` is the quality gate (lint/typecheck/coverage/data + audit warning). `release` must not gate PRs — it only tags on `main`.
- `codeql` + `links` stay non-blocking so a private Cloudinary or GitHub API blip does not block a data PR.
- One-approval keeps OSS velocity; dismiss-stale prevents land-after-push.

## Extra bots already added (and why others are skipped)

**Added in this PR:**
- `dependabot.yml` — weekly grouped `npm` + `github-actions` (minor/patch grouped, 5 PR limit)
- `codeql.yml` — weekly JS/TS scan
- `validate` audit step — `pnpm audit --audit-level high` (`continue-on-error: true`, warning only)
- `links.yml` — weekly `lychee` on `README`/`data` (Cloudinary excluded, `fail: false` → log only)
- `labeler` — auto `data`/`ui`/`ci`/`deps`/`docs` by paths

**Skipped intentionally:**
- **Renovate** — heavier config, `dependabot` grouped is calmer for `next`/`zod` churn
- **Lighthouse CI** — Vercel Analytics + `next/image`+`sharp` already cover LCP; add only if LCP regresses
- **Size-limit** — no bundle budget yet; add when homepage JS >150kB
- **Stale bot** — enable after first 10 external issues, not now
- **Auto-merge** — risky with `semantic-release` majors; keep manual merge

To add any skipped bot later, copy its workflow from this file's history — all patterns stay `contents: read` + pinned `@v` tags.
