"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";

// Exact center coordinates for the Cagayan de Oro College campus
const CARMEN_COC_LAT = 8.4820;
const CARMEN_COC_LNG = 124.6361;

// Slightly wider bounding box to zoom out a little
const DELTA = 0.0022;
const BBOX = [
  CARMEN_COC_LNG - DELTA,
  CARMEN_COC_LAT - DELTA,
  CARMEN_COC_LNG + DELTA,
  CARMEN_COC_LAT + DELTA,
].join("%2C");

const MAP_EMBED_URL = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${CARMEN_COC_LAT}%2C${CARMEN_COC_LNG}`;

function SchoolMap() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border shadow-sm">
      <iframe
        title="Map of PHINMA Cagayan de Oro College - Carmen Campus"
        src={MAP_EMBED_URL}
        className="h-full w-full grayscale-[15%] transition-all duration-300 hover:grayscale-0"
        loading="lazy"
      />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/50" />
      <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md border border-border bg-card/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        Carmen Campus · Cagayan de Oro
      </span>
    </div>
  );
}

export function Education() {
  return (
    <section id="education" className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h2 className="font-display text-3xl tracking-tight sm:text-4xl">
          Education
        </h2>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
          Where it started — and where I&apos;m still learning.
        </p>
      </motion.div>

      <div className="grid items-center gap-10 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            Currently studying
          </div>
          <p className="font-display text-2xl">
            BS Information Technology
          </p>
          <p className="text-sm text-muted-foreground">
            PHINMA Cagayan de Oro College (Carmen Campus)
          </p>
          <div className="mt-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <MapPin className="h-4 w-4" />
            Carmen, Cagayan de Oro City, Philippines
          </div>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
            4th year, focused on full-stack web development — building
            practical projects alongside coursework to get hands-on
            experience with the tools I&apos;ll be using professionally.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="relative mx-auto aspect-square w-full max-w-[420px]"
        >
          <SchoolMap />
        </motion.div>
      </div>
    </section>
  );
}