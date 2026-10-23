"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

// The whole three.js / R3F bundle is split out and only fetched on capable devices.
const Scene = dynamic(() => import("./scene").then((m) => m.Scene), {
  ssr: false,
});

type Mode = "pending" | "3d" | "fallback";

const QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(min-width: 768px)",
  "(pointer: fine)",
];

let webglSupport: boolean | undefined;
function hasWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = !!(
        window.WebGL2RenderingContext && canvas.getContext("webgl2")
      );
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

function subscribe(onChange: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((l) => l.addEventListener("change", onChange));
  return () => lists.forEach((l) => l.removeEventListener("change", onChange));
}

function getMode(): Mode {
  const [reduce, wide, fine] = QUERIES.map((q) => window.matchMedia(q).matches);
  if (reduce || !wide || !fine) return "fallback";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  if (nav.connection?.saveData) return "fallback";
  if ((nav.deviceMemory ?? 8) < 4) return "fallback";
  if ((navigator.hardwareConcurrency ?? 8) < 4) return "fallback";

  return hasWebGL() ? "3d" : "fallback";
}

/**
 * Fixed full-page backdrop. A CSS orb is always rendered (SSR-safe, zero JS
 * cost) and doubles as the lightweight fallback for mobile, reduced-motion,
 * save-data and no-WebGL users. On capable desktops the WebGL scene is
 * lazy-loaded after idle and cross-fades over it.
 */
export function SceneBackground() {
  const mode = useSyncExternalStore<Mode>(subscribe, getMode, () => "pending");
  const [idle, setIdle] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mode !== "3d") return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback && w.cancelIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2500 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setIdle(true), 1200);
    return () => window.clearTimeout(id);
  }, [mode]);

  const show3d = mode === "3d" && idle;

  return (
    <div aria-hidden className="pointer-events-none">
      <div
        className={cn(
          "orb-layer transition-opacity duration-1000",
          show3d && ready ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="orb animate-orb-float">
          <div className="orb-ring" />
        </div>
      </div>

      {show3d && (
        <div
          className={cn(
            "fixed inset-0 z-0 transition-opacity duration-1000",
            ready ? "opacity-100" : "opacity-0"
          )}
        >
          <Scene onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
