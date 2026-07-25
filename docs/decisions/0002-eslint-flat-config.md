# ADR-0002: Keep ESLint flat config over legacy `.eslintrc`

**Status:** Accepted
**Date:** 2026-07-26

## Context

An early planning document for the project's folder/file conventions listed
`.eslintrc` and `.eslintignore` at the repo root. The project, however, was
scaffolded with Next.js 16 and ESLint 9, which default to the flat config
format (`eslint.config.mjs`), built on `eslint-config-next`'s
`core-web-vitals` and `typescript` flat presets.

## Decision

Keep `eslint.config.mjs` (flat config). Do not introduce `.eslintrc` or
`.eslintignore`.

## Alternatives considered

- **Convert to legacy `.eslintrc.json` + `.eslintignore`** — rejected. This
  would be a downgrade: ESLint 9's legacy config support is a compatibility
  shim, not the primary path, and `eslint-config-next` ships its
  recommended presets as flat-config exports first. Converting back adds a
  translation layer for no benefit.

## Consequences

- Any new lint rule (e.g. the `no-restricted-properties` rule blocking
  direct `process.env` access — see
  [ADR-0006](./0006-env-validation-with-zod.md)) is added as an entry in
  the `defineConfig([...])` array in `eslint.config.mjs`, with per-file
  overrides via `{ files: [...], rules: {...} }` blocks rather than
  `.eslintrc`'s `overrides` array syntax.
- Contributors coming from older ESLint/Next projects should expect the
  flat-config API (arrays of config objects, `globalIgnores`, no
  `extends` string), not the legacy `{ "extends": [...] }` object shape.
