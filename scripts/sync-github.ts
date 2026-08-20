import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import type { GitHubMetadata, Product } from "../lib/types";
import {
  buildGithubMetadata,
  selectReposToSync,
  serializeProducts,
  DEFAULT_MAX_AGE_MS,
} from "./sync-github-core";

const DATA_FILE = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "data",
  "products.json",
);
const API = "https://api.github.com";
const USER_AGENT = "awesome-saas-alternatives-sync";

interface CliOptions {
  force: boolean;
  limit: number | undefined;
  maxAgeMs: number;
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = { force: false, limit: undefined, maxAgeMs: DEFAULT_MAX_AGE_MS };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--force") opts.force = true;
    if (arg === "--limit") opts.limit = Number(argv[++i]);
    if (arg === "--max-age-hours") opts.maxAgeMs = Number(argv[++i]) * 60 * 60 * 1000;
  }
  return opts;
}

function loadToken(): string | undefined {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  for (const file of [".env", ".env.local"]) {
    try {
      const content = readFileSync(join(process.cwd(), file), "utf8");
      const match = content.match(/^GITHUB_TOKEN=(.*)$/m);
      if (match && match[1]) return match[1].trim();
    } catch {
      // file missing — ignore
    }
  }
  return undefined;
}

async function githubFetch(path: string, token?: string): Promise<Response> {
  const headers: Record<string, string> = {
    accept: "application/vnd.github+json",
    "user-agent": USER_AGENT,
  };
  if (token) headers.authorization = `Bearer ${token}`;
  return fetch(`${API}${path}`, { headers });
}

async function syncProduct(
  product: Product,
  token?: string,
): Promise<GitHubMetadata | null> {
  const repo = product.repo!;
  const repoRes = await githubFetch(`/repos/${repo}`, token);
  if (repoRes.status === 404) {
    console.warn(`  ⚠ ${repo}: 404 not found — leaving github null`);
    return null;
  }
  if (repoRes.status === 403 || repoRes.status === 429) {
    const remaining = repoRes.headers.get("x-ratelimit-remaining");
    console.warn(
      `  ⚠ ${repo}: rate limited (HTTP ${repoRes.status}, remaining=${remaining}) — stopping`,
    );
    return null;
  }
  if (!repoRes.ok) {
    console.warn(`  ⚠ ${repo}: HTTP ${repoRes.status} — leaving github null`);
    return null;
  }
  const repoJson: unknown = await repoRes.json();

  let releaseJson: unknown = null;
  const releaseRes = await githubFetch(`/repos/${repo}/releases/latest`, token);
  if (releaseRes.status === 200) {
    releaseJson = await releaseRes.json();
  } else if (releaseRes.status !== 404) {
    console.warn(`  ℹ ${repo}: no latest release (HTTP ${releaseRes.status})`);
  }

  return buildGithubMetadata(repoJson, releaseJson, Date.now());
}

async function main(): Promise<number> {
  const opts = parseArgs(process.argv.slice(2));
  const token = loadToken();

  const products: Product[] = JSON.parse(readFileSync(DATA_FILE, "utf8"));
  const toSync = selectReposToSync(products, Date.now(), opts);

  if (toSync.length === 0) {
    console.log(
      `✓ sync-github: nothing to sync (${products.length} products, all github metadata fresh)`,
    );
    return 0;
  }

  console.log(`↻ syncing ${toSync.length} repo(s)…`);
  if (!token) {
    console.warn(
      "  ℹ no GITHUB_TOKEN found (env or .env) — unauthenticated limit is 60 req/hr",
    );
  }

  let updated = 0;
  for (const product of toSync) {
    const repo = product.repo!;
    process.stdout.write(`  • ${repo}… `);
    const meta = await syncProduct(product, token);
    if (meta === null) {
      console.log("skipped");
      continue;
    }
    product.github = meta;
    updated++;
    const rel = meta.release ? `, release ${meta.release.tag}` : "";
    console.log(
      `✓ ${meta.stars ?? "?"}★ ${meta.forks ?? "?"}⑂${rel}`,
    );
  }

  if (updated > 0) {
    writeFileSync(DATA_FILE, serializeProducts(products), "utf8");
  }
  console.log(`✓ sync-github: ${updated}/${toSync.length} repo(s) updated`);
  return 0;
}

const isMain = (() => {
  try {
    return (
      process.argv[1] !== undefined &&
      pathToFileURL(process.argv[1]).href === import.meta.url
    );
  } catch {
    return false;
  }
})();

if (isMain) {
  main().then((code) => {
    process.exitCode = code;
  });
}