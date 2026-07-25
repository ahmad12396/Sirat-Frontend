# ADR-0005: Normalize all errors into a single `AppError` type

**Status:** Accepted
**Date:** 2026-07-26

## Context

Errors in a full-stack app arrive in several incompatible shapes: Axios
errors (network failure vs. HTTP status with a backend-defined error body),
Zod validation errors, native `Error`s, and truly unknown thrown values.
Without a shared type, UI code ends up with ad hoc `catch (e: any)` blocks
that each guess at the error's shape, and monitoring/logging is scattered
across `console.error` calls with no consistent structure.

## Decision

Introduce `src/lib/errors/` as the single place errors are defined and
normalized:

- `ErrorCodes.ts` — a closed set of application error codes and their
  default HTTP status mapping.
- `AppError.ts` — one error class the rest of the app throws/catches, with
  static factories for common cases (`unauthorized`, `forbidden`,
  `notFound`, `validation`).
- `error-handler.ts` — `normalizeError()` converts any thrown value into an
  `AppError`; `handleError()` normalizes and logs it in one call.

Pair this with `src/lib/logger/logger.ts` as the single logging entry
point (see [error-handling.md](../architecture/error-handling.md)),
so that swapping in Sentry later is a one-file change.

## Alternatives considered

- **A hierarchy of error subclasses** (`NotFoundError extends AppError`,
  `ValidationError extends AppError`, ...) — rejected in favor of one class
  with a `code` discriminant plus static factories. A discriminant is
  simpler to exhaustively `switch` on and to serialize, and avoids
  `instanceof` chains across module boundaries (which break under some
  bundler/HMR setups).
- **Let each feature handle its own errors** — rejected for the same
  reason as [ADR-0004](./0004-centralized-api-layer.md): consistency and a
  single point of change when the backend's error format or the monitoring
  platform changes.

## Consequences

- Any new backend error shape only requires a change inside
  `normalizeError()`, not a hunt across every feature's `catch` blocks.
- UI code can uniformly rely on `err.message`, `err.code`, and
  `err.fieldErrors` regardless of where the error originated.
- Introducing Sentry (or similar) means adding a transport call inside
  `logger.ts`'s `write()` — no call-site changes across the app.
