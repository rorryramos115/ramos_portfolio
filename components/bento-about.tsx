"use client";

import { MapPin } from "lucide-react";

import { NumberOdometer } from "@/components/number-odometer";
import { Reveal } from "@/components/reveal";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { Tilt, TiltLayer } from "@/components/tilt";
import { cn } from "@/lib/utils";

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
    <div className="group flex w-28 flex-none flex-col items-center gap-3">
      <div className="glass relative flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5 group-hover:scale-110 group-hover:border-accent/40">
        {/* soft light behind the glyph so dark-coloured svgs stay visible */}
        <div className="absolute inset-2 rounded-xl bg-white/10 blur-md" />
        <SafeImage
          src={src}
          alt={name}
          width={50}
          height={50}
          className="relative h-9 w-9 shrink-0 object-contain drop-shadow-[0_0_6px_rgba(255,255,255,0.35)]"
          fallback={
            <span
              aria-hidden
              className="relative font-display text-xl font-semibold text-accent"
            >
              {name.charAt(0)}
            </span>
          }
        />
      </div>
      <span className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
        {name}
      </span>
    </div>
  );
}

function SkillsMarquee() {
  return (
    <div className="mt-24">
      <p className="mb-8 text-center text-base font-medium text-muted-foreground">
        Tools & technologies I work with
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-10 py-3 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:w-full motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:justify-center">
          {skills.map((skill) => (
            <SkillIcon key={skill.name} {...skill} />
          ))}
          {/* duplicate row for a seamless loop; hidden from AT and when motion is reduced */}
          <div
            aria-hidden
            className="flex gap-10 motion-reduce:hidden"
          >
            {skills.map((skill) => (
              <SkillIcon key={`dup-${skill.name}`} {...skill} />
            ))}
          </div>
        </div>
      </div>
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
    <Tilt max={7} scale={1.025} className={cn("rounded-3xl", className)}>
      <div className="glass flex h-full min-h-40 flex-col justify-between overflow-hidden rounded-3xl p-6 transition-colors duration-300 hover:border-accent/30">
        <TiltLayer depth={8} className="flex h-full flex-col justify-between gap-6">
          {children}
        </TiltLayer>
      </div>
    </Tilt>
  );
}

export function BentoAbout() {
  return (
    <section id="about" className="container py-28 sm:py-40">
      <SectionHeading index="01" title="About" className="mb-14">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Full-Stack Developer specializing in building high-performance web and
          mobile applications using React, Next.js, and Supabase. Experienced in
          crafting seamless user interfaces, designing scalable APIs, and
          delivering end-to-end products from conception to deployment. Driven to
          build reliable, user-centered software that solves real-world
          operational and user challenges at scale.
        </p>
      </SectionHeading>

      <Reveal
        stagger={0.12}
        className="grid auto-rows-[minmax(160px,auto)] grid-cols-1 gap-5 sm:grid-cols-4"
      >
        <Tile className="sm:col-span-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" />
            Based in
          </div>
          <p className="font-display text-2xl font-medium">
            Alubijid, Misamis Oriental, PH
          </p>
          <p className="text-sm text-muted-foreground">
            GMT+8 · working async-friendly hours
          </p>
        </Tile>

        <Tile>
          <p className="text-sm text-muted-foreground">Years</p>
          <p className="text-gradient-accent font-display text-6xl font-semibold">
            <NumberOdometer value={3} suffix="+" delay={0.1} />
          </p>
        </Tile>

        <Tile>
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-gradient-accent font-display text-6xl font-semibold">
            <NumberOdometer value={51} delay={0.25} />
          </p>
        </Tile>
      </Reveal>

      <Reveal>
        <SkillsMarquee />
      </Reveal>
    </section>
  );
}
