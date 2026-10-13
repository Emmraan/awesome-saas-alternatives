import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  FileJson,
  GitFork,
  GitPullRequest,
  MessageCircle,
  Terminal,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import {
  GITHUB_DATA_FILE_URL,
  GITHUB_REPO_URL,
  pageMetadata,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contribute a tool",
  description:
    "Add a product or fix an entry in the directory — the whole catalog is open source and lives in a single JSON file on GitHub.",
  path: "/contribute",
});

const STEPS = [
  {
    title: "Fork the repository",
    body: "Fork awesome-saas-alternatives on GitHub so you have a copy to edit.",
  },
  {
    title: "Edit data/products.json",
    body: "The whole catalog is one JSON file — add your entry to the products array.",
  },
  {
    title: "Run the validator",
    body: "pnpm validate-data checks the schema and every cross-reference. Fix anything it flags.",
  },
  {
    title: "Open a pull request",
    body: "Push your branch and open a PR against main — validation runs on CI before anything merges.",
  },
];

const FIELD_GROUPS = [
  {
    heading: "Identity",
    fields: [
      { name: "slug", note: "Unique kebab-case identifier used in the URL: /alternatives/{slug}." },
      { name: "name", note: "The product's official name." },
      { name: "tagline", note: "One line shown under the name — what it is, in ten words or fewer." },
      { name: "description", note: "Two to four sentences: what it does, who it is for, what makes it worth listing." },
      { name: "website", note: "Official product URL — where a reader verifies the tool really exists." },
    ],
  },
  {
    heading: "Licensing & hosting",
    fields: [
      { name: "repo", note: "GitHub repository in owner/name format, or null when there is no public source." },
      { name: "license", note: "SPDX license identifier (MIT, Apache-2.0, GPL-3.0…) or null." },
      { name: "openSource", note: "true or false — is the source publicly available?" },
      { name: "selfHosted", note: "true or false — can it run on your own hardware or VPS?" },
      { name: "pricing", note: "One of free, freemium or paid." },
      { name: "difficulty", note: "One of easy, medium or hard — the setup effort a new user should expect." },
    ],
  },
  {
    heading: "Taxonomy",
    fields: [
      { name: "categories", note: "At least one existing category slug — new categories need their own PR." },
      { name: "replaces", note: "Names of the paid SaaS this tool replaces, exactly as spelled in the catalog." },
      { name: "features", note: "Feature slugs from data/features.json — powers the comparison table." },
      { name: "tags", note: "Free-form lowercase keywords used by search, like hosting or self-hosted." },
    ],
  },
  {
    heading: "Metadata",
    fields: [
      { name: "github", note: "Stars, forks, license and latest release — leave null; the sync script fills it from the GitHub API." },
      { name: "createdAt / updatedAt", note: "ISO timestamps, auto-managed." },
      { name: "status", note: "active, archived or draft." },
    ],
  },
];

const GUIDELINES = [
  "Only list tools you can verify — link the official website and repository.",
  "No fabricated numbers: leave github stats null unless you fetched them from the GitHub API.",
  "Reuse existing category and feature slugs instead of inventing new ones.",
  "Run pnpm validate-data before pushing — it catches schema and cross-reference errors.",
  "One product per pull request keeps reviews fast.",
];

const STEP_CODES = [
  `git clone https://github.com/Emmraan/awesome-saas-alternatives.git
cd awesome-saas-alternatives
git checkout -b feat/add-coolify
pnpm install`,
  `{
  "slug": "coolify",
  "name": "Coolify",
  "tagline": "Open-source, self-hostable PaaS",
  "website": "https://coolify.io",
  "repo": "coollabsio/coolify",
  "license": "Apache-2.0",
  "openSource": true,
  "selfHosted": true,
  "pricing": "free",
  "difficulty": "medium",
  "categories": ["cloud-hosting"],
  "replaces": ["Vercel", "Netlify"],
  "features": ["self-hosted", "docker"],
  "tags": ["paas"],
  "github": null
}`,
  `pnpm validate-data
# ✓ 58 categories, 15 features, 181 products — all valid`,
  `git add data/products.json
git commit -m "feat(data): add Coolify"
git push -u origin feat/add-coolify
# open PR on GitHub → feat(data): add Coolify`,
];

