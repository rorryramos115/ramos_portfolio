"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Github, X } from "lucide-react";

import { type Project } from "@/lib/data";

export function ProjectModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-white p-6 shadow-2xl dark:bg-card sm:p-8"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black/50 transition-all hover:bg-black/20 hover:text-black/80 dark:bg-white/10 dark:text-white/50 dark:hover:bg-white/20 dark:hover:text-white/90"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          <div
            className="relative h-60 w-full overflow-hidden rounded-lg sm:h-80"
            style={{
              background: `linear-gradient(155deg, hsl(${project.color} / 0.9), hsl(${project.color} / 0.55))`,
            }}
          >
            <Image
              src={project.image}
              alt={`${project.title} preview`}
              fill
              className="object-cover"
            />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-2xl sm:text-3xl">
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
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
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
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  Source code
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}