# Project Memory — Status Log

A running record of what's actually done vs. in progress vs. not started,
so anyone (human or AI assistant) picking this project up mid-stream can
get oriented in one read instead of reverse-engineering it from git log.
Keep entries short and update them as work happens — this file is only
useful if it stays current. Don't backfill detailed history here; that's
what git log and `docs/decisions/` are for. This file answers one question:
**"what's the state of things right now?"**

**Last updated:** 2026-07-26

## Current Phase

[Phase 0 — Foundation & Design System](./phases.md#phase-0--foundation--design-system) —
infrastructure and design tokens/base components are done; the component
preview page and breakpoint verification are the remaining Phase 0
deliverable. Phase 1 (App Shell & Navigation) has not started.

## Completed

- Repo restructured to `src/` layout ([ADR-0001](./decisions/0001-src-directory-layout.md))
- Tooling: ESLint (flat config), Prettier, EditorConfig, Husky + lint-staged,
  commitlint, `.vscode/` shared workspace config
- `src/config/env.ts` — Zod-validated env vars, `process.env` access
  blocked outside it by ESLint
- `src/lib/api/` — centralized Axios client, interceptors, typed `api.*`
  wrappers
- `src/lib/errors/` + `src/lib/logger/` — `AppError`, `ErrorCodes`,
  `normalizeError`/`handleError`, single `logger`
- `src/constants/*`, `src/types/*` — shared constants and types
- `src/providers/` — `ThemeProvider` (next-themes) and `QueryProvider`
  (React Query), wired into `src/app/layout.tsx` along with `sonner`'s
  `<Toaster />`
- Dark-mode-default, glassmorphism-accented design tokens in
  `src/app/globals.css` ([ADR-0008](./decisions/0008-dark-mode-glassmorphism-design.md))
- `src/components/` restructured to one-folder-per-component
  (`ui/<name>/`, `layout/`, `forms/`, `feedback/`, `navigation/`, `common/`)
- Base components built: Button, Card, Input, Dialog, Skeleton, Switch,
  Tabs, ThemeToggle, Header (top nav, using `.glass`)
- Component preview page (`/preview`, noindex) showing every base
  component/state
- Vitest set up (`vitest.config.ts`, jsdom, RTL) with 11 passing tests
  across `lib/utils`, `Button`, `error-handler`
- Full `docs/` set: architecture (folder + app-flow), API contract,
  security baseline, UI/UX guidelines, ADR log (0001–0009), PRD, phases
  (rewritten as the frontend build-order plan), design tokens, rules,
  deployment — this file
- CI/CD: `ci.yml`, `code-quality.yml`, `pr-validation.yml` live and
  passing; `deploy.yml` written (branch → environment mapping via
  [ADR-0009](./decisions/0009-git-branching-and-environments.md)) but
  **not yet runnable** — Vercel projects/secrets aren't provisioned

## Currently Working On

Phase 0's remaining items: responsive breakpoint verification (360/768/
1024/1440px) across the base components, then Phase 0 can be marked done.

## Not Started

- Every feature folder under `src/features/*` is scaffolded (empty) —
  no actual feature code yet (Phase 1+).
- Backend API doesn't exist/isn't finalized — `docs/api/README.md`'s
  endpoint reference is provisional.
- Auth is not implemented — `src/lib/api/interceptors.ts`'s token handling
  is wired up but there's no login/register flow to produce a token yet.
- No Arabic Quran typography set up yet (see
  [design.md#typography](./design.md#typography)).
- i18n (`src/i18n/`) is scaffolded but not wired to any translation
  content yet.
- Vercel projects (dev/uat/production) and their GitHub secrets — see
  [deployment/README.md](./deployment/README.md) — `deploy.yml` will fail
  until these exist.

## Known Blockers / Open Decisions

Tracked in full in their source docs — listed here just as pointers:

- Auth token storage (`localStorage` vs. httpOnly cookie) —
  [security/README.md#known-gaps](./security/README.md#known-gaps)
- Scope of `features/ai` needs its own ADR before implementation —
  [prd.md#9-open-questions](./prd.md#9-open-questions)
- Source of truth for Quran/hadith/tafsir content (licensed API vs.
  self-hosted dataset) — [prd.md#9-open-questions](./prd.md#9-open-questions)
- Vercel project/secret provisioning for `deploy.yml` —
  [deployment/README.md](./deployment/README.md)
- Contrast of the new accent color/glass surfaces not yet independently
  verified against WCAG AA — [design.md#color](./design.md#color)

## How To Update This File

- Change **Last updated** every time you edit this file.
- Move items between **Completed** / **Currently Working On** /
  **Not Started** as their state actually changes — don't leave a
  finished item sitting in "Currently Working On."
- If a blocker gets resolved, delete it from **Known Blockers** here (the
  full record stays in the linked doc/ADR) rather than marking it
  "resolved" and leaving it cluttering this file.
