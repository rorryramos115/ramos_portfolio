/**
 * Mutable, non-reactive input state shared with the WebGL scene.
 * Read inside `useFrame` — never trigger React renders from here.
 */
export const pointer = { x: 0, y: 0 }; // normalised -1..1 (y up)
export const scroll = { y: 0, progress: 0 }; // progress 0..1 across the page
