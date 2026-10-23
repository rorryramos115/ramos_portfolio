"use client";

import { Fragment, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

type SectionHeadingProps = {
  /** Decorative section number, e.g. "01". */
  index: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
};

/** Section title with a masked word-by-word rise, plus a fading intro. */
export function SectionHeading({
  index,
  title,
  children,
  className,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const words = title.split(" ");

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        tl.from("[data-fade-index]", { opacity: 0, x: -16, duration: 0.8 })
          .from(
            "[data-word]",
            { yPercent: 115, duration: 1.15, ease: "expo.out", stagger: 0.07 },
            0.05
          )
          .from(
            "[data-fade]",
            { opacity: 0, y: 24, duration: 1, ease: "expo.out" },
            0.3
          );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      <p
        data-fade-index
        aria-hidden
        className="mb-4 flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-accent"
      >
        <span>{index}</span>
        <span className="h-px w-10 bg-accent/60" />
      </p>
      <h2 className="font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <span data-word className="text-gradient inline-block">
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </h2>
      {children ? <div data-fade>{children}</div> : null}
    </div>
  );
}