export default function ContributePage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-14 lg:px-8">
      <Breadcrumbs items={[{ label: "contribute" }]} />

      <header className="mt-5 max-w-2xl">
        <Reveal>
          <p className="font-mono text-[11.5px] font-medium uppercase tracking-[0.22em] text-mint">
            GitHub is the CMS
          </p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
            Contribute to the directory
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-fog">
            Every tool in the catalog lives in a single JSON file on GitHub. Add
            a product, fix an entry, or improve the site — no account needed
            beyond GitHub.
          </p>
        </Reveal>
      </header>

      <section className="mt-12">
        <Reveal>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            How it works
          </h2>
        </Reveal>
        <ol className="mt-5 flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <Reveal key={step.title} as="li" delay={index * 60} className="flex flex-col gap-4 rounded-lg border border-line bg-pine p-5 shadow-card">
              <div className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-mint font-mono text-xs font-bold text-void">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-fog">
                    {step.body}
                  </p>
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-line bg-[#0a120d]">
                <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-[10.5px] uppercase tracking-widest text-white/40">
                  <span>{["fork & clone", "add entry", "run gate", "open PR"][index]}</span>
                  <span className="text-white/20">```</span>
                </div>
                <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[11.5px] leading-relaxed text-white/70">
                  <code>{STEP_CODES[index]}</code>
                </pre>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <Reveal>
        <section className="mt-12">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            The data format
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-fog">
            Each entry in data/products.json follows the same shape. The
            validator enforces every field below, so a valid entry is a complete
            one.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {FIELD_GROUPS.map((group, index) => (
              <Reveal key={group.heading} delay={index * 60} className="rounded-lg border border-line bg-pine p-5 shadow-card">
                <h3 className="font-display text-[15px] font-semibold text-ink">
                  {group.heading}
                </h3>
                <dl className="mt-4 flex flex-col gap-3">
                  {group.fields.map((field) => (
                    <div key={field.name}>
                      <dt className="font-mono text-xs text-mint">
                        {field.name}
                      </dt>
                      <dd className="mt-0.5 text-[13px] leading-6 text-fog">
                        {field.note}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal delay={80}>
        <section className="mt-12 max-w-2xl">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            House rules
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {GUIDELINES.map((guideline) => (
              <li key={guideline} className="flex gap-2.5 text-sm leading-6 text-fog">
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-mint"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span>{guideline}</span>
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      <Reveal delay={120}>
        <section className="mt-12">
          <div className="rounded-lg border border-line bg-pine p-8 shadow-card sm:p-10">
            <h2 className="font-display text-xl font-bold tracking-tight text-ink">
              Not a developer?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-fog">
              Open an issue instead. Name the tool, link its website, and say
              what SaaS it replaces — a maintainer can turn it into an entry.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={GITHUB_DATA_FILE_URL}
                className="inline-flex h-10 items-center gap-2 rounded-md bg-mint px-5 font-mono text-[12px] font-semibold uppercase tracking-wider text-void transition-colors hover:bg-ink"
              >
                <FileJson className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Edit products.json
              </Link>
              <Link
                href={`${GITHUB_REPO_URL}/issues/new`}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-line px-5 font-mono text-[12px] font-semibold uppercase tracking-wider text-fog transition-colors hover:border-edge hover:text-ink"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Open an issue
              </Link>
              <Link
                href={GITHUB_REPO_URL}
                className="inline-flex h-10 items-center gap-2 rounded-md px-4 font-mono text-[12px] uppercase tracking-wider text-dim transition-colors hover:text-mint"
              >
                <GitFork className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                Browse the repository
                <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={160}>
        <section className="mt-6">
          <div className="flex gap-4 rounded-lg border border-line bg-void/60 p-5">
            <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-dim" strokeWidth={1.75} aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">
                Validate your entry
              </p>
              <p className="mt-1 font-mono text-xs text-dim">
                <span className="text-mint">$</span> pnpm install {"&&"} pnpm validate-data
              </p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={200}>
        <section className="mt-6">
          <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-edge px-6 py-14 text-center">
            <GitPullRequest className="h-5 w-5 text-dim" strokeWidth={1.75} aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-ink">
                Ready to open a pull request?
              </h2>
              <p className="mx-auto mt-1 max-w-[52ch] text-sm leading-6 text-fog">
                Point your PR at main. Validation runs automatically — a green
                check means your entry is ready to review.
              </p>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}