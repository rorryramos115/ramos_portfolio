"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

import { GithubIcon } from "@/components/brand-icons";
import { SafeImage } from "@/components/safe-image";
import { Tilt } from "@/components/tilt";
import { type Project } from "@/lib/data";
import { getLenis } from "@/lib/lenis";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const subscribeNoop = () => () => {};

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const isClient = React.useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const onCloseRef = React.useRef(onClose);

  React.useEffect(() => {
    onCloseRef.current = onClose;
  });

  const isOpen = project !== null;

  React.useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    getLenis()?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      getLenis()?.start();
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <div
          key={project.id}
          className="fixed inset-0 z-90 flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal container */}
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            data-lenis-prevent
            initial={{ opacity: 0, scale: 0.92, y: 40, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformPerspective: 1200 }}
            className="relative z-10 max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-[#0b0b11]/90 p-6 shadow-[0_40px_120px_-20px_rgb(0_0_0/0.9),0_0_0_1px_rgb(198_255_61/0.08)] backdrop-blur-2xl sm:p-8"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white/80 backdrop-blur transition-all hover:bg-accent hover:text-accent-foreground"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            <Tilt max={4} scale={1} glare={false} className="rounded-2xl">
              <div
                className="relative h-60 w-full overflow-hidden rounded-2xl sm:h-80"
                style={{
                  background: `linear-gradient(155deg, hsl(${project.color} / 0.9), hsl(${project.color} / 0.45))`,
                }}
              >
                <SafeImage
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  sizes="(min-width: 672px) 640px, 90vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              </div>
            </Tilt>

            <div className="mt-6">
              <div className="flex items-center justify-between gap-2">
                <h2
                  id="project-modal-title"
                  className="font-display text-2xl font-semibold sm:text-3xl"
                >
                  {project.title}
                </h2>
                <span className="font-mono text-sm text-muted-foreground">
                  {project.year}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-accent">
                {project.role}
              </p>

              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {project.highlights && project.highlights.length > 0 && (
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-accent">
                  {project.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground shadow-[0_10px_40px_-8px_rgb(198_255_61/0.55)] transition-shadow hover:shadow-[0_14px_60px_-6px_rgb(198_255_61/0.75)]"
                  >
                    Live site
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Source code
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
