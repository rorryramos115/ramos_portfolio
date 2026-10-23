"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  /** Stagger the direct children instead of the wrapper (seconds between items). */
  stagger?: number;
};

/**
 * Scroll-triggered reveal. Content is fully visible in the DOM until GSAP
 * runs, and is left untouched for users who prefer reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 48,
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(stagger ? Array.from(el.children) : el, {
          y,
          opacity: 0,
          duration: 1.15,
          delay,
          ease: "expo.out",
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
