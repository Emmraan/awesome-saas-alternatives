"use client";

import { useEffect, useRef, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Observe an element; returns [ref, inView]. Fires once. */
export function useInView<T extends HTMLElement>(
  margin = "0px 0px -8% 0px",
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(
    () => typeof window !== "undefined" && !("IntersectionObserver" in window),
  );
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: margin, threshold: 0.08 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, margin]);
  return [ref, inView];
}

const SCRAMBLE_CHARS = "abcdefghjkmnpqrstuvwxyz#$%&/=+*";

/** Text-scramble decode: random glyphs settle into `word` whenever it changes. */
export function useScramble(word: string, duration = 620): string {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(word);
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const total = Math.max(6, Math.round(duration / 38));
    const id = setInterval(() => {
      frame += 1;
      const settled = Math.floor((frame / total) * word.length);
      if (frame >= total) {
        setDisplay(word);
        clearInterval(id);
        return;
      }
      let out = word.slice(0, settled);
      for (let i = settled; i < word.length; i++) {
        out +=
          word[i] === " "
            ? " "
            : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      }
      setDisplay(out);
    }, 38);
    return () => clearInterval(id);
  }, [word, duration, reduced]);
  return reduced ? word : display;
}

/** Animated count-up once the element is in view. */
export function useCountUp(
  target: number,
  duration = 1100,
): [React.RefObject<HTMLSpanElement | null>, number] {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, reduced]);
  return [ref, reduced ? target : value];
}
