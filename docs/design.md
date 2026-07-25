# Design System

The living reference for visual tokens: color, typography, spacing,
radius, and iconography. Tokens are defined once in
`src/app/globals.css` (Tailwind v4, CSS-based — see
[ADR-0003](./decisions/0003-tailwind-v4-css-config.md)) and consumed via
Tailwind utility classes everywhere else. **Don't hardcode a raw color or
pixel value in a component when a token below already covers it.**

- [Color](#color)
- [Glassmorphism](#glassmorphism)
- [Typography](#typography)
- [Spacing & Radius](#spacing--radius)
- [Iconography](#iconography)
- [Elevation & Effects](#elevation--effects)
- [Theming Rules](#theming-rules)
- [RTL Notes](#rtl-notes)

---

## Color

Dark-mode-default, single-accent palette — see
[ADR-0008](./decisions/0008-dark-mode-glassmorphism-design.md) for why
this replaced the earlier shadcn grayscale placeholder. **Dark is the
default theme** (`DEFAULT_THEME` in `src/constants/theme.ts`); light mode
is a fully-specified alternative, not an afterthought.

| Token                                     | Role                                                                         |
| ----------------------------------------- | ---------------------------------------------------------------------------- |
| `background` / `foreground`               | Page background / default text                                               |
| `card` / `card-foreground`                | Card surfaces                                                                |
| `popover` / `popover-foreground`          | Popovers, dropdowns, tooltips                                                |
| `primary` / `primary-foreground`          | Primary actions (buttons, links) — the one accent color                      |
| `secondary` / `secondary-foreground`      | Secondary actions                                                            |
| `muted` / `muted-foreground`              | De-emphasized text/surfaces                                                  |
| `accent` / `accent-foreground`            | Hover/highlight states (accent-tinted)                                       |
| `destructive`                             | Errors, delete/destructive actions                                           |
| `border` / `input` / `ring`               | Borders, input outlines, focus rings                                         |
| `sidebar*`                                | Sidebar-specific surface/text/accent tokens                                  |
| `chart-1` … `chart-5`                     | Data visualization — an analogous ramp off the accent hue                    |
| `glass` / `glass-border` / `--blur-glass` | Translucent, blurred surface treatment — see [Glassmorphism](#glassmorphism) |

All tokens are `oklch(...)` values with both a `:root` (light) and `.dark`
variant — **every new token added here needs both.** The accent hue is a
muted teal/emerald (`hue ≈ 165`) — deliberately a single confident color,
not a multi-color brand palette, matching the Notion/Linear/Stripe
reference points from the product brief.

> **Contrast is not yet independently verified.** The accent lightness
> values were chosen to look right, not measured against WCAG AA — before
> this ships broadly, run an actual contrast check for `primary`/`accent`
> against their `-foreground` pairs in both themes (see
> [ui-ux/README.md#accessibility](./ui-ux/README.md#accessibility)) and
> adjust lightness/chroma if anything fails.

Do not introduce a color outside this token set for a one-off need
(a component-specific hex/oklch value) — add a token instead, so a future
theme change updates every usage at once.

## Glassmorphism

A `.glass` utility class (defined in `globals.css`'s `@layer utilities`)
applies the translucent-surface treatment: `background: var(--glass-bg)`,
a subtle `var(--glass-border)`, and `backdrop-filter: blur(var(--glass-blur))`.

- **Use it as an accent, not a default.** Reserve `.glass` for a small
  number of elevated/floating surfaces per screen (a modal, a floating
  action panel, a sticky top nav) — not every card. Overuse both hurts
  legibility (especially for Arabic diacritics rendered on a blurred
  surface) and has a real compositing cost — see
  [rules.md#performance](./rules.md#performance--keep-the-app-fast).
- **Always pair `.glass` with real content contrast** — text sitting on a
  glass surface still needs to pass contrast checks against whatever is
  visible behind it, which varies by scroll position. Test it against the
  actual busiest background it will render over, not just a solid color.
- Glass tokens are intentionally more transparent in dark mode
  (`oklch(1 0 0 / 6%)`) than light mode (`oklch(1 0 0 / 60%)`) — a
  translucent-white overlay reads as "frosted glass" in dark mode and
  needs more opacity in light mode to stay legible against bright content
  behind it.

## Typography

- **UI/Latin text**: `--font-sans` (currently the default from
  `create-next-app`/Geist family). Fine for interface chrome, settings,
  buttons, English body copy.
- **Arabic Quran/hadith text**: **not yet configured.** The default sans
  font is not an appropriate typeface for Quranic Arabic — it lacks the
  correct diacritical mark (tashkeel) rendering and the calligraphic
  weight expected for scripture. Before `features/quran` ships:
  1. Choose a proper Arabic typeface designed for Quranic text (e.g. an
     Amiri/Uthmanic-style font, licensed appropriately) or a certified
     Quran font/API that ships pre-rendered text.
  2. Add it as its own token (e.g. `--font-quran`) rather than overloading
     `--font-sans`, since Arabic UI chrome (menus, buttons) and Quranic
     verse text have different typographic needs.
  3. Verify diacritics render correctly across the target browsers/devices
     before considering this done — this is a correctness issue, not just
     aesthetics, for scripture text.
- **Monospace**: `--font-mono` (Geist Mono) — code/data display only, not
  expected to be user-facing outside admin/debug contexts.
- **Scale**: use Tailwind's default type scale (`text-sm` … `text-4xl`)
  unless a documented product need requires custom sizes — if so, add the
  scale to `@theme` in `globals.css`, not as one-off arbitrary values.

## Spacing & Radius

- **Spacing**: Tailwind's default spacing scale (4px base unit). No custom
  spacing scale has been introduced — don't add arbitrary spacing values
  (`mt-[13px]`) when the default scale has a close-enough step.
- **Radius**: derived from a single `--radius` base value (`0.625rem`),
  scaled into `--radius-sm` through `--radius-4xl` in `@theme`. Pick from
  this scale (`rounded-sm` … `rounded-4xl`) rather than an arbitrary
  radius value, so a future brand change to `--radius` cascades everywhere.

## Iconography

- `lucide-react` exclusively — see [rules.md](./rules.md#never-do). One
  icon language keeps stroke weight, sizing, and visual style consistent
  across every feature.
- Default icon sizing should match the text it sits beside (commonly
  `size-4` inline with body text, `size-5`/`size-6` for standalone
  actions) — don't mix icon sizes within the same row/toolbar.

## Elevation & Effects

- Use `card`/`popover` background tokens plus Tailwind's default shadow
  utilities (`shadow-sm`, `shadow-md`, etc.) for elevation — no custom
  shadow palette exists yet. If a custom shadow is genuinely needed (e.g.
  a distinctive card treatment), add it as a token, not an inline
  arbitrary value.
- Animation timing/easing: prefer `tw-animate-css` utilities for simple
  transitions; see [ui-ux/README.md#motion--animation](./ui-ux/README.md#motion--animation)
  for when to reach for `framer-motion` instead.

## Theming Rules

- Managed by `next-themes`; theme values come from
  `src/constants/theme.ts` (`THEMES.LIGHT/DARK/SYSTEM`), default
  `system`.
- A component is not done until it's been checked in **both** themes —
  see the [UI review checklist](./ui-ux/README.md#ui-review-checklist-prs).
- Never assume light theme as a fallback for an untested dark-theme
  value — the `.dark` block in `globals.css` must define every token
  the `:root` block does.

## RTL Notes

- Design and build components RTL-first for anything touching Arabic/Urdu
  content — see
  [ui-ux/README.md#internationalization--rtl](./ui-ux/README.md#internationalization--rtl)
  for the full rule. In design terms specifically:
  - Icons that imply direction (arrows, chevrons for "next/back") must
    flip for RTL — don't hardcode a left-pointing icon for "previous" if
    the layout can be mirrored.
  - Mixed-content cards (e.g. an Arabic ayah with an English translation)
    need a deliberate per-block text direction, not a single page-level
    `dir` covering both.
