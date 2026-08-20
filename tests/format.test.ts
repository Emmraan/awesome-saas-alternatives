import { describe, expect, it } from "vitest";
import { cn } from "../lib/cn";
import { formatCompact } from "../lib/format";

describe("formatCompact", () => {
  it("keeps numbers below 1000 verbatim", () => {
    expect(formatCompact(0)).toBe("0");
    expect(formatCompact(7)).toBe("7");
    expect(formatCompact(999)).toBe("999");
  });

  it("formats thousands with a k suffix", () => {
    expect(formatCompact(1_000)).toBe("1k");
    expect(formatCompact(2_500)).toBe("2.5k");
    expect(formatCompact(123_400)).toBe("123.4k");
    expect(formatCompact(999_900)).toBe("999.9k");
  });

  it("formats millions with an M suffix", () => {
    expect(formatCompact(1_000_000)).toBe("1M");
    expect(formatCompact(2_500_000)).toBe("2.5M");
    expect(formatCompact(12_345_678)).toBe("12.3M");
  });

  it("trims a trailing .0 from whole decimal values", () => {
    expect(formatCompact(1_200)).toBe("1.2k");
    expect(formatCompact(1_000_000)).toBe("1M");
    expect(formatCompact(3_000_000)).toBe("3M");
  });
});

describe("cn", () => {
  it("joins truthy class names with a single space", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("returns an empty string when nothing is truthy", () => {
    expect(cn()).toBe("");
    expect(cn(false, null, undefined)).toBe("");
  });
});