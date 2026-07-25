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

[Phase 0 — Foundation (Infrastructure)](./phases.md#phase-0--foundation-infrastructure) —
essentially complete. No feature-area work (Phase 1+) has started yet.

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
- `src/constants/*` — routes, roles, permissions, languages, theme,
  storage keys, API endpoints (values are placeholders pending real
  product/backend confirmation — see Open Questions in
  [prd.md](./prd.md))
- `src/types/*` — common, pagination, api, user, auth, quran, hadith
- Full `docs/` set: architecture (folder + app-flow), API contract,
  security baseline, UI/UX guidelines, ADR log, PRD, phases, design
  tokens, rules — this file

## Currently Working On

Nothing actively in progress at time of writing — infrastructure phase
just closed out.

## Not Started

- Every feature folder under `src/features/*` is scaffolded (empty) —
  no actual feature code yet.
- Backend API doesn't exist/isn't finalized — `docs/api/README.md`'s
  endpoint reference is provisional.
- Auth is not implemented — `src/lib/api/interceptors.ts`'s token handling
  is wired up but there's no login/register flow to produce a token yet.
- No real brand color palette — `globals.css` still has the shadcn
  generated neutral default (see [design.md](./design.md#color)).
- No Arabic Quran typography set up yet (see
  [design.md#typography](./design.md#typography)).
- i18n (`src/i18n/`) is scaffolded but not wired to any translation
  content yet.

## Known Blockers / Open Decisions

Tracked in full in their source docs — listed here just as pointers:

- Auth token storage (`localStorage` vs. httpOnly cookie) —
  [security/README.md#known-gaps](./security/README.md#known-gaps)
- Scope of `features/ai` needs its own ADR before implementation —
  [prd.md#9-open-questions](./prd.md#9-open-questions)
- Source of truth for Quran/hadith/tafsir content (licensed API vs.
  self-hosted dataset) — [prd.md#9-open-questions](./prd.md#9-open-questions)

## How To Update This File

- Change **Last updated** every time you edit this file.
- Move items between **Completed** / **Currently Working On** /
  **Not Started** as their state actually changes — don't leave a
  finished item sitting in "Currently Working On."
- If a blocker gets resolved, delete it from **Known Blockers** here (the
  full record stays in the linked doc/ADR) rather than marking it
  "resolved" and leaving it cluttering this file.
