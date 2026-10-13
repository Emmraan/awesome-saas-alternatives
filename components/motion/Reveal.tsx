"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "./hooks";
import { cn } from "@/lib/cn";

type RevealTag = "div" | "section" | "li" | "span" | "article";

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
  ...props
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: RevealTag;
} & React.HTMLAttributes<HTMLElement>) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      className={cn("reveal", inView && "is-in", className)}
      style={{ "--rd": `${delay}ms` } as CSSProperties}
      {...props}
    >
      {children}
    </Tag>
  );
}
