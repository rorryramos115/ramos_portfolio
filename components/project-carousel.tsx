"use client";

import * as React from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  animate,
  type PanInfo,
  type TapInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github } from "lucide-react";

import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";
import { ProjectModal } from "@/components/project-modal"; // <-- moved out

const GAP = 24;
const SWIPE_OFFSET_THRESHOLD = 60;
const SWIPE_VELOCITY_THRESHOLD = 400;
const CLICK_SUPPRESS_THRESHOLD = 8;
const SPRING = { type: "spring", stiffness: 300, damping: 30 } as const;

const TOTAL = projects.length;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function getOffset(index: number, activeIndex: number) {
  let diff = index - activeIndex;
  const half = Math.floor(TOTAL / 2);
  if (diff > half) diff -= TOTAL;
  if (diff < -half) diff += TOTAL;
  return diff;
}

export function ProjectCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const movedRef = React.useRef(false);

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(
    null
  );
  const [containerWidth, setContainerWidth] = React.useState(0);
  const [cardWidth, setCardWidth] = React.useState(0);
  const [cardHeight, setCardHeight] = React.useState(0);
  const [ready, setReady] = React.useState(false);

  const dragX = useMotionValue(0);
  const step = cardWidth + GAP;
  const baseOffset = (containerWidth - cardWidth) / 2;

  React.useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === container) {
          setContainerWidth(entry.contentRect.width);
        }
        if (entry.target === card) {
          setCardHeight(entry.contentRect.height);
          setCardWidth(entry.contentRect.width);
        }
      }
    });
    ro.observe(container);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (containerWidth && cardWidth) setReady(true);
  }, [containerWidth, cardWidth]);

  function goTo(index: number) {
    setActiveIndex(mod(index, TOTAL));
  }

  function handleCardTap(project: Project, index: number) {
    // onTap already resolves drag-vs-tap ambiguity for us,
    // movedRef is just a safety net for stray offset noise.
    if (movedRef.current) return;

    if (index === activeIndex) {
      setSelectedProject(project);
    } else {
      goTo(index);
    }
  }

  function handleDragStart() {
    movedRef.current = false;
  }

  function handleDrag(_: unknown, info: PanInfo) {
    if (Math.abs(info.offset.x) > CLICK_SUPPRESS_THRESHOLD) {
      movedRef.current = true;
    }
    dragX.set(clamp(info.offset.x, -cardWidth, cardWidth));
  }

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    if (
      offset.x < -SWIPE_OFFSET_THRESHOLD ||
      velocity.x < -SWIPE_VELOCITY_THRESHOLD
    ) {
      goTo(activeIndex + 1);
    } else if (
      offset.x > SWIPE_OFFSET_THRESHOLD ||
      velocity.x > SWIPE_VELOCITY_THRESHOLD
    ) {
      goTo(activeIndex - 1);
    }
    animate(dragX, 0, SPRING);
  }

  return (
    <section id="work" className="py-24 sm:py-32">
      <div className="container mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
            Selected work
          </h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            Drag, or click a project card to view full details.
          </p>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-border transition-colors hover:border-accent/50 hover:text-accent"
            aria-label="Previous project"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-border transition-colors hover:border-accent/50 hover:text-accent"
            aria-label="Next project"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <motion.div
        ref={containerRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onPointerDown={() => {
          movedRef.current = false; // reset before every gesture, tap or drag
        }}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        style={{
          height: cardHeight || undefined,
          opacity: ready ? 1 : 0,
          touchAction: "pan-y",
        }}
        className="relative cursor-grab overflow-hidden transition-opacity duration-300 active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        {projects.map((project, index) => {
          const offset = getOffset(index, activeIndex);
          const isActive = offset === 0;
          const targetX = baseOffset - offset * step;
          const truncatedDescription =
            project.description.length > 75
              ? `${project.description.slice(0, 75)}...`
              : project.description;

          return (
            <motion.div
              key={project.id}
              ref={index === 0 ? cardRef : undefined}
              onTap={(_, info: TapInfo) => {
                void info;
                handleCardTap(project, index);
              }}
              animate={{
                x: targetX,
                scale: isActive ? 1 : 0.9,
                opacity: isActive ? 1 : 0.45,
              }}
              transition={SPRING}
              style={{
                zIndex: isActive ? 30 : 20 - Math.abs(offset),
              }}
              className="absolute left-0 top-0 w-[78vw] cursor-pointer select-none sm:w-[400px]"
            >
              <div className="overflow-hidden rounded-md border border-border bg-card transition-colors hover:border-accent/40">
                <div
                  className="relative h-52 overflow-hidden sm:h-60"
                  style={{
                    background: `linear-gradient(155deg, hsl(${project.color} / 0.9), hsl(${project.color} / 0.55))`,
                  }}
                >
                  <Image
                    src={project.image}
                    alt={`${project.title} preview`}
                    fill
                    sizes="(min-width: 640px) 400px, 78vw"
                    className="object-cover"
                    draggable={false}
                    priority={index === 0}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span className="absolute bottom-3 right-4 font-display text-3xl text-background/80 sm:text-4xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl">{project.title}</h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.role}
                  </p>

                  <p className="mt-3 text-sm">
                    {truncatedDescription}{" "}
                    <span className="font-semibold text-accent hover:underline">
                      More
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                      >
                        Live site
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                      >
                        <Github className="h-3.5 w-3.5" />
                        Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="container mt-6 flex items-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.title}`}
            aria-current={index === activeIndex}
            className="-m-2 group cursor-pointer p-2"
          >
            <span
              className={cn(
                "block h-1.5 rounded-md bg-border transition-all group-hover:bg-muted-foreground",
                index === activeIndex && "w-8 bg-accent group-hover:bg-accent"
              )}
              style={{ width: index === activeIndex ? undefined : "1rem" }}
            />
          </button>
        ))}
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}