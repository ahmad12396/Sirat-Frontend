---
tags: [architecture, errors, logging]
---

# Error Handling

Up: [[Sirat MOC]] · Decision: [[ADR 0005 - Centralized Error Handling]] · Called from: [[API Layer]]

## Logging

Single `logger` (`src/lib/logger/logger.ts`) — `debug/info/warn/error`.
Never raw `console.*`. Debug suppressed outside dev. Swap point for Sentry
later is `write()` inside this file only.

## Errors

- `ErrorCodes.ts` — closed set (`VALIDATION_ERROR`, `UNAUTHORIZED`,
  `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `NETWORK_ERROR`,
  `INTERNAL_ERROR`, `UNKNOWN_ERROR`) + HTTP status mapping
- `AppError.ts` — one error class, static factories
  (`.unauthorized()`, `.forbidden()`, `.notFound()`, `.validation()`)
- `error-handler.ts` — `normalizeError()` (Zod/Axios/Error/unknown → `AppError`),
  `handleError()` (normalize + log)

Tested in `src/lib/errors/error-handler.test.ts` — see [[Vitest]].
