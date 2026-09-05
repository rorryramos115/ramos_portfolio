"use client";

import * as React from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  animate,
} from "framer-motion";

import { cn } from "@/lib/utils";

type NumberOdometerProps = {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  /** delay in seconds before the count-up starts, useful for staggering multiple tiles */
  delay?: number;
};

export function NumberOdometer({
  value,
  suffix = "",
  prefix = "",
  duration = 1.4,
  className,
  delay = 0,
}: NumberOdometerProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const motionValue = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  useMotionValueEvent(motionValue, "change", (latest) => {
    setDisplay(Math.round(latest));
  });

  React.useEffect(() => {
    if (!isInView) return;

    const controls = animate(motionValue, value, {
      duration,
      delay,
      ease: [0.16, 1, 0.3, 1], // snappy start, gentle settle — reads like a real odometer easing to a stop
    });

    return () => controls.stop();
  }, [isInView, value, duration, delay, motionValue]);

  return (
    <motion.span
      ref={ref}
      className={cn("tabular-nums", className)}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {prefix}
      {display}
      {suffix}
    </motion.span>
  );
}