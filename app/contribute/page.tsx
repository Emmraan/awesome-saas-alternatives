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

export default function ContributePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Contribute" }]}
      />

      <header className="mt-4 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Contribute to the directory
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Every tool in the catalog lives in a single JSON file on GitHub. Add
          a product, fix an entry, or improve the site — no account needed
          beyond GitHub.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          How it works
        </h2>
        <ol className="mt-5 flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-lg border border-border bg-card p-5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          The data format
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Each entry in data/products.json follows the same shape. The
          validator enforces every field below, so a valid entry is a complete
          one.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {FIELD_GROUPS.map((group) => (
            <div
              key={group.heading}
              className="rounded-lg border border-border bg-card p-5"
            >
              <h3 className="text-sm font-semibold text-foreground">
                {group.heading}
              </h3>
              <dl className="mt-4 flex flex-col gap-3">
                {group.fields.map((field) => (
                  <div key={field.name}>
                    <dt className="font-mono text-xs text-foreground">
                      {field.name}
                    </dt>
                    <dd className="mt-0.5 text-sm leading-6 text-muted-foreground">
                      {field.note}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-2xl">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Guidelines
        </h2>
        <ul className="mt-5 flex flex-col gap-3">
          {GUIDELINES.map((guideline) => (
            <li key={guideline} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <div className="rounded-lg border border-border bg-card p-8 sm:p-10">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Not a developer?
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Open an issue instead. Name the tool, link its website, and say
            what SaaS it replaces — a maintainer can turn it into an entry.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={GITHUB_DATA_FILE_URL}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <FileJson className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Edit products.json
            </Link>
            <Link
              href={`${GITHUB_REPO_URL}/issues/new`}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:border-zinc-300 hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:hover:border-zinc-700"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Open an issue
            </Link>
            <Link
              href={GITHUB_REPO_URL}
              className="inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <GitFork className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              Browse the repository
              <ExternalLink className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex gap-4 rounded-lg border border-border bg-muted/40 p-5">
          <Terminal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Validate your entry
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">
              pnpm install {"&&"} pnpm validate-data
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border px-6 py-14 text-center">
          <GitPullRequest className="h-5 w-5 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
          <div>
            <h2 className="text-sm font-semibold text-foreground">
              Ready to open a pull request?
            </h2>
            <p className="mx-auto mt-1 max-w-[52ch] text-sm leading-6 text-muted-foreground">
              Point your PR at main. Validation runs automatically — a green
              check means your entry is ready to review.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}