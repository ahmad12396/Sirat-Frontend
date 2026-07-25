# UI / UX Guidelines

This document is the design-system contract: what to reach for by default,
what conventions keep the UI consistent as dozens of features
(`src/features/*`) are built by different contributors, and the
accessibility/i18n bar every screen must clear.

- [Design System Foundations](#design-system-foundations)
- [Theming](#theming)
- [Internationalization & RTL](#internationalization--rtl)
- [Component Conventions](#component-conventions)
- [Forms](#forms)
- [Feedback & Notifications](#feedback--notifications)
- [Motion & Animation](#motion--animation)
- [Responsive Design](#responsive-design)
- [Accessibility](#accessibility)
- [Content & Tone](#content--tone)
- [UI Review Checklist (PRs)](#ui-review-checklist-prs)

---

## Design System Foundations

- **Component primitives**: shadcn/ui (Radix under the hood), generated
  into `src/components/ui/`. Treat these as the base layer — extend/compose
  them in `src/components/` (shared) or `src/features/<name>/components/`
  (feature-specific), don't fork a primitive's internals.
- **Styling**: Tailwind CSS v4, configured via `@theme` in
  `src/app/globals.css` (no `tailwind.config.ts` — see
  [ADR-0003](../decisions/0003-tailwind-v4-css-config.md)). Design tokens
  (colors, spacing, radii, fonts) belong in `globals.css`, not inlined as
  magic Tailwind arbitrary values (`w-[137px]`) scattered across
  components.
- **Icons**: `lucide-react` exclusively, for a single consistent icon
  language. Don't mix in another icon set without a deliberate decision
  and ADR.
- **shadcn config**: `components.json` is the single source of truth for
  aliases (`@/components`, `@/lib/utils`, `@/components/ui`, `@/lib`,
  `@/hooks`) and style (`radix-nova`, `neutral` base color). Run the
  shadcn CLI to add new primitives rather than hand-copying component code
  from the docs site, so it stays wired to the project's config.

## Theming

- `next-themes` provides light/dark/system switching; values come from
  `src/constants/theme.ts` (`THEMES`, `DEFAULT_THEME`, `THEME_STORAGE_KEY`)
  — don't hardcode `"light"`/`"dark"` string literals elsewhere.
- Every new color token added to `globals.css` needs both a light and dark
  value. A component that looks right only in one theme is not done.
- Default theme is `system` — respect the user's OS preference unless
  they've explicitly overridden it.

## Internationalization & RTL

- Supported languages live in `src/constants/languages.ts`
  (`LANGUAGES.EN/AR/UR`), with `RTL_LANGUAGES` and `isRtlLanguage()`
  already identifying Arabic and Urdu as RTL.
- **This is not a "nice to have."** Quranic and hadith text is
  fundamentally Arabic-script content — RTL layout must be a first-class
  concern from a component's first version, not retrofitted. When building
  a new component:
  - Use logical CSS properties (`ms-*`/`me-*`, `ps-*`/`pe-*` in Tailwind)
    instead of physical ones (`ml-*`/`mr-*`) wherever direction-sensitive
    spacing is involved.
  - Test the component with `dir="rtl"` before considering it done, not
    just visually eyeballing the LTR version.
  - Mixed-direction text (an Arabic ayah with an English translation
    below it) needs deliberate `dir` scoping per block, not one blanket
    direction for the whole page.
- Translation strings live in `src/i18n/` — no user-facing string should
  be hardcoded in a component once i18n is wired up for that area.

## Component Conventions

- **`components/` vs `features/`** — see
  [folder-structure.md](../architecture/folder-structure.md). Shared,
  domain-agnostic UI goes in `src/components/*`; anything that knows about
  quran/hadith/prayer/etc. data shapes belongs in
  `src/features/<name>/`.
- Prefer composition over prop-explosion: a component accumulating many
  boolean props (`isCompact`, `isBordered`, `isRounded`, ...) is usually a
  sign it should be split or use `cva` (`class-variance-authority`,
  already a dependency) for variants instead.
- Co-locate a component's variants/styles with the component itself; don't
  scatter Tailwind class strings for one component across multiple files.

## Forms

- All forms use `react-hook-form` + `zod` (via `@hookform/resolvers`) —
  see [ADR](../decisions) for the API error-format this pairs with.
- Validation errors surfaced to the user should come from the same `zod`
  schema used for submission — don't hand-write a second, divergent set of
  validation messages in the UI layer.
- On submit failure, map `AppError.fieldErrors` (see
  [error-handling.md](../architecture/error-handling.md)) back onto the
  relevant form fields via `setError`, rather than showing only a generic
  toast when the backend has already told us which field failed.

## Feedback & Notifications

- Use `sonner` (`<Toaster />`) for transient feedback (success/error
  toasts). Reserve inline form errors for field-specific validation and
  toasts for action-level outcomes (save succeeded, request failed,
  session expired).
- Every destructive action (delete note, remove bookmark, admin actions)
  needs a confirmation step — a toast alone is not sufficient
  confirmation for an irreversible action.

## Motion & Animation

- `framer-motion` for interactive/gesture-driven animation;
  `tw-animate-css` for simple utility-class transitions/keyframes. Prefer
  the CSS-utility route for simple enter/exit and reserve
  `framer-motion` for anything needing gesture handling, layout
  animation, or orchestrated sequences.
- Respect `prefers-reduced-motion` — any non-trivial animation should be
  disabled or significantly reduced for users who've set that preference
  at the OS level.

## Responsive Design

- Design mobile-first; add complexity at larger breakpoints, not the
  reverse. A significant share of users of a prayer-times/Quran app will
  be on mobile, often with intermittent connectivity — keep that the
  primary target, not an afterthought pass at the end.
- Use Tailwind's default breakpoint scale unless a documented product need
  requires a custom one (and if so, that belongs in `globals.css`'s
  `@theme`, applied consistently, not a one-off arbitrary breakpoint in a
  single component).

## Accessibility

- Radix primitives (via shadcn) give correct ARIA semantics and keyboard
  handling by default — don't strip that out by replacing a Radix
  primitive with a bare `<div>` for "simplicity."
- Every interactive element must be keyboard-reachable and have a visible
  focus state — don't remove `:focus-visible` styles for aesthetics.
- Color is never the only signal (e.g. error states need an icon/text, not
  just red text) — this matters doubly for a design with Arabic script,
  where color-only cues are even easier to miss at a glance.
- Images/icons that convey meaning need accessible text (`alt`, `aria-label`);
  purely decorative ones should be hidden from assistive tech
  (`aria-hidden`).
- Target WCAG 2.1 AA as the baseline for contrast ratios, both in light and
  dark theme.

## Content & Tone

- This app presents religious text (Quran, hadith, tafsir) to a wide
  audience across languages. Attribution matters: hadith must display its
  grading (`sahih`/`hasan`/`daif`/`mawdu` — see `src/types/hadith.ts`) and
  source collection; tafsir must display its author/source. Never present
  translated or interpretive text as if it were the primary text itself.
- Tone in UI copy (errors, empty states, onboarding) should be respectful
  and measured — this is a reference tool for religious content, not a
  casual consumer app; avoid flippant copy in that context (e.g. error
  messages, loading states) even where a typical SaaS app might use humor.

## UI Review Checklist (PRs)

Before merging a UI-facing PR, confirm:

- [ ] Component works in both light and dark theme
- [ ] Component works with `dir="rtl"` if it renders any user-facing text
- [ ] No hardcoded color/spacing values that bypass `globals.css` tokens
- [ ] Keyboard navigation and focus states work
- [ ] Destructive actions have a confirmation step
- [ ] New user-facing strings are ready to move into `src/i18n/` (not
      buried as inline literals if i18n is active for that area)
- [ ] Tested at a mobile viewport width, not just desktop
