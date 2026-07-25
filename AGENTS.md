<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Sirat — Agent Orientation

Sirat is a multilingual (English/Arabic/Urdu, RTL-aware) Islamic knowledge
and daily-practice app: Quran, tafsir, hadith, prayer times, qibla, azkar,
duas, plus personal bookmarks/notes/collections. Next.js 16 (App Router,
Turbopack) + React 19 + TypeScript, Tailwind v4, shadcn/ui.

## Before you write or review any code

1. Read **[docs/rules.md](docs/rules.md)** — the enforceable do's/don'ts
   (env access, the API/error/logging layers, dead-code hygiene,
   performance, injection/security checks). This is the fast reference;
   check it first.
2. Read **[docs/memory.md](docs/memory.md)** — what's actually done vs. in
   progress vs. not started. Don't assume a feature exists because it's in
   the folder tree; most `src/features/*` folders are still empty
   scaffolding (see Current Phase there).
3. For "where does this code go", see
   **[docs/architecture/folder-structure.md](docs/architecture/folder-structure.md)**.

## Project structure (`src/`)

```
src/
├── app/            Next.js App Router — (public)/(auth)/(dashboard) route groups
├── components/     Reusable UI: ui/ (one folder per primitive, e.g. ui/button/),
│                   layout/, forms/, feedback/, navigation/, charts/, animations/, common/
├── features/       One folder per domain area (quran, hadith, prayer, admin, ...)
├── lib/            App infrastructure: api/ (HTTP client), errors/, logger/, utils.ts, ...
├── providers/      Root-composed React providers (theme, react-query, ...)
├── services/       Thin wrappers around external providers (Firebase, payments, ...)
├── store/          Zustand slices (client-only state — see architecture.md)
├── hooks/, config/, constants/, styles/, types/, i18n/, middleware/, schemas/, generated/
```

`src/api/` and `src/routes/` at the top level are placeholders with no
defined purpose yet — don't assume they're wired to anything; confirm
intent before building on them.

## Documentation map

Full index: **[docs/README.md](docs/README.md)**. Key pages:

- [docs/prd.md](docs/prd.md) — product requirements, feature scope, open
  questions
- [docs/phases.md](docs/phases.md) — how feature work is sequenced
- [docs/architecture.md](docs/architecture.md) — app flow: routes, request
  flow, auth flow, state management, rendering strategy
- [docs/architecture/](docs/architecture/README.md) — code organization:
  env validation, API layer internals, error handling, tooling
- [docs/api/README.md](docs/api/README.md) — frontend↔backend API contract
- [docs/security/README.md](docs/security/README.md) — threat model,
  known gaps (read before touching auth/session code)
- [docs/ui-ux/README.md](docs/ui-ux/README.md) — design system, theming,
  RTL/i18n, accessibility, content/tone
- [docs/design.md](docs/design.md) — color/typography/spacing tokens
- [docs/decisions/](docs/decisions/README.md) — ADR log: why things are
  built the way they are

If you make a decision that's hard to reverse, cross-cutting, or would
look wrong out of context later, write an ADR
([docs/decisions/README.md](docs/decisions/README.md)) rather than just
writing the code.
