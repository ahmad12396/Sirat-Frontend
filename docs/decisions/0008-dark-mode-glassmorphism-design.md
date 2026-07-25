# ADR-0008: Adopt dark-mode-default, glassmorphism-accented design system

**Status:** Accepted
**Date:** 2026-07-26

## Context

The initial design tokens in `src/app/globals.css` were shadcn's generated
neutral-gray placeholder (`baseColor: "neutral"`), light-theme-default,
with no chroma outside the destructive/chart tokens — flagged as
provisional in [design.md](../design.md) and
[docs/security](../security/README.md) was not involved, but
[design.md#color](../design.md#color) explicitly called it "provisional
until a real brand pass happens."

The confirmed product brief sets an explicit, non-negotiable visual bar:
the app must feel "premium" in the manner of Notion, Linear, Stripe, and
Arc Browser — dark mode as the default (light available via toggle),
glassmorphism accents, smooth micro-interactions, generous spacing — and
explicitly _not_ gaudy, childish, or color-overloaded.

## Decision

Replace the placeholder neutral palette with:

- **Dark mode as the default theme** (`DEFAULT_THEME` in
  `src/constants/theme.ts` changed from `THEMES.SYSTEM` to `THEMES.DARK`),
  light mode available via the existing theme toggle.
- **A single, restrained accent color** (not a multi-color palette) layered
  over near-black/near-white neutral surfaces — consistent with the
  Notion/Linear/Stripe reference points, which all use one confident accent
  against a mostly neutral surface, not multiple competing brand colors.
- **Glassmorphism surface tokens** (translucent background + backdrop blur
  - subtle border) added alongside the existing solid `card`/`popover`
    tokens, used for accent surfaces (e.g. modals, elevated panels), not
    applied indiscriminately to every surface.
- Both light and dark variants defined for every token, per the existing
  rule in [design.md#theming-rules](../design.md#theming-rules).

## Alternatives considered

- **Keep light-mode-default, add dark mode as secondary** — rejected; the
  product brief is explicit that dark is the default, not an equal
  alternative.
- **A colorful/vibrant palette** (multiple saturated brand colors) —
  rejected; conflicts directly with the "not gaudy, not overloaded with
  color" requirement and the Notion/Linear/Stripe reference aesthetic,
  which are all visually quiet outside one accent color.
- **Glassmorphism applied everywhere** (every card, every surface) —
  rejected; overuse of blur/translucency hurts both performance
  (backdrop-filter is expensive to composite) and legibility, especially
  for Arabic diacritics in Quran/hadith text. Reserved for accent
  surfaces only.

## Consequences

- `src/app/globals.css`'s `:root`/`.dark` token blocks are rewritten, not
  incrementally patched — every component using the existing
  `bg-background`/`text-foreground`/etc. utility classes picks up the new
  palette automatically, with no per-component changes needed.
- `docs/design.md` is updated to document the new tokens as the current
  (not provisional) system.
- Because the accent color is now real chroma instead of grayscale, every
  new UI surface must be checked for WCAG AA contrast in **both** themes —
  this is a stricter bar than the old grayscale-only palette, where
  contrast was largely a solved problem by default.
- Glassmorphism's `backdrop-filter: blur(...)` has a real rendering cost;
  per [rules.md#performance](../rules.md#performance--keep-the-app-fast),
  it should be reserved for a small number of elevated/accent surfaces per
  screen, not the default treatment for every card.
- This does not change anything about the Flutter mobile client's
  implementation (separate codebase), but the token _values_ (color,
  spacing, radius) are intended to be mirrored there — see
  [prd.md#1-product-overview](../prd.md#1-product-overview).
