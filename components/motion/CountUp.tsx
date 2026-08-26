"use client";

import { useCountUp } from "./hooks";

export function CountUp({
  target,
  suffix,
  className,
}: {
  target: number;
  suffix?: string;
  className?: string;
}) {
  const [ref, value] = useCountUp(target);
  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("en-US")}
      {suffix ? <span className="text-mint">{suffix}</span> : null}
    </span>
  );
}
