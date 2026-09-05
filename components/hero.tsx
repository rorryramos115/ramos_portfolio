"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, TerminalSquare } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const line = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

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
  const [display, setDisplay] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting" | "pausing">(
    "typing"
  );

  useEffect(() => {
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
  }, [display, phase, text, typingSpeed, deletingSpeed, holdMs, pauseMs]);

  const [head, ...rest] = text.split(" · ");
  const tail = rest.join(" · ");
  const tailShown = display.slice(head.length);
  const headShown = display.slice(0, head.length);

  return (
    <span className={className} aria-label={text}>
      <span className="text-accent">{headShown}</span>
      <span className="text-muted-foreground/70">
        {tailShown.startsWith(" ·") ? " ·" : tailShown.slice(0, 3)}
      </span>
      <span className="text-foreground/80">
        {tailShown.startsWith(" · ") ? tailShown.slice(3) : ""}
      </span>
      <motion.span
        aria-hidden
        className="ml-0.5 inline-block w-[1px] bg-current align-middle"
        style={{ height: "0.9em" }}
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
      />
    </span>
  );
}

export function Hero() {
  return (
    <section id="" className="flex min-h-screen items-center">
      <div className="container">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-center">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.p
              variants={line}
              className="mb-5 inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1 font-mono text-xs text-muted-foreground"
            >
              <TerminalSquare className="h-3.5 w-3.5 text-accent" />
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Open to new work — Sept 2026
            </motion.p>

            <motion.h1
              variants={line}
              className="flex flex-wrap items-baseline gap-x-3 font-display text-balance text-[2.75rem] leading-[1.05] tracking-tight sm:text-6xl md:text-[4.75rem]"
            >
              Rorry A. Ramos
            </motion.h1>

            <motion.p
              variants={line}
              className="mt-3 font-mono text-sm text-muted-foreground/80 sm:text-base"
            >
              Full-stack developer, PH
            </motion.p>

            <motion.p
              variants={line}
              className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              Building responsive, high-performance web and mobile applications. 
              Specializing in React, Next.js, TypeScript, and modern backend architectures 
              to turn complex problems into clean, scalable software.
            </motion.p>

            <motion.p
              variants={line}
              className="mt-6 font-mono text-sm text-muted-foreground sm:text-base"
            >
              <span className="text-accent/80">$ </span>
              <TypewriterLoop text="BSIT · rorryramos155@gmail.com" />
            </motion.p>

            <motion.div variants={line} className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="accent" size="lg" className="rounded-md">
                <a href="#work">
                  View selected work
                  <ArrowDownRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-md">
                <a href="#contact">
                  Get in touch
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Column: Bisaya Java Code Terminal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="hidden w-[440px] shrink-0 sm:block"
          >
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                  DeveloperLife.java
                </span>
                <div className="w-10" />
              </div>

              {/* Terminal Code Body */}
              <div className="p-4 font-mono text-[12px] leading-relaxed text-foreground/90">
                <p>
                  <span className="text-purple-400">public class</span>{" "}
                  <span className="text-yellow-300">DeveloperLife</span> &#123;
                </p>
                <p className="pl-4">
                  <span className="text-purple-400">public static void</span>{" "}
                  <span className="text-blue-400">main</span>(String[] args) &#123;
                </p>
                <p className="pl-8 text-muted-foreground/60">// Debugging ritual</p>
                <p className="pl-8">
                  <span className="text-purple-400">boolean</span> naayBug ={" "}
                  <span className="text-orange-400">true</span>;
                </p>
                <p className="pl-8">
                  <span className="text-purple-400">int</span> kapeCount ={" "}
                  <span className="text-orange-400">0</span>;
                </p>
                <br />
                <p className="pl-8">
                  <span className="text-purple-400">while</span> (naayBug) &#123;
                </p>
                <p className="pl-12">kapeCount++;</p>
                <p className="pl-12">
                  System.out.println(<span className="text-emerald-400">&quot;Ayaw kol!&quot;</span>);
                </p>
                <p className="pl-12">
                  <span className="text-purple-400">if</span> (kapeCount &gt;{" "}
                  <span className="text-orange-400">5</span>) &#123;
                </p>
                <p className="pl-16 text-emerald-400">
                  // Katulog na, ugma na sad!
                </p>
                <p className="pl-16">
                  <span className="text-purple-400">break</span>;
                </p>
                <p className="pl-12">&#125;</p>
                <p className="pl-8">&#125;</p>
                <p className="pl-4">&#125;</p>
                <p>&#125;</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}