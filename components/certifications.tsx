"use client";

import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SafeImage } from "@/components/safe-image";
import { SectionHeading } from "@/components/section-heading";
import { Tilt, TiltLayer } from "@/components/tilt";

const certifications = [
  {
    name: "Frontend Developer (React)",
    issuer: "HackerRank",
    year: "2026",
    href: "https://www.hackerrank.com/certificates/e9f20f9913fb",
    image: "/certifacate/Screenshot 2026-10-23 210232.png",
  },
  {
    name: "Prompt Engineering",
    issuer: "FreeAcademy.ai",
    year: "2026",
    href: "https://freeacademy.ai/verify/FA-2026-PE-J0TM4C",
    image: "/certifacate/Screenshot 2026-10-23 210401.png",
  },
  {
    name: "SQL and Relational Databases 101",
    issuer: "Cognitive Class",
    year: "2026",
    href: "https://courses.cognitiveclass.ai/certificates/d21a47905fd342e7abd59b940934595c",
    image: "/certifacate/Screenshot 2026-10-23 210531.png",
  },
];

export function Certifications() {
  return (
    <section id="certifications" className="container py-28 sm:py-40">
      <SectionHeading index="03" title="Certifications" className="mb-14">
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Courses and role certifications completed alongside the work.
        </p>
      </SectionHeading>

      <Reveal stagger={0.14} className="grid gap-6 sm:grid-cols-3">
        {certifications.map((cert) => (
          <Tilt
            key={cert.name}
            max={9}
            scale={1.03}
            className="h-full rounded-3xl"
          >
            <div className="glass flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-300 hover:border-accent/30">
              <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
                <TiltLayer depth={9} className="absolute -inset-3">
                  <SafeImage
                    src={cert.image}
                    alt={`${cert.name} certificate`}
                    fill
                    className="object-cover object-top"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                </TiltLayer>
                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight font-medium">
                    {cert.name}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {cert.year}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {cert.issuer}
                </p>
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group/link mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  View credential
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
              </div>
            </div>
          </Tilt>
        ))}
      </Reveal>
    </section>
  );
}
