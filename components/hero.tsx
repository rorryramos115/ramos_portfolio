"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, TerminalSquare } from "lucide-react";

import { Magnetic, Tilt } from "@/components/tilt";
import { Button } from "@/components/ui/button";
import { gsap, useGSAP } from "@/lib/gsap";

const NAME_WORDS = ["Rorry", "A.", "Ramos"];

function TypewriterLoop({
  text,
  className,
  typingSpeed = 45,
  deletingSpeed = 28,
  holdMs = 1400,
  pauseMs = 500,
}: {
  text: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  holdMs?: number;
  pauseMs?: number;
}) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting" | "pausing">(
    "typing"
  );

  useEffect(() => {
    if (reduce) return;
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (display.length < text.length) {
        timeout = setTimeout(
          () => setDisplay(text.slice(0, display.length + 1)),
          typingSpeed
        );
      } else {
        timeout = setTimeout(() => setPhase("holding"), holdMs);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (display.length > 0) {
        timeout = setTimeout(
          () => setDisplay(text.slice(0, display.length - 1)),
          deletingSpeed
        );
      } else {
        timeout = setTimeout(() => setPhase("pausing"), 0);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("typing"), pauseMs);
    }

    return () => clearTimeout(timeout);
  }, [display, phase, text, typingSpeed, deletingSpeed, holdMs, pauseMs, reduce]);

  const [head] = text.split(" · ");
  const shown = reduce ? text : display;
  const tailShown = shown.slice(head.length);
  const headShown = shown.slice(0, head.length);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        <span className="text-accent">{headShown}</span>
        <span className="text-muted-foreground/70">
          {tailShown.startsWith(" ·") ? " ·" : tailShown.slice(0, 3)}
        </span>
        <span className="text-foreground/80">
          {tailShown.startsWith(" · ") ? tailShown.slice(3) : ""}
        </span>
        {!reduce && (
          <span
            className="caret ml-0.5 inline-block w-px bg-current align-middle"
            style={{ height: "0.9em" }}
          />
        )}
      </span>
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Entrance — held until the preloader hands over.
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "expo.out" },
        });
        tl.from("[data-hero-word]", {
          yPercent: 118,
          rotate: 5,
          duration: 1.4,
          stagger: 0.1,
        })
          .from(
            "[data-hero-item]",
            { y: 36, opacity: 0, duration: 1.1, stagger: 0.09 },
            "-=1.0"
          );

        const play = () => tl.play();
        if (document.documentElement.dataset.ready === "true") play();
        else window.addEventListener("app:ready", play, { once: true });

        // Scroll-out: hero drifts up and softly fades as the next section arrives
        gsap.fromTo(
          "[data-hero-inner]",
          { yPercent: 0, opacity: 1 },
          {
            yPercent: -14,
            opacity: 0.15,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );

        return () => window.removeEventListener("app:ready", play);
      });

      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      id="home"
      ref={root}
      className="relative flex min-h-svh items-center pt-28 pb-16"
    >
      <div className="container">
        <div
          data-hero-inner
          className="max-w-3xl"
        >
          <div>
            <p
              data-hero-item
              className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-muted-foreground"
            >
              <TerminalSquare className="h-3.5 w-3.5 text-accent" />
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to new work — Sept 2026
            </p>

            <h1 className="font-display text-[clamp(3rem,9vw,6.75rem)] leading-[0.98] font-semibold tracking-tighter text-balance">
              {NAME_WORDS.map((word, i) => (
                <Fragment key={word}>
                  <span className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <span
                      data-hero-word
                      className={
                        i === NAME_WORDS.length - 1
                          ? "text-gradient-accent inline-block"
                          : "text-gradient inline-block"
                      }
                    >
                      {word}
                    </span>
                  </span>
                  {i < NAME_WORDS.length - 1 ? " " : null}
                </Fragment>
              ))}
            </h1>

            <p
              data-hero-item
              className="mt-4 font-mono text-sm text-muted-foreground/80 sm:text-base"
            >
              Full-stack developer, PH
            </p>

            <p
              data-hero-item
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Building responsive, high-performance web and mobile applications.
              Specializing in React, Next.js, TypeScript, and modern backend
              architectures to turn complex problems into clean, scalable
              software.
            </p>

            <p
              data-hero-item
              className="mt-6 font-mono text-sm text-muted-foreground sm:text-base"
            >
              <span className="text-accent/80">$ </span>
              <TypewriterLoop text="BSIT · rorryramos155@gmail.com" />
            </p>

            <div data-hero-item className="mt-9 flex flex-wrap gap-4">
              <Magnetic>
                <Tilt max={16} scale={1.06} glare={false} className="rounded-full">
                  <Button asChild variant="accent" size="lg">
                    <a href="#work">
                      View selected work
                      <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:translate-y-0.5" />
                    </a>
                  </Button>
                </Tilt>
              </Magnetic>
              <Magnetic>
                <Tilt max={16} scale={1.06} glare={false} className="rounded-full">
                  <Button asChild variant="outline" size="lg">
                    <a href="#contact">
                      Get in touch
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
                    </a>
                  </Button>
                </Tilt>
              </Magnetic>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
