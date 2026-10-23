import type Lenis from "lenis";

// Tiny module-level handle so overlays (e.g. the project modal) can pause
// smooth scrolling without prop drilling.
let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}
