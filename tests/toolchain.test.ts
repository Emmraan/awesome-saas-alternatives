import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const REPO_ROOT = new URL("../", import.meta.url);

function readText(relativePath: string): string {
  return readFileSync(new URL(relativePath, REPO_ROOT), "utf8");
}

/** package.json is the single source of truth for toolchain versions. */
describe("toolchain versions", () => {
  it("pins .nvmrc to the exact version in package.json engines.node", () => {
    const pkg = JSON.parse(readText("package.json")) as {
      engines?: { node?: string };
    };
    const enginesNode = pkg.engines?.node ?? "";
    const pinned = enginesNode.match(/(\d+\.\d+\.\d+)/)?.[1];
    expect(pinned, "engines.node must contain an exact x.y.z floor").toBeDefined();
    expect(readText(".nvmrc").trim()).toBe(pinned);
  });

  it("pins pnpm via the packageManager field", () => {
    const pkg = JSON.parse(readText("package.json")) as {
      packageManager?: string;
    };
    expect(pkg.packageManager ?? "").toMatch(/^pnpm@\d+\.\d+\.\d+/);
  });
});
