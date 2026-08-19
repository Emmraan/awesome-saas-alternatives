import { getCategories, getProducts } from "@/lib/data";
import {
  GITHUB_DATA_FILE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  getAbsoluteUrl,
} from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const products = getProducts();
  const categories = getCategories();

  const lines: string[] = [];
  lines.push(`# ${SITE_NAME}`);
  lines.push("");
  lines.push(`> ${SITE_TAGLINE}`);
  lines.push("");
  lines.push(
    `${SITE_NAME} is a community directory of free, open-source and self-hosted tools that replace popular paid SaaS. `,
  );
  lines.push(
    `Every product page lists the SaaS it replaces, its license, hosting model and pricing, plus side-by-side feature comparisons. `,
  );
  lines.push(
    `The catalog covers ${products.length} products across ${categories.length} categories — infrastructure, analytics, email, automation, AI, security, billing and more. `,
  );
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  lines.push(
    `- [Home](${getAbsoluteUrl("/")}): ${SITE_TAGLINE} — start here for popular swaps and categories.`,
  );
  lines.push(
    `- [Alternatives directory](${getAbsoluteUrl("/alternatives")}): browse every product, filterable by pricing, hosting, license and setup effort.`,
  );
  lines.push(
    `- [Categories](${getAbsoluteUrl("/categories")}): the full category hierarchy with product counts.`,
  );
  lines.push(
    `- [Search](${getAbsoluteUrl("/search")}): find a tool by name, category or the SaaS you want to replace.`,
  );
  lines.push(
    `- [Contribute](${getAbsoluteUrl("/contribute")}): how to add a product or fix an entry.`,
  );
  lines.push("");

  lines.push("## Categories");
  lines.push("");
  for (const category of categories) {
    lines.push(
      `- [${category.name}](${getAbsoluteUrl(`/categories/${category.slug}`)}): ${category.description}`,
    );
  }
  lines.push("");

  lines.push("## Products");
  lines.push("");
  for (const product of products) {
    lines.push(
      `- [${product.name}](${getAbsoluteUrl(`/alternatives/${product.slug}`)}): ${product.tagline}`,
    );
  }
  lines.push("");

  lines.push("## Optional");
  lines.push("");
  lines.push(
    `- [Product data (JSON)](${GITHUB_DATA_FILE_URL}): the machine-readable source of all ${products.length} products — this file is the CMS.`,
  );

  const body = `${lines.join("\n")}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}