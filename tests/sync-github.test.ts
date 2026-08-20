import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { GitHubMetadata, Product } from "../lib/types";
import {
  buildGithubMetadata,
  isGithubStale,
  mapReleaseResponse,
  mapRepoResponse,
  selectReposToSync,
  serializeProducts,
} from "../scripts/sync-github-core";

const NOW = Date.parse("2026-08-20T12:00:00.000Z");

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    slug: "coolify",
    name: "Coolify",
    tagline: "Open-source, self-hostable PaaS",
    description: "desc",
    website: "https://coolify.io",
    repo: "coollabsio/coolify",
    license: "Apache-2.0",
    openSource: true,
    selfHosted: true,
    pricing: "free",
    difficulty: "medium",
    categories: ["cloud-hosting"],
    replaces: ["Vercel"],
    features: [],
    tags: [],
    github: null,
    createdAt: "2026-08-19T00:00:00.000Z",
    updatedAt: "2026-08-19T00:00:00.000Z",
    status: "active",
    ...overrides,
  };
}

describe("isGithubStale", () => {
  it("is stale when github is null", () => {
    expect(isGithubStale(null, NOW, 1000)).toBe(true);
  });

  it("is stale when fetchedAt is null", () => {
    const github: GitHubMetadata = {
      stars: null,
      forks: null,
      license: null,
      release: null,
      fetchedAt: null,
    };
    expect(isGithubStale(github, NOW, 1000)).toBe(true);
  });

  it("is stale when fetchedAt is unparseable", () => {
    const github: GitHubMetadata = {
      stars: 1,
      forks: 0,
      license: null,
      release: null,
      fetchedAt: "not-a-date",
    };
    expect(isGithubStale(github, NOW, 1000)).toBe(true);
  });

  it("is fresh when fetched within max age", () => {
    const github: GitHubMetadata = {
      stars: 100,
      forks: 5,
      license: "MIT",
      release: null,
      fetchedAt: new Date(NOW - 1000).toISOString(),
    };
    expect(isGithubStale(github, NOW, 60_000)).toBe(false);
  });

  it("is stale when fetched before max age", () => {
    const github: GitHubMetadata = {
      stars: 100,
      forks: 5,
      license: "MIT",
      release: null,
      fetchedAt: new Date(NOW - 61_000).toISOString(),
    };
    expect(isGithubStale(github, NOW, 60_000)).toBe(true);
  });
});

describe("selectReposToSync", () => {
  const products = [
    makeProduct({ slug: "fresh", github: { stars: 1, forks: 0, license: null, release: null, fetchedAt: new Date(NOW - 1000).toISOString() } }),
    makeProduct({ slug: "stale", github: { stars: 1, forks: 0, license: null, release: null, fetchedAt: new Date(NOW - 25 * 60 * 60 * 1000).toISOString() } }),
    makeProduct({ slug: "no-repo", repo: null }),
  ];

  it("syncs only stale repos", () => {
    const result = selectReposToSync(products, NOW, {});
    expect(result.map((p) => p.slug)).toEqual(["stale"]);
  });

  it("syncs everything with force", () => {
    const result = selectReposToSync(products, NOW, { force: true });
    expect(result.map((p) => p.slug)).toEqual(["fresh", "stale"]);
  });

  it("respects limit", () => {
    const result = selectReposToSync(products, NOW, { force: true, limit: 1 });
    expect(result.map((p) => p.slug)).toEqual(["fresh"]);
  });

  it("ignores products without a repo", () => {
    const result = selectReposToSync(products, NOW, { force: true });
    expect(result.some((p) => p.repo === null)).toBe(false);
  });

  it("uses default max age when not provided", () => {
    const now = Date.now();
    const old = makeProduct({
      slug: "old",
      github: { stars: 1, forks: 0, license: null, release: null, fetchedAt: new Date(now - 25 * 60 * 60 * 1000).toISOString() },
    });
    expect(selectReposToSync([old], now, {}).map((p) => p.slug)).toEqual(["old"]);
  });
});

