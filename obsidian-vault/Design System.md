---
tags: [design, ui, tokens]
---

# Design System

Up: [[Sirat MOC]] · Decision: [[ADR 0008 - Dark Mode Glassmorphism Design]] · Usage rules: [[UI-UX Guidelines]]

Tokens live in `src/app/globals.css` (Tailwind v4, CSS-based — see
[[ADR 0003 - Tailwind v4 CSS Config]]).

## Color

Dark-mode-default. Single restrained accent (muted teal/emerald, hue≈165) —
not a multi-color brand palette, matching Notion/Linear/Stripe. Every token
has both `:root` (light) and `.dark` variants. **Contrast not yet
independently WCAG-verified** — known gap.

## Glassmorphism

`.glass` utility (`glass-bg`/`glass-border`/`--blur-glass`). Use sparingly —
accent surfaces only (modals, floating panels, top nav), not every card.
Real compositing cost + hurts Arabic diacritic legibility if overused.

## Typography

`--font-sans` (Geist) for UI/Latin text. **Arabic Quran typography not yet
configured** — needs a proper Uthmanic/Amiri-style font as its own
`--font-quran` token before [[Phases#Phase 2|Phase 2 (Quran Reader)]] ships.

## Spacing & Radius

Tailwind defaults; radius scale derived from one `--radius` base.

## Iconography

`lucide-react` exclusively — see [[Rules]].

## Theming

`next-themes`, default `THEMES.DARK` (`src/constants/theme.ts`). Every
component must be checked in both themes.
