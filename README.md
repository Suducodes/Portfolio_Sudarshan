# Sudu — Cinematic Portfolio

A scroll-storytelling portfolio for **Sudarshan V.**, Biomedical Engineer — built in the
spirit of [paralleluniverse.com.ua](https://paralleluniverse.com.ua/en/): inertia scroll,
scroll-scrubbed reveals, atmospheric WebGL, editorial typography. Operating-theatre
precision meets deep-space ambition.

> _"A surgeon's precision with a dreamer's ambition — built by someone who ships real work."_

## The journey (one long, scrubbed scroll)

1. **Loader** — ECG flatline draws + a 0→100 counter, then the curtain lifts.
2. **Hero** — giant Zodiak-serif thesis over a live nebula + rotating wireframe portal.
3. **Manifesto** — the premise, lit word-by-word as you scroll through it.
4. **Tagline** — "This is not just engineering / it's a promise…" (outlined → filled type).
5. **Work** — a **pinned horizontal gallery** of 4 projects, each with a generative motif
   (ECG / biomechanics waves / molecular lattice / clinical scatter). Stacks vertically on mobile.
6. **Story** — the origin narrative + identity + mission.
7. **Recognition** — a vitals-trace timeline whose line draws as you scroll.
8. **Contact + Footer** — the call to reach out, credentials, links.

The whole page also **travels through colour** — the nebula shifts teal → violet → crimson
from top to bottom, ending on the "pulse" red at the contact.

## Stack

- **Vite + React 18**
- **Lenis** — inertia smooth scroll, wired into…
- **GSAP + ScrollTrigger** — pinning, scrubbing, the horizontal gallery, scroll-fill text
- **React Three Fiber + three.js** — the procedural nebula shader, starfield & portal mesh
  (lazy-loaded; never blocks first paint)
- **Framer Motion** — hero entrance & micro-interactions
- **Tailwind CSS** — design tokens & utilities
- **Fontshare** — Zodiak (display serif), Clash Display (project names), Satoshi (body)
- **WebAudio** — optional synthesized ambient drone + heartbeat (off by default)

**No external media assets.** Atmosphere, project visuals and the portal are all procedural.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # three.js is split into its own deferred chunk
npm run preview
```

> ⚠️ Editing `tailwind.config.js` while the dev server runs may not hot-reload the theme
> (fonts/colours). If custom fonts look like fallbacks, **restart `npm run dev`**.

## Design language

| Token | Value | Use |
|-------|-------|-----|
| `void` | `#070A0D` | background |
| `teal` | `#00E5C4` | accent / signal |
| `bone` | `#F0EDE6` | text |
| `crimson` | `#C1121F` | pulse / peak moments |
| `violet` `amber` | — | per-project + nebula travel |

## ⚠️ Before launch — fill in real details

- **`src/data/contact.js`** — email / LinkedIn / GitHub are **placeholders**. Swap them.
- `src/data/projects.js`, `src/data/timeline.js` — copy & milestones, edit freely.
- **Optional upgrade:** drop real project screenshots/renders into the `<Visual>` slot in
  `src/sections/Works.jsx` (currently procedural motifs), and a portrait into the Story section.

## Accessibility & performance

- `prefers-reduced-motion` respected — Lenis + the WebGL scene are skipped, replaced by a
  static backdrop and native scroll.
- Keyboard navigable; visible teal focus rings.
- Sound is **off by default**, opt-in only.
- three.js code-split & lazy; initial JS ~101 kB gzip.
