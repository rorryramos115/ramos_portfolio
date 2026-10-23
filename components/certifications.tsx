"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";

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
    <section id="certifications" className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Certifications
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Courses and role certifications completed alongside the work.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.name}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="flex h-full flex-col overflow-hidden transition-colors hover:border-accent/40">
              <div className="relative aspect-[16/10] w-full bg-muted">
                <Image
                  src={cert.image}
                  alt={`${cert.name} certificate`}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight">
                    {cert.name}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {cert.year}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{cert.issuer}</p>
                <a
                  href={cert.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                >
                  View credential
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
