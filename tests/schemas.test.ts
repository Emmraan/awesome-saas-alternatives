import { describe, expect, it } from "vitest";
import {
  categorySchema,
  difficultySchema,
  featureSchema,
  githubMetadataSchema,
  githubReleaseSchema,
  pricingModelSchema,
  productSchema,
  productStatusSchema,
} from "../lib/schemas";

const VALID_CATEGORY = {
  slug: "cloud-hosting",
  name: "Cloud Hosting",
  description: "Host applications and sites in the cloud.",
  parent: null,
};

const VALID_FEATURE = {
  id: "open-source",
  name: "Open source",
  description: "Source code is publicly available.",
  group: "Licensing",
};

const VALID_GITHUB_METADATA = {
  stars: 12000,
  forks: 900,
  license: "Apache-2.0",
  release: {
    tag: "v1.0.0",
    publishedAt: "2026-01-15T00:00:00.000Z",
  },
  fetchedAt: "2026-01-16T00:00:00.000Z",
};

const VALID_PRODUCT = {
  slug: "coolify",
  name: "Coolify",
  tagline: "Self-host your web apps with one command.",
  description:
    "Open-source, self-hostable PaaS that deploys apps on your own servers.",
  website: "https://coolify.io",
  repo: "coollabsio/coolify",
  license: "Apache-2.0",
  openSource: true,
  selfHosted: true,
  pricing: "free",
  difficulty: "medium",
  categories: ["cloud-hosting"],
  replaces: ["vercel", "netlify"],
  features: ["open-source"],
  tags: ["paas", "self-hosted"],
  github: null,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-10T00:00:00.000Z",
  status: "active",
};

describe("categorySchema", () => {
  it("accepts a valid category including a parent slug", () => {
    expect(
      categorySchema.parse({ ...VALID_CATEGORY, parent: "hosting" }),
    ).toMatchObject({ slug: "cloud-hosting" });
  });

  it("rejects an invalid slug", () => {
    expect(
      categorySchema.safeParse({ ...VALID_CATEGORY, slug: "Cloud Hosting" })
        .success,
    ).toBe(false);
    expect(
      categorySchema.safeParse({ ...VALID_CATEGORY, slug: "cloud_Hosting" })
        .success,
    ).toBe(false);
  });

  it("rejects a missing description", () => {
    const { success } = categorySchema.safeParse({
      ...VALID_CATEGORY,
      description: "",
    });
    expect(success).toBe(false);
  });

  it("is strict and rejects unknown keys", () => {
    expect(
      categorySchema.safeParse({ ...VALID_CATEGORY, extra: true }).success,
    ).toBe(false);
  });
});

describe("featureSchema", () => {
  it("accepts a valid feature", () => {
    expect(featureSchema.parse(VALID_FEATURE)).toMatchObject({ id: "open-source" });
  });

  it("rejects an invalid id and a blank name", () => {
    expect(
      featureSchema.safeParse({ ...VALID_FEATURE, id: "Open Source" }).success,
    ).toBe(false);
    expect(
      featureSchema.safeParse({ ...VALID_FEATURE, name: "" }).success,
    ).toBe(false);
  });
});

describe("enum schemas", () => {
  it("accepts only the defined pricing, difficulty and status values", () => {
    for (const value of ["free", "freemium", "paid"]) {
      expect(pricingModelSchema.parse(value)).toBe(value);
    }
    expect(pricingModelSchema.safeParse("cheap").success).toBe(false);

    for (const value of ["easy", "medium", "hard"]) {
      expect(difficultySchema.parse(value)).toBe(value);
    }
    expect(difficultySchema.safeParse("expert").success).toBe(false);

    for (const value of ["active", "archived", "draft"]) {
      expect(productStatusSchema.parse(value)).toBe(value);
    }
    expect(productStatusSchema.safeParse("deleted").success).toBe(false);
  });
});

describe("githubMetadataSchema (GitHub metadata parsing)", () => {
  it("parses a full GitHub metadata payload", () => {
    expect(githubMetadataSchema.parse(VALID_GITHUB_METADATA)).toEqual(
      VALID_GITHUB_METADATA,
    );
  });

  it("accepts a release with all fields and a payload with null stats", () => {
    const sparse = {
      stars: null,
      forks: null,
      license: null,
      release: null,
      fetchedAt: null,
    };
    expect(githubMetadataSchema.parse(sparse)).toEqual(sparse);
  });

  it("rejects negative or non-integer star counts", () => {
    expect(
      githubMetadataSchema.safeParse({ ...VALID_GITHUB_METADATA, stars: -5 })
        .success,
    ).toBe(false);
    expect(
      githubMetadataSchema.safeParse({ ...VALID_GITHUB_METADATA, stars: 12.5 })
        .success,
    ).toBe(false);
  });

  it("rejects non-numeric forks", () => {
    expect(
      githubMetadataSchema.safeParse({ ...VALID_GITHUB_METADATA, forks: "900" })
        .success,
    ).toBe(false);
  });

  it("rejects a release without a valid publishedAt datetime", () => {
    expect(
      githubMetadataSchema.safeParse({
        ...VALID_GITHUB_METADATA,
        release: { tag: "v1.0.0", publishedAt: "2026/01/15" },
      }).success,
    ).toBe(false);
  });
});

describe("githubReleaseSchema", () => {
  it("accepts a valid release", () => {
    expect(
      githubReleaseSchema.parse({
        tag: "v2.1.0",
        publishedAt: "2026-03-01T12:00:00.000Z",
      }),
    ).toEqual({ tag: "v2.1.0", publishedAt: "2026-03-01T12:00:00.000Z" });
  });

  it("rejects an empty tag", () => {
    expect(
      githubReleaseSchema.safeParse({
        tag: "",
        publishedAt: "2026-03-01T12:00:00.000Z",
      }).success,
    ).toBe(false);
  });
});

describe("productSchema", () => {
  it("accepts a valid product with and without GitHub metadata", () => {
    expect(productSchema.parse(VALID_PRODUCT)).toMatchObject({ slug: "coolify" });
    expect(
      productSchema.parse({
        ...VALID_PRODUCT,
        github: VALID_GITHUB_METADATA,
      }).github,
    ).toEqual(VALID_GITHUB_METADATA);
  });

  it("rejects an invalid slug and a malformed website URL", () => {
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, slug: "Coolify" }).success,
    ).toBe(false);
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, website: "coolify" }).success,
    ).toBe(false);
  });

  it("rejects a repo that is not in owner/name format", () => {
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, repo: "not-a-repo" }).success,
    ).toBe(false);
  });

  it("rejects an empty categories list and an out-of-range pricing value", () => {
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, categories: [] }).success,
    ).toBe(false);
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, pricing: "bargain" }).success,
    ).toBe(false);
  });

  it("rejects a bad ISO datetime for createdAt and updatedAt", () => {
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, createdAt: "yesterday" })
        .success,
    ).toBe(false);
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, updatedAt: "now" }).success,
    ).toBe(false);
  });

  it("is strict and rejects unknown keys", () => {
    expect(
      productSchema.safeParse({ ...VALID_PRODUCT, homepage: "x" }).success,
    ).toBe(false);
  });
});