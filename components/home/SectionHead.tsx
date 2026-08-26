import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

export function SectionHead({
  title,
  description,
}: {
  title: ReactNode;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-[2.6rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-fog">
            {description}
          </p>
        )}
      </div>
    </Reveal>
  );
}
