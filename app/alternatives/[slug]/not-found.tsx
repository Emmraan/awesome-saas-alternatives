import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

export default function ProductNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-28 text-center">
      <Reveal>
        <div className="mx-auto max-w-md rounded-xl border border-line bg-pine p-8 text-left font-mono shadow-card dark:bg-[#0a120d]">
          <p className="text-[13px] text-fog">
            <span className="text-mint">$</span> cat /alternatives/unknown
          </p>
          <p className="mt-2 text-[13px] text-coral">bash: no such file or directory</p>
          <p className="mt-2 text-[13px] text-dim"># exit code 404</p>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h1 className="mt-8 font-display text-5xl font-extrabold tracking-tight text-ink">
          Product not found
        </h1>
        <p className="mt-3 text-fog">
          We couldn&apos;t find that product in the directory — it may have been renamed or removed.
        </p>
        <Link
          href="/alternatives"
          className="mt-8 inline-flex rounded-md bg-mint px-6 py-3.5 font-mono text-[12.5px] font-semibold uppercase tracking-wider text-void transition-colors hover:bg-ink"
        >
          Browse all alternatives
        </Link>
      </Reveal>
    </div>
  );
}