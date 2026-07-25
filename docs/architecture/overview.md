# Overview

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack), React 19
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-based config, no `tailwind.config.ts`)
- **UI primitives**: shadcn/ui (Radix under the hood), `lucide-react` icons
- **Forms & validation**: `react-hook-form` + `zod` (+ `@hookform/resolvers`)
- **HTTP**: `axios`, wrapped by our own API layer — see [api-layer.md](./api-layer.md)
- **State**: `zustand` for client state, `@tanstack/react-query` for server state
- **Animation**: `framer-motion`
- **Theming**: `next-themes`
- **Notifications (UI)**: `sonner`

## Guiding principles

1. **One way to do a thing.** One HTTP client, one error type, one logger, one
   source of truth for env vars, roles, routes, and storage keys. New code should
   reuse these, not reinvent them per-feature.
2. **Fail at the boundary, not in the middle.** Environment variables are
   validated once at startup ([environment.md](./environment.md)); API responses
   are normalized into a single `AppError` shape
   ([error-handling.md](./error-handling.md)) before UI code ever sees them.
3. **Conventions are enforced, not just documented.** Where practical, a rule
   here has a matching lint rule, git hook, or CI check — see
   [tooling.md](./tooling.md). If you find a convention that isn't enforced,
   that's a gap worth closing, not just a note to "please remember".
4. **Feature-first, not layer-first, for domain code.** `src/features/*` holds
   domain modules (quran, hadith, prayer, etc.); `src/components`, `src/lib`,
   `src/services` hold cross-cutting/shared code. See
   [folder-structure.md](./folder-structure.md).

## Source of truth map

| Concern               | Lives in                                   |
| --------------------- | ------------------------------------------ |
| Env vars              | `src/config/env.ts`                        |
| Routes                | `src/constants/routes.ts`                  |
| Roles & permissions   | `src/constants/roles.ts`, `permissions.ts` |
| Languages / i18n keys | `src/constants/languages.ts`               |
| Theme values          | `src/constants/theme.ts`                   |
| `localStorage` keys   | `src/constants/storage.ts`                 |
| API endpoint paths    | `src/constants/api.ts`                     |
| HTTP client           | `src/lib/api/`                             |
| Error types           | `src/lib/errors/`                          |
| Logging               | `src/lib/logger/logger.ts`                 |
| Shared domain types   | `src/types/`                               |