describe("mapRepoResponse", () => {
  it("maps a full GitHub repo response", () => {
    expect(
      mapRepoResponse({
        stargazers_count: 42,
        forks_count: 7,
        license: { spdx_id: "Apache-2.0" },
      }),
    ).toEqual({ stars: 42, forks: 7, license: "Apache-2.0" });
  });

  it("maps missing license to null", () => {
    expect(
      mapRepoResponse({
        stargazers_count: 42,
        forks_count: 7,
        license: null,
      }),
    ).toEqual({ stars: 42, forks: 7, license: null });
  });

  it("maps missing spdx_id to null", () => {
    expect(
      mapRepoResponse({
        stargazers_count: 42,
        forks_count: 7,
        license: { spdx_id: null },
      }),
    ).toEqual({ stars: 42, forks: 7, license: null });
  });

  it("treats non-numeric stars/forks as null", () => {
    expect(
      mapRepoResponse({ stargazers_count: "many", forks_count: undefined }),
    ).toEqual({ stars: null, forks: null, license: null });
  });

  it("treats null/empty response as all-null", () => {
    expect(mapRepoResponse(null)).toEqual({ stars: null, forks: null, license: null });
    expect(mapRepoResponse("nope")).toEqual({ stars: null, forks: null, license: null });
  });

  it("rejects negative star counts", () => {
    expect(mapRepoResponse({ stargazers_count: -5 }).stars).toBeNull();
  });
});

describe("mapReleaseResponse", () => {
  it("maps a valid latest-release response", () => {
    expect(
      mapReleaseResponse({ tag_name: "v1.2.3", published_at: "2026-08-01T10:00:00Z" }),
    ).toEqual({ tag: "v1.2.3", publishedAt: "2026-08-01T10:00:00Z" });
  });

  it("returns null for a 404-style null body", () => {
    expect(mapReleaseResponse(null)).toBeNull();
  });

  it("returns null when tag is missing", () => {
    expect(mapReleaseResponse({ published_at: "2026-08-01T10:00:00Z" })).toBeNull();
  });

  it("returns null when published_at is not a valid datetime", () => {
    expect(mapReleaseResponse({ tag_name: "v1", published_at: "soon" })).toBeNull();
  });
});

describe("buildGithubMetadata", () => {
  it("builds schema-valid metadata", () => {
    const meta = buildGithubMetadata(
      { stargazers_count: 10, forks_count: 2, license: { spdx_id: "MIT" } },
      { tag_name: "v1.0.0", published_at: "2026-08-01T10:00:00Z" },
      NOW,
    );
    expect(meta).toEqual({
      stars: 10,
      forks: 2,
      license: "MIT",
      release: { tag: "v1.0.0", publishedAt: "2026-08-01T10:00:00Z" },
      fetchedAt: new Date(NOW).toISOString(),
    });
  });

  it("keeps release null when no release exists", () => {
    const meta = buildGithubMetadata(
      { stargazers_count: 10, forks_count: 2, license: null },
      null,
      NOW,
    );
    expect(meta.release).toBeNull();
    expect(meta.license).toBeNull();
  });
});

describe("serializeProducts", () => {
  it("round-trips the products array into the file format", () => {
    const products = [
      makeProduct(),
      makeProduct({ slug: "vercel", name: "Vercel", repo: null, license: null, github: null }),
    ];
    const serialized = serializeProducts(products);
    expect(JSON.parse(serialized)).toEqual(products);
    expect(serialized.endsWith("\n]\n")).toBe(true);
    expect(serialized.startsWith("[\n")).toBe(true);
  });

  it("serializes a populated github metadata object with nested release", () => {
    const product = makeProduct({
      github: {
        stars: 60796,
        forks: 5308,
        license: "Apache-2.0",
        release: { tag: "v4.3.9", publishedAt: "2026-08-18T21:50:01Z" },
        fetchedAt: "2026-08-20T15:14:45.509Z",
      },
    });
    const serialized = serializeProducts([product]);
    const parsed = JSON.parse(serialized);
    expect(parsed[0].github).toEqual(product.github);
    expect(serialized).toContain(`"github": {`);
  });

  it("is byte-identical to the committed products file", () => {
    const file = join(process.cwd(), "data", "products.json");
    const original = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
    const products = JSON.parse(original) as Product[];
    expect(serializeProducts(products)).toBe(original);
  });
});