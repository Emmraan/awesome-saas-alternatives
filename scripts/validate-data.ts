import { readFileSync } from "node:fs";
import { categorySchema, featureSchema, productSchema } from "../lib/schemas";
import type { Category, Feature, Product } from "../lib/types";

interface ValidationResult {
  ok: boolean;
  errors: string[];
  categories?: Category[];
  features?: Feature[];
  products?: Product[];
}

function readJson(relativePath: string): unknown {
  const url = new URL(`../data/${relativePath}`, import.meta.url);
  return JSON.parse(readFileSync(url, "utf8"));
}

function validateCategories(raw: unknown): ValidationResult {
  const result: ValidationResult = { ok: true, errors: [], categories: [] };
  if (!Array.isArray(raw)) {
    return { ok: false, errors: ["categories.json: expected an array"] };
  }
  const seen = new Set<string>();
  raw.forEach((entry, i) => {
    const parsed = categorySchema.safeParse(entry);
    if (!parsed.success) {
      result.ok = false;
      result.errors.push(
        `categories.json[${i}]: ${parsed.error.issues.map((iss) => iss.message).join(", ")}`,
      );
      return;
    }
    if (seen.has(parsed.data.slug)) {
      result.ok = false;
      result.errors.push(`categories.json: duplicate slug "${parsed.data.slug}"`);
    }
    seen.add(parsed.data.slug);
    result.categories!.push(parsed.data);
  });
  for (const c of result.categories!) {
    if (c.parent !== null && !seen.has(c.parent)) {
      result.ok = false;
      result.errors.push(
        `categories.json: "${c.slug}" references missing parent "${c.parent}"`,
      );
    }
  }
  return result;
}

function validateFeatures(raw: unknown): ValidationResult {
  const result: ValidationResult = { ok: true, errors: [], features: [] };
  if (!Array.isArray(raw)) {
    return { ok: false, errors: ["features.json: expected an array"] };
  }
  const seen = new Set<string>();
  raw.forEach((entry, i) => {
    const parsed = featureSchema.safeParse(entry);
    if (!parsed.success) {
      result.ok = false;
      result.errors.push(
        `features.json[${i}]: ${parsed.error.issues.map((iss) => iss.message).join(", ")}`,
      );
      return;
    }
    if (seen.has(parsed.data.id)) {
      result.ok = false;
      result.errors.push(`features.json: duplicate id "${parsed.data.id}"`);
    }
    seen.add(parsed.data.id);
    result.features!.push(parsed.data);
  });
  return result;
}

function validateProducts(
  raw: unknown,
  categorySlugs: Set<string>,
  featureIds: Set<string>,
): ValidationResult {
  const result: ValidationResult = { ok: true, errors: [], products: [] };
  if (!Array.isArray(raw)) {
    return { ok: false, errors: ["products.json: expected an array"] };
  }
  const seen = new Set<string>();
  raw.forEach((entry, i) => {
    const parsed = productSchema.safeParse(entry);
    if (!parsed.success) {
      result.ok = false;
      result.errors.push(
        `products.json[${i}]: ${parsed.error.issues.map((iss) => iss.message).join(", ")}`,
      );
      return;
    }
    const product: Product = parsed.data;
    if (seen.has(product.slug)) {
      result.ok = false;
      result.errors.push(`products.json: duplicate slug "${product.slug}"`);
    }
    seen.add(product.slug);
    result.products!.push(product);
    for (const c of product.categories) {
      if (!categorySlugs.has(c)) {
        result.ok = false;
        result.errors.push(
          `products.json: "${product.slug}" references missing category "${c}"`,
        );
      }
    }
    for (const f of product.features) {
      if (!featureIds.has(f)) {
        result.ok = false;
        result.errors.push(
          `products.json: "${product.slug}" references missing feature "${f}"`,
        );
      }
    }
  });
  return result;
}

function main(): void {
  const categoriesJson = readJson("categories.json");
  const featuresJson = readJson("features.json");
  const productsJson = readJson("products.json");

  const categoryResult = validateCategories(categoriesJson);
  const featureResult = validateFeatures(featuresJson);

  const categorySlugs = new Set<string>();
  for (const c of categoryResult.categories ?? []) categorySlugs.add(c.slug);
  const featureIds = new Set<string>();
  for (const f of featureResult.features ?? []) featureIds.add(f.id);

  const productResult = validateProducts(productsJson, categorySlugs, featureIds);

  const results = [categoryResult, featureResult, productResult];
  const allOk = results.every((r) => r.ok);
  const totalErrors = results.reduce((n, r) => n + r.errors.length, 0);

  if (allOk) {
    const categoryCount = categoryResult.categories?.length ?? 0;
    const featureCount = featureResult.features?.length ?? 0;
    const productCount = productResult.products?.length ?? 0;
    console.log(
      `✓ validate-data: ${categoryCount} categories, ${featureCount} features, ${productCount} products — all valid`,
    );
  } else {
    for (const r of results) {
      for (const err of r.errors) console.error(`✗ ${err}`);
    }
    console.error(`✗ validate-data: ${totalErrors} error(s)`);
    process.exitCode = 1;
  }
}

main();