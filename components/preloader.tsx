"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

const WORDS = ["Rorry", "Ramos"];

/**
 * Page-load animation: name reveal + progress counter, then a cinematic
 * curtain wipe. Signals the rest of the page via `app:ready`.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const overlay = root.current;
      if (!overlay) return;

      const finish = () => {
        delete html.dataset.loading;
        html.dataset.ready = "true";
        overlay.style.display = "none";
        window.dispatchEvent(new Event("app:ready"));
      };

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          full: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          if (ctx.conditions?.reduce) {
            gsap.to(overlay, { opacity: 0, duration: 0.25, onComplete: finish });
            return;
          }

          const progress = { value: 0 };
          const tl = gsap.timeline({ onComplete: finish });

          tl.from("[data-pre-word]", {
            yPercent: 115,
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.08,
          })
            .to(
              progress,
              {
                value: 100,
                duration: 1.5,
                ease: "power2.inOut",
                onUpdate: () => {
                  if (counter.current) {
                    counter.current.textContent = String(
                      Math.round(progress.value)
                    ).padStart(3, "0");
                  }
                  if (bar.current) {
                    bar.current.style.transform = `scaleX(${progress.value / 100})`;
                  }
                },
              },
              0.1
            )
            .to(
              "[data-pre-content]",
              { yPercent: -30, opacity: 0, duration: 0.5, ease: "power3.in" },
              ">0.15"
            )
            .to(
              overlay,
              {
                clipPath: "inset(0% 0% 100% 0%)",
                duration: 1.05,
                ease: "expo.inOut",
              },
              "<0.1"
            );
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <div
      id="preloader"
      ref={root}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-100 flex items-end justify-between bg-background p-6 sm:p-12"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(40rem 28rem at 80% 20%, rgb(198 255 61 / 0.12), transparent 60%), radial-gradient(36rem 26rem at 10% 90%, rgb(110 90 255 / 0.14), transparent 60%)",
        }}
      />

      <div data-pre-content className="relative w-full">
        <p
          className="font-display text-[clamp(3.5rem,14vw,11rem)] leading-[0.9] font-semibold tracking-tighter"
          aria-hidden
        >
          {WORDS.map((word) => (
            <span
              key={word}
              className="block overflow-hidden pb-[0.08em]"
            >
              <span data-pre-word className="block">
                {word}
                <span className="text-accent">.</span>
              </span>
            </span>
          ))}
        </p>

        <div className="mt-8 flex items-center gap-5">
          <div className="relative h-px flex-1 overflow-hidden bg-white/15">
            <div
              ref={bar}
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span
            ref={counter}
            aria-hidden
            className="font-mono text-sm tabular-nums text-muted-foreground"
          >
            000
          </span>
        </div>
      </div>
    </div>
  );
}
