"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  animate,
  type PanInfo,
} from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

import { GithubIcon } from "@/components/brand-icons";
import { ProjectModal } from "@/components/project-modal";
import { Reveal } from "@/components/reveal";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { Magnetic, Tilt, TiltLayer } from "@/components/tilt";
import { projects, type Project } from "@/lib/data";
import { cn } from "@/lib/utils";

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
  const reduce = useReducedMotion();
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
  const ready = containerWidth > 0 && cardWidth > 0;

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

  function goTo(index: number) {
    setActiveIndex(mod(index, TOTAL));
  }

  function activate(project: Project, index: number) {
    if (index === activeIndex) {
      setSelectedProject(project);
    } else {
      goTo(index);
    }
  }

  function handleCardTap(
    event: MouseEvent | TouchEvent | PointerEvent,
    project: Project,
    index: number
  ) {
    // Links inside the card handle themselves.
    if ((event.target as HTMLElement | null)?.closest("a")) return;
    // onTap already resolves drag-vs-tap ambiguity for us,
    // movedRef is just a safety net for stray offset noise.
    if (movedRef.current) return;
    activate(project, index);
  }

  function handleCardKeyDown(
    e: React.KeyboardEvent,
    project: Project,
    index: number
  ) {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(project, index);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(activeIndex + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(activeIndex - 1);
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

  const arrowClass =
    "glass flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-300 hover:border-accent/50 hover:text-accent";

  return (
    <section id="work" className="py-28 sm:py-40">
      <div className="container mb-14 flex items-end justify-between gap-4">
        <SectionHeading index="02" title="Selected work">
          <p className="mt-6 max-w-md text-muted-foreground">
            Drag, or click a project card to view full details.
          </p>
        </SectionHeading>
        <div className="hidden gap-3 sm:flex">
          <Magnetic>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              className={arrowClass}
              aria-label="Previous project"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          </Magnetic>
          <Magnetic>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              className={arrowClass}
              aria-label="Next project"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </Magnetic>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        Project {activeIndex + 1} of {TOTAL}: {projects[activeIndex].title}
      </p>

      <Reveal y={70}>
        <motion.div
          ref={containerRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Selected projects"
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
            height: cardHeight ? cardHeight + 24 : undefined,
            opacity: ready ? 1 : 0,
            touchAction: "pan-y",
          }}
          className="relative cursor-grab overflow-hidden py-3 transition-opacity duration-500 active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
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
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${TOTAL}: ${project.title}`}
                tabIndex={0}
                onKeyDown={(e) => handleCardKeyDown(e, project, index)}
                onTap={(event) => handleCardTap(event, project, index)}
                animate={{
                  x: targetX,
                  scale: isActive ? 1 : 0.88,
                  opacity: isActive ? 1 : 0.4,
                  rotateY: reduce ? 0 : clamp(offset, -2, 2) * -16,
                }}
                transition={SPRING}
                style={{
                  zIndex: isActive ? 30 : 20 - Math.abs(offset),
                  top: 12,
                  transformPerspective: 1400,
                }}
                className="absolute left-0 w-[78vw] cursor-pointer select-none sm:w-[400px]"
              >
                <Tilt
                  max={6}
                  scale={1.01}
                  perspective={1100}
                  disabled={!isActive}
                  className="rounded-3xl"
                >
                  <div
                    className={cn(
                      "glass overflow-hidden rounded-3xl transition-[border-color,box-shadow] duration-500",
                      isActive &&
                        "border-accent/30 shadow-[0_30px_80px_-30px_rgb(198_255_61/0.35)]"
                    )}
                  >
                    <div
                      className="relative h-52 overflow-hidden sm:h-60"
                      style={{
                        background: `linear-gradient(155deg, hsl(${project.color} / 0.9), hsl(${project.color} / 0.45))`,
                      }}
                    >
                      <TiltLayer depth={10} className="absolute -inset-4">
                        <SafeImage
                          src={project.image}
                          alt={`${project.title} preview`}
                          fill
                          sizes="(min-width: 640px) 430px, 85vw"
                          className="object-cover"
                          draggable={false}
                          priority={index === 0}
                        />
                      </TiltLayer>
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                      <span
                        aria-hidden
                        className="absolute right-4 bottom-3 font-display text-4xl font-semibold text-white/85 sm:text-5xl"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-xl font-medium">
                          {project.title}
                        </h3>
                        <span className="font-mono text-xs text-muted-foreground">
                          {project.year}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {project.role}
                      </p>

                      <p className="mt-3 text-sm text-foreground/90">
                        {truncatedDescription}{" "}
                        <span className="font-semibold text-accent hover:underline">
                          More
                        </span>
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground"
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
                            tabIndex={isActive ? 0 : -1}
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
                            tabIndex={isActive ? 0 : -1}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
                          >
                            <GithubIcon className="h-3.5 w-3.5" />
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </motion.div>
      </Reveal>

      <div className="container mt-8 flex items-center gap-2">
        {projects.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to ${project.title}`}
            aria-current={index === activeIndex}
            className="group -m-2 cursor-pointer p-2"
          >
            <span
              className={cn(
                "block h-1.5 rounded-full bg-white/15 transition-all duration-500 group-hover:bg-white/30",
                index === activeIndex
                  ? "w-10 bg-accent group-hover:bg-accent"
                  : "w-4"
              )}
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
