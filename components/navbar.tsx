"use client";

import * as React from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { Menu, X } from "lucide-react";

import { useAppReady } from "@/lib/use-app-ready";
import { cn } from "@/lib/utils";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#certifications", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const reduce = useReducedMotion();
  const ready = useAppReady();
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState("home");
  const [scrolled, setScrolled] = React.useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Scroll-spy
  React.useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => !!el);

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Close the mobile menu with Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <motion.header
      initial={reduce ? false : { y: -90, opacity: 0 }}
      animate={reduce || ready ? { y: 0, opacity: 1 } : { y: -90, opacity: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-3 z-50 px-3 sm:top-5 sm:px-5"
    >
      <div className="mx-auto max-w-4xl">
        <div
          className={cn(
            "glass relative flex h-14 items-center justify-between rounded-full pr-2 pl-5 transition-[background-color,box-shadow] duration-500",
            scrolled && "bg-background/60 shadow-2xl shadow-black/50"
          )}
        >
          <Link
            href="#home"
            className="flex items-center gap-2 font-display text-base font-semibold tracking-tight"
          >
            <span
              aria-hidden
              className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgb(198_255_61/0.7)]"
            />
            Rorry Ramos
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 text-sm md:flex"
          >
            {links.map((link) => {
              const isActive = active === link.href.slice(1);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 transition-colors duration-300",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      aria-hidden
                      className="absolute inset-0 rounded-full bg-white/10"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/10 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* scroll progress hairline */}
          <motion.div
            aria-hidden
            className="absolute inset-x-6 bottom-0 h-px origin-left bg-accent"
            style={{ scaleX: reduce ? scrollYProgress : progress }}
          />
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              aria-label="Mobile"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-dense mt-2 flex flex-col rounded-3xl p-2 md:hidden"
            >
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={
                    active === link.href.slice(1) ? "location" : undefined
                  }
                  className={cn(
                    "rounded-2xl px-4 py-3 text-base transition-colors",
                    active === link.href.slice(1)
                      ? "bg-white/10 text-foreground"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
