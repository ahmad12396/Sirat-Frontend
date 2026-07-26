---
tags: [adr, accepted]
---

# ADR 0003 — Tailwind v4 CSS Config

Up: [[Sirat MOC]] · Implements: [[Design System]]

**Decision:** no `tailwind.config.ts` — configure via `@theme`/`@import` in
`globals.css`, matching shadcn's generated output.

**Why:** v3-era convention required a JS config; v4's CSS-based approach
covers the same needs (theme tokens, content detection) without it.

**Consequence:** theme edits happen in CSS, not a `.ts` file. Revisit only
if a genuinely JS-only need arises (dynamic config, non-CSS-expressible
plugin).
