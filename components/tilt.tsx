"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

const TiltContext = React.createContext<{
  px: MotionValue<number>;
  py: MotionValue<number>;
} | null>(null);

type TiltProps = {
  children: React.ReactNode;
  /** Classes for the outer (static) wrapper — put layout + rounded-* here. */
  className?: string;
  /** Max rotation in degrees. */
  max?: number;
  scale?: number;
  glare?: boolean;
  perspective?: number;
  /** Keep the tree identical but ignore the pointer (e.g. inactive carousel cards). */
  disabled?: boolean;
};

/**
 * Pointer-driven 3D tilt with a moving specular glare.
 * The outer element is never transformed, so measurement stays stable.
 * Mouse only; touch and reduced-motion users get a plain, static element.
 */
export function Tilt({
  children,
  className,
  max = 8,
  scale = 1.02,
  glare = true,
  perspective = 1000,
  disabled = false,
}: TiltProps) {
  const reduce = useReducedMotion();
  const enabled = !reduce && !disabled;
  const ref = React.useRef<HTMLDivElement>(null);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const hover = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);
  const scaleSpring = useSpring(1, SPRING);
  const glareOpacity = useSpring(hover, { stiffness: 180, damping: 26 });

  const gx = useTransform(px, (v) => v * 100);
  const gy = useTransform(py, (v) => v * 100);
  const glareBg = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.14), transparent 60%)`;
  const edgeBg = useMotionTemplate`radial-gradient(260px circle at ${gx}% ${gy}%, rgb(198 255 61 / 0.5), transparent 70%)`;

  const ctx = React.useMemo(() => ({ px, py }), [px, py]);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }
  function onPointerEnter(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled || e.pointerType !== "mouse") return;
    scaleSpring.set(scale);
    hover.set(1);
  }
  function onPointerLeave() {
    px.set(0.5);
    py.set(0.5);
    scaleSpring.set(1);
    hover.set(0);
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{ perspective }}
      onPointerMove={onPointerMove}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <TiltContext.Provider value={ctx}>
        <motion.div
          className="relative h-full w-full rounded-[inherit] will-change-transform"
          style={{
            rotateX: enabled ? rotateX : 0,
            rotateY: enabled ? rotateY : 0,
            scale: enabled ? scaleSpring : 1,
            transformStyle: "preserve-3d",
          }}
        >
          {children}
          {enabled && glare && (
            <>
              {/* accent rim light that tracks the cursor */}
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit] p-px"
                style={{
                  opacity: glareOpacity,
                  background: edgeBg,
                  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                  maskComposite: "exclude",
                  WebkitMask:
                    "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
                }}
              />
              <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                style={{ opacity: glareOpacity, background: glareBg }}
              />
            </>
          )}
        </motion.div>
      </TiltContext.Provider>
    </div>
  );
}

/**
 * Parallax depth layer. Shifts opposite to the cursor inside a <Tilt>, giving
 * depth even when an ancestor flattens `preserve-3d` (e.g. overflow-hidden).
 */
export function TiltLayer({
  children,
  depth = 12,
  className,
}: {
  children: React.ReactNode;
  depth?: number;
  className?: string;
}) {
  const ctx = React.useContext(TiltContext);
  const fallback = useMotionValue(0.5);
  const reduce = useReducedMotion();

  const x = useSpring(
    useTransform(ctx?.px ?? fallback, [0, 1], [depth, -depth]),
    SPRING
  );
  const y = useSpring(
    useTransform(ctx?.py ?? fallback, [0, 1], [depth, -depth]),
    SPRING
  );

  return (
    <motion.div
      className={className}
      style={reduce || !ctx ? undefined : { x, y }}
    >
      {children}
    </motion.div>
  );
}

/** Pulls its child toward the cursor — pairs with <Tilt> on buttons. */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });
  const y = useSpring(0, { stiffness: 260, damping: 18, mass: 0.5 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      ref={ref}
      className={cn("inline-block", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
