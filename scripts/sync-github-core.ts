import type { GitHubMetadata, GitHubRelease, Product } from "../lib/types";
import { githubMetadataSchema, githubReleaseSchema } from "../lib/schemas";

export const DEFAULT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export interface SyncOptions {
  force?: boolean;
  maxAgeMs?: number;
  limit?: number;
}

export interface RepoResponse {
  stars: number | null;
  forks: number | null;
  license: string | null;
}

export function isGithubStale(
  github: GitHubMetadata | null,
  now: number,
  maxAgeMs: number,
): boolean {
  if (github === null) return true;
  if (github.fetchedAt === null) return true;
  const fetched = Date.parse(github.fetchedAt);
  if (Number.isNaN(fetched)) return true;
  return now - fetched >= maxAgeMs;
}

export function selectReposToSync(
  products: Product[],
  now: number,
  opts: SyncOptions,
): Product[] {
  const maxAgeMs = opts.force ? 0 : (opts.maxAgeMs ?? DEFAULT_MAX_AGE_MS);
  const candidates = products.filter(
    (p) => p.repo !== null && isGithubStale(p.github, now, maxAgeMs),
  );
  return opts.limit ? candidates.slice(0, opts.limit) : candidates;
}

export function mapRepoResponse(json: unknown): RepoResponse {
  if (json === null || typeof json !== "object") {
    return { stars: null, forks: null, license: null };
  }
  const r = json as Record<string, unknown>;
  const spdx =
    r.license !== null && typeof r.license === "object"
      ? ((r.license as Record<string, unknown>).spdx_id as unknown)
      : null;
  return {
    stars:
      typeof r.stargazers_count === "number" && r.stargazers_count >= 0
        ? r.stargazers_count
        : null,
    forks:
      typeof r.forks_count === "number" && r.forks_count >= 0
        ? r.forks_count
        : null,
    license: typeof spdx === "string" && spdx.length > 0 ? spdx : null,
  };
}

export function mapReleaseResponse(json: unknown): GitHubRelease | null {
  if (json === null || typeof json !== "object") return null;
  const r = json as Record<string, unknown>;
  const parsed = githubReleaseSchema.safeParse({
    tag: r.tag_name,
    publishedAt: r.published_at,
  });
  return parsed.success ? parsed.data : null;
}

export function buildGithubMetadata(
  repoJson: unknown,
  releaseJson: unknown,
  now: number,
): GitHubMetadata {
  const release = mapReleaseResponse(releaseJson);
  return githubMetadataSchema.parse({
    ...mapRepoResponse(repoJson),
    release,
    fetchedAt: new Date(now).toISOString(),
  });
}

export function serializeValue(value: unknown, indent = 0): string {
  if (value === null) return "null";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => serializeValue(v, indent)).join(", ")}]`;
  }
  const obj = value as Record<string, unknown>;
  const inner = "  ".repeat(indent + 1);
  const entries = Object.entries(obj).map(
    ([k, v]) => `${inner}"${k}": ${serializeValue(v, indent + 1)}`,
  );
  return `{\n${entries.join(",\n")}\n${inner}}`;
}

export function serializeProducts(products: Product[]): string {
  return `[\n${products.map((p) => serializeValue(p, 0)).join(",\n")}\n]\n`;
}
