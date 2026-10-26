# Portfolio

A dark, cinematic, 3D portfolio built with Next.js 16 (App Router), React 19,
Tailwind CSS 4, React Three Fiber, GSAP, Lenis and Framer Motion.

Targets **Node.js 24** (`.nvmrc` is included) — the newest version Vercel supports. Newer local versions work too, with an engines warning.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Stack

- **Next.js 16** (Turbopack), React 19, TypeScript 6
- **Tailwind CSS 4** — tokens live in `@theme` inside `app/globals.css`
- **three + @react-three/fiber** — hero scene, lazy-loaded
- **GSAP + ScrollTrigger** — preloader, hero entrance, scroll reveals, scrubs
- **Lenis** — smooth scrolling, driven by GSAP's ticker
- **Framer Motion** — 3D tilt, magnetic buttons, carousel, modal, nav
- Fonts are self-hosted via `@fontsource-variable/*` (Space Grotesk, Inter, JetBrains Mono)

## Structure

```
app/
  layout.tsx            fonts, preloader, smooth scroll, 3D backdrop
  page.tsx              section order: Hero → About → Work → Certifications → Contact
  globals.css           design tokens, glass utilities, base styles
components/
  three/scene.tsx       the WebGL scene (core, rings, particles, adaptive DPR)
  three/scene-background.tsx   capability check + lazy loading + CSS fallback
  providers/smooth-scroll.tsx  Lenis + GSAP + pointer/scroll inputs for the scene
  preloader.tsx, tilt.tsx (Tilt, TiltLayer, Magnetic), reveal.tsx, section-heading.tsx
  navbar.tsx, hero.tsx, bento-about.tsx, project-carousel.tsx, project-modal.tsx,
  certifications.tsx, contact.tsx, footer.tsx
  ui/                   button, card, badge, input, textarea
lib/
  data.ts               project data
  gsap.ts, lenis.ts, motion-store.ts, use-app-ready.ts, utils.ts
```

## Performance & accessibility notes

- The 3D bundle is only fetched on capable desktops (fine pointer, ≥768px,
  WebGL2, ≥4 cores/4 GB, no `save-data`, no reduced motion) and only after the
  browser is idle. Everyone else gets a lightweight CSS orb instead.
- Pixel ratio is capped at 1.75 and drops automatically if frame rate sags.
- `prefers-reduced-motion`: no preloader animation, no Lenis, no GSAP reveals,
  no tilt/magnetic effects, no 3D scene, static counters and typewriter.
- Content is real DOM text (nothing is canvas-only), with a skip link, labelled
  landmarks, keyboard-operable carousel, and a focus-trapped modal.

## Editing content

- Hero / About / Certifications / Contact copy: the matching file in `components/`.
- Projects: the `projects` array in `lib/data.ts`.
- Accent colour: `--color-accent` in `app/globals.css` (plus `ACCENT` in
  `components/three/scene.tsx` for the 3D scene).
