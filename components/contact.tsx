"use client";

import * as React from "react";
import { Mail, Send, ArrowUpRight } from "lucide-react";

import {
  FacebookIcon,
  GithubIcon,
  LinkedinIcon,
} from "@/components/brand-icons";
import { Reveal } from "@/components/reveal";
import { Magnetic, Tilt } from "@/components/tilt";
import { Card } from "@/components/ui/card";
import { gsap, useGSAP } from "@/lib/gsap";

const socials = [
  {
    label: "GitHub",
    href: "https://github.com/rorryramos115",
    Icon: GithubIcon,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/rorry-ramos-11a2b2362/",
    Icon: LinkedinIcon,
    external: true,
  },
  {
    label: "Facebook",
    href: "https://web.facebook.com/rorry.ramos.3/",
    Icon: FacebookIcon,
    external: true,
  },
  {
    label: "Email",
    href: "mailto:rorryramos115@gmail.com",
    Icon: Send,
    external: false,
  },
];

export function Contact() {
  const root = React.useRef<HTMLElement>(null);

  // Scroll-scrubbed headline: slides in from the side as the section arrives.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-contact-title]",
          { xPercent: -8, opacity: 0.2 },
          {
            xPercent: 0,
            opacity: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root.current,
              start: "top 85%",
              end: "top 30%",
              scrub: true,
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: root }
  );

  return (
    <section
      id="contact"
      ref={root}
      className="container py-28 sm:py-40"
    >
      <Reveal className="grid gap-12 lg:grid-cols-5 lg:items-start">
        {/* Left side - Text */}
        <div className="lg:col-span-3">
          <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            Open to opportunities
          </div>
          <h2
            data-contact-title
            className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] leading-none font-semibold tracking-tighter"
          >
            <span className="text-gradient">{"Let's talk"}</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Have a project, a role, or just a question about how something
            was built? Feel free to reach out across any of these channels.
          </p>

          {/* Direct email CTA */}
          <div className="mt-8 flex max-w-lg items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-medium text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <Magnetic className="mt-6" strength={0.35}>
            <Tilt max={14} scale={1.06} glare={false} className="rounded-full">
              <a
                href="mailto:rorryramos115@gmail.com"
                className="group/btn inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground shadow-[0_0_0_1px_rgb(198_255_61/0.5),0_10px_40px_-8px_rgb(198_255_61/0.55)] transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgb(198_255_61/0.8),0_14px_60px_-6px_rgb(198_255_61/0.75)]"
              >
                <Mail className="h-4 w-4" />
                Send me an email
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </a>
            </Tilt>
          </Magnetic>
        </div>

        {/* Right side - Social cards */}
        <div className="lg:col-span-2">
          <Tilt max={6} scale={1.015} className="rounded-3xl">
            <Card className="p-6 sm:p-7">
              <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                Connect with me
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {socials.map(({ label, href, Icon, external }) => (
                  <a
                    key={label}
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="group flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/3 px-3.5 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent/8"
                  >
                    <div className="rounded-xl bg-white/6 p-1.5 transition-colors group-hover:bg-accent/15 group-hover:text-accent">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{label}</span>
                    <ArrowUpRight className="h-3 w-3 text-muted-foreground/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                ))}
              </div>
            </Card>
          </Tilt>
        </div>
      </Reveal>
    </section>
  );
}
