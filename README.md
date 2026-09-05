# Portfolio

Next.js 14 (App Router) + Tailwind + shadcn/ui conventions + Framer Motion.

## Stack

- **Next.js 14**, App Router, TypeScript
- **Tailwind CSS**, with shadcn/ui's CSS-variable theming (`components.json` is
  already configured, so `npx shadcn@latest add <component>` will drop
  further components straight into `components/ui`)
- **Framer Motion** for the hero entrance, theme toggle, and the project
  carousel
- **next-themes** for light/dark mode (respects system preference, no flash)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Structure

```
app/
  layout.tsx        fonts, ThemeProvider
  page.tsx           assembles the sections
  globals.css         design tokens (light + dark HSL variables)
components/
  navbar.tsx, hero.tsx, bento-about.tsx, project-carousel.tsx, contact.tsx, footer.tsx
  theme-provider.tsx, theme-toggle.tsx
  ui/                 button, card, badge, input, textarea (shadcn-style)
lib/
  data.ts             project data for the carousel
  utils.ts            cn() helper
```

## Notes

- **Content**: swap the copy in `components/hero.tsx`, `components/bento-about.tsx`,
  and the `projects` array in `lib/data.ts` for your own.
- **Project carousel** (`components/project-carousel.tsx`): the active card
  sits centered at full size/opacity, neighbors peek at reduced scale/opacity.
  Navigate by dragging, the arrow buttons, or the dot indicators — it never
  advances on its own. Card covers use a CSS gradient keyed off each
  project's `color` value in `lib/data.ts`; swap in real screenshots by
  replacing that block with an `<Image />`.
- **Contact form** currently just confirms locally on submit — wire
  `handleSubmit` in `components/contact.tsx` up to your handler of choice
  (a Next.js route handler, Resend, Formspree, etc).
- **Colors/type**: everything routes through the CSS variables in
  `app/globals.css` (paper/ink background + a single ochre accent) and the
  three font variables set in `app/layout.tsx` (Fraunces for display type,
  Inter for body, JetBrains Mono for tags/meta). Change the HSL values or
  fonts there to re-theme the whole site.
