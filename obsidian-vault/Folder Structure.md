---
tags: [architecture, code-organization]
---

# Folder Structure

Up: [[Sirat MOC]] · Decision: [[ADR 0001 - src Directory Layout]]

All app code under `src/`. Key folders:

- `app/` — Next.js App Router, route groups — see [[App Flow]]
- `components/` — `ui/` (one folder per primitive: `button/`, `card/`,
  `dialog/`, ...), `layout/`, `forms/`, `feedback/`, `navigation/`,
  `common/`. One component = one folder + barrel `index.ts`.
- `features/` — one folder per domain (quran, hadith, prayer, admin, ...) —
  mostly still empty scaffolding, see [[Memory Status]]
- `lib/` — [[API Layer]], [[Error Handling]], logger, `utils.ts`
- `providers/` — `ThemeProvider`, `QueryProvider`, composed in root layout
- `services/` — external integrations (Firebase, payments, ...)
- `store/` — Zustand slices — see [[App Flow]]
- `constants/`, `types/`, `config/` — shared values/types/env

## `components/` vs `features/`

Domain-agnostic reusable UI → `components/`. Anything that knows about
quran/hadith/prayer data shapes → `features/<name>/`.

## `lib/` vs `services/`

App-owned infrastructure (no third-party SDK knowledge) → `lib/`. Thin
wrappers around external providers → `services/`.

## Note

`src/api/` and `src/routes/` are unresolved placeholders — no defined
purpose, don't build on them without confirming intent first.
