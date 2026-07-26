---
tags: [ui, ux, rtl, accessibility]
---

# UI-UX Guidelines

Up: [[Sirat MOC]] · Tokens: [[Design System]]

## RTL & i18n — first-class, not an afterthought

Arabic/Urdu are `RTL_LANGUAGES` (`src/constants/languages.ts`). Logical CSS
properties (`ms-*`/`me-*`) not physical. Mixed Arabic+English content needs
deliberate per-block `dir`, not one page-level direction. Test with
`dir="rtl"` before calling a component done.

## Component conventions

See [[Folder Structure]] for `components/` vs `features/` split. Prefer
`cva` variants over prop-explosion.

## Forms

`react-hook-form` + `zod`. Map `AppError.fieldErrors` (see
[[Error Handling]]) back onto fields on submit failure.

## Motion

`framer-motion` for gesture/orchestration, `tw-animate-css` for simple
transitions. Respect `prefers-reduced-motion`.

## Accessibility

WCAG 2.1 AA baseline. Radix (via shadcn) gives correct semantics by
default — don't strip it. Color never the only signal.

## Content & tone

Hadith grading + source always visible. Respectful, measured copy — this
is a religious reference tool, not a casual consumer app.
