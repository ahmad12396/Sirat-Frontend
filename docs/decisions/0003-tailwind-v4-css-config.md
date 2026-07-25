# ADR-0003: Stay CSS-based for Tailwind v4 config

**Status:** Accepted
**Date:** 2026-07-26

## Context

An early planning document listed `tailwind.config.ts` as part of the
standard root-level file set. That convention comes from Tailwind v3,
where a JS/TS config file was mandatory for theme customization, content
globs, and plugins. This project is on Tailwind v4, whose default and
recommended approach is CSS-based configuration via `@theme` in
`app/globals.css`, with `@tailwindcss/postcss` handling the build — no
`tailwind.config.ts` required for the common case.

## Decision

Do not add `tailwind.config.ts`. Configure Tailwind v4 via `@theme`/
`@import` directives in `src/app/globals.css`, matching what shadcn's CLI
already generated.

## Alternatives considered

- **Add a v4-compatible JS config anyway** — rejected for now. It would add
  an indirection layer (JS config re-exported into CSS variables) that v4
  doesn't require, for no current benefit. Content-glob configuration,
  which was the main reason v3 needed a JS file, is largely automatic in
  v4's default setup.

## Consequences

- Theme customization (colors, spacing, fonts) happens in `globals.css`,
  not a `.ts` file — contributors familiar with Tailwind v3 need to unlearn
  the JS-config reflex.
- If a future need arises that genuinely requires JS-level config (a
  plugin that isn't CSS-expressible, computed/dynamic theme values), this
  decision should be revisited and superseded rather than silently
  worked around.
