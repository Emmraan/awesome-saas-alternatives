import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const REPO_PATTERN = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export const slugSchema = z
  .string()
  .regex(SLUG_PATTERN, "lowercase kebab-case slug required");

export const categorySchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(1),
    description: z.string().min(1),
    parent: slugSchema.nullable(),
  })
  .strict();

export type Category = z.infer<typeof categorySchema>;

export const featureSchema = z
  .object({
    id: slugSchema,
    name: z.string().min(1),
    description: z.string().min(1),
    group: z.string().min(1),
  })
  .strict();

export type Feature = z.infer<typeof featureSchema>;

export const pricingModelSchema = z.enum(["free", "freemium", "paid"]);
export type PricingModel = z.infer<typeof pricingModelSchema>;

export const difficultySchema = z.enum(["easy", "medium", "hard"]);
export type Difficulty = z.infer<typeof difficultySchema>;

export const productStatusSchema = z.enum(["active", "archived", "draft"]);
export type ProductStatus = z.infer<typeof productStatusSchema>;

export const githubReleaseSchema = z.object({
  tag: z.string().min(1),
  publishedAt: z.string().datetime(),
});
export type GitHubRelease = z.infer<typeof githubReleaseSchema>;

export const githubMetadataSchema = z.object({
  stars: z.number().int().nonnegative().nullable(),
  forks: z.number().int().nonnegative().nullable(),
  license: z.string().nullable(),
  release: githubReleaseSchema.nullable(),
  fetchedAt: z.string().datetime().nullable(),
});
export type GitHubMetadata = z.infer<typeof githubMetadataSchema>;

export const productSchema = z
  .object({
    slug: slugSchema,
    name: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
    website: z.string().url(),
    repo: z.string().regex(REPO_PATTERN, "owner/name format").nullable(),
    license: z.string().nullable(),
    openSource: z.boolean(),
    selfHosted: z.boolean(),
    pricing: pricingModelSchema,
    difficulty: difficultySchema,
    categories: z.array(slugSchema).min(1),
    replaces: z.array(z.string().min(1)).min(1),
    features: z.array(slugSchema),
    tags: z.array(z.string().min(1)),
    github: githubMetadataSchema.nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    status: productStatusSchema,
  })
  .strict();

export type Product = z.infer<typeof productSchema>;