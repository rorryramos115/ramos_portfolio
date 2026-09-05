"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, Mail, Send, ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export function Contact() {
  return (
    <section id="contact" className="container py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="grid gap-8 lg:grid-cols-5 lg:items-start"
      >
        {/* Left side - Text */}
        <div className="lg:col-span-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open to opportunities
          </div>
          <h2 className="mt-4 font-display text-3xl tracking-tight sm:text-4xl">
            Let's talk
          </h2>
          <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have a project, a role, or just a question about how something
            was built? Feel free to reach out across any of these channels.
          </p>
          
          {/* Direct email CTA */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-medium text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <a
            href="mailto:rorryramos115@gmail.com"
            className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:bg-accent/90 hover:scale-[1.02]"
          >
            <Mail className="h-4 w-4" />
            Send me an email
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Right side - Social cards */}
        <div className="lg:col-span-2">
          <Card className="border-border bg-card/50 p-5 backdrop-blur-sm sm:p-6">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Connect with me
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <a
                href="https://github.com/rorryramos115"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-md border border-border px-3.5 py-2.5 text-sm font-medium transition-all hover:border-accent/40 hover:bg-accent/5 hover:shadow-sm"
              >
                <div className="rounded-md bg-muted/50 p-1.5 group-hover:bg-accent/10">
                  <Github className="h-4 w-4" />
                </div>
                <span className="flex-1">GitHub</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/rorry-ramos-11a2b2362/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-md border border-border px-3.5 py-2.5 text-sm font-medium transition-all hover:border-accent/40 hover:bg-accent/5 hover:shadow-sm"
              >
                <div className="rounded-md bg-muted/50 p-1.5 group-hover:bg-accent/10">
                  <Linkedin className="h-4 w-4" />
                </div>
                <span className="flex-1">LinkedIn</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="https://web.facebook.com/rorry.ramos.3/"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 rounded-md border border-border px-3.5 py-2.5 text-sm font-medium transition-all hover:border-accent/40 hover:bg-accent/5 hover:shadow-sm"
              >
                <div className="rounded-md bg-muted/50 p-1.5 group-hover:bg-accent/10">
                  <Facebook className="h-4 w-4" />
                </div>
                <span className="flex-1">Facebook</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="mailto:rorryramos115@gmail.com"
                className="group flex items-center gap-2.5 rounded-md border border-border px-3.5 py-2.5 text-sm font-medium transition-all hover:border-accent/40 hover:bg-accent/5 hover:shadow-sm"
              >
                <div className="rounded-md bg-muted/50 p-1.5 group-hover:bg-accent/10">
                  <Send className="h-4 w-4" />
                </div>
                <span className="flex-1">Email</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </Card>
        </div>
      </motion.div>
    </section>
  );
}