"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";
import { pointer, scroll } from "@/lib/motion-store";

/**
 * Lenis smooth scrolling wired into GSAP's ticker + ScrollTrigger, and the
 * pointer/scroll inputs consumed by the 3D scene. Renders nothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const setup = () => {
      if (lenis || reduce.matches) return;
      lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.95,
        anchors: true,
        autoRaf: false,
      });
      setLenis(lenis);

      if (document.documentElement.dataset.loading === "true") lenis.stop();

      lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    const teardown = () => {
      if (tick) gsap.ticker.remove(tick);
      lenis?.destroy();
      lenis = null;
      tick = null;
      setLenis(null);
    };

    const onReduceChange = () => (reduce.matches ? teardown() : setup());
    const onReady = () => lenis?.start();

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight || 1;
      scroll.y = window.scrollY;
      scroll.progress = Math.min(1, Math.max(0, window.scrollY / max));
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onLoad = () => ScrollTrigger.refresh();

    setup();
    onScroll();
    reduce.addEventListener("change", onReduceChange);
    window.addEventListener("app:ready", onReady);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("load", onLoad);

    return () => {
      reduce.removeEventListener("change", onReduceChange);
      window.removeEventListener("app:ready", onReady);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("load", onLoad);
      teardown();
    };
  }, []);

  return null;
}
