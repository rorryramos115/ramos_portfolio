"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NumberOdometer } from "@/components/number-odometer";

type Skill = {
  name: string;
  src: string;
};

const skills: Skill[] = [
  { name: "Next.js", src: "/logo/next-js.svg" },
  { name: "React", src: "/logo/react.svg" },
  { name: "TypeScript", src: "/logo/typescript-2.svg" },
  { name: "JavaScript", src: "/logo/javascript.svg" },
  { name: "Supabase", src: "/logo/supabase-icon.svg" },
  { name: "PHP", src: "/logo/php-icon.svg" },
  { name: "Tailwind CSS", src: "/logo/tailwind-css.svg" },
  { name: "Expo", src: "/logo/expo-go-app.svg" },
  { name: "HTML", src: "/logo/html.svg" },
];

function SkillIcon({ name, src }: Skill) {
  return (
    <div className="group flex w-28 flex-none flex-col items-center gap-2.5">
      <div className="relative flex h-14 w-14 items-center justify-center">
        {/* soft glow so dark-colored svgs stay visible in dark mode */}
        <div className="absolute inset-0 rounded-full bg-white/0 blur-md transition-colors dark:bg-white/10" />
        <Image
          src={src}
          alt={name}
          width={50}
          height={50}
          className={cn(
            "relative h-10 w-10 shrink-0 object-contain",
            "drop-shadow-[0_0_0_rgba(0,0,0,0)] dark:drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]",
            "transition-transform duration-300 group-hover:scale-110"
          )}
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{name}</span>
    </div>
  );
}

function SkillsMarquee() {
  // duplicate the row so the loop is seamless
  const loop = [...skills, ...skills];

  return (
    <div className="mt-20">
      <p className="mb-6 text-center text-base font-medium text-muted-foreground">
        Tools & technologies I work with
      </p>
      <div className="relative overflow-hidden">
        {/* edge fade so icons don't hard-cut at the container edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-skills-marquee gap-10 py-3 hover:[animation-play-state:paused]">
          {loop.map((skill, i) => (
            <SkillIcon key={`${skill.name}-${i}`} {...skill} />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes skills-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-skills-marquee {
          animation: skills-marquee 25s linear infinite;
        }
      `}</style>
    </div>
  );
}

function Tile({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "flex flex-col justify-between overflow-hidden p-5 transition-colors hover:border-accent/40",
        className
      )}
    >
      {children}
    </Card>
  );
}

export function BentoAbout() {
  return (
    <section id="about" className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          About
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Full-Stack Developer specializing in building high-performance web and
          mobile applications using React, Next.js, and Supabase. Experienced in
          crafting seamless user interfaces, designing scalable APIs, and
          delivering end-to-end products from conception to deployment. Driven to
          build reliable, user-centered software that solves real-world
          operational and user challenges at scale.
        </p>
      </motion.div>

      <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-1 gap-4 sm:grid-cols-4">
        <Tile className="sm:col-span-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Based in
          </div>
          <p className="font-display text-2xl">Alubijid, Misamis Oriental, PH</p>
          <p className="text-sm text-muted-foreground">
            GMT+8 · working async-friendly hours
          </p>
        </Tile>

        <Tile>
          <p className="text-sm text-muted-foreground">Years</p>
          <p className="font-display text-4xl">
            <NumberOdometer value={3} suffix="+" delay={0.1} />
          </p>
        </Tile>

        <Tile>
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="font-display text-4xl">
            <NumberOdometer value={51} delay={0.25} />
          </p>
        </Tile>
      </div>

      <SkillsMarquee />
    </section>
  );
}