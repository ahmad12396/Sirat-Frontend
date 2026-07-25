# ADR-0001: Adopt `src/` directory layout

**Status:** Accepted
**Date:** 2026-07-26

## Context

The project was scaffolded by `create-next-app` with `app/`, `components/`,
and `lib/` at the repository root. As the codebase grows to cover the full
target structure (features, services, store, providers, i18n, middleware,
etc.), a root cluttered with both application code and tooling config
(`.eslintrc`-equivalents, `package.json`, CI config, `docs/`, `tests/`)
becomes harder to scan and to configure tooling against.

## Decision

Move all application source (`app/`, `components/`, `lib/`, and every
subsequent domain folder) under a single `src/` directory. Root-level stays
reserved for project configuration and non-code directories (`docs/`,
`tests/`, `scripts/`, `.github/`, `.vscode/`, `.husky/`).

## Alternatives considered

- **Keep everything at repo root** — rejected. As `features/`, `services/`,
  `store/`, `providers/`, etc. are added, the root directory listing becomes
  a mix of config files and a dozen+ app folders, making it harder to
  distinguish "project config" from "app code" at a glance.
- **`src/` for some folders, root for others** — rejected for
  inconsistency; tooling (tsconfig paths, `@/*` alias, IDE search scoping)
  is simpler with one clean boundary.

## Consequences

- `tsconfig.json`'s `@/*` path alias now points at `./src/*` instead of
  `./*`; `components.json`'s `css` path was updated to match.
- Next.js auto-detects the `src/` convention with no `next.config.ts`
  change required.
- All future scaffolding (features, services, store, etc.) goes under
  `src/` from the start — see
  [folder-structure.md](../architecture/folder-structure.md).
- One-time migration cost (git-tracked renames) was small since the
  codebase was still early (three source files at time of migration).
