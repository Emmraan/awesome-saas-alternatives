export function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  if (n < 1_000_000) return `${trimZero(n / 1000)}k`;
  return `${trimZero(n / 1_000_000)}M`;
}

function trimZero(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1).replace(/\.0$/, "");
}
