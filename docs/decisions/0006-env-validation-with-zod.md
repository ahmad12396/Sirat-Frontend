# ADR-0006: Validate environment variables with Zod at startup

**Status:** Accepted
**Date:** 2026-07-26

## Context

Next.js exposes environment variables via `process.env`, typed by default
as `string | undefined`. Accessing it directly throughout the codebase
means: no compile-time guarantee a variable exists, no runtime check that
it's well-formed (e.g. a URL), and no clear line between server-only
secrets and `NEXT_PUBLIC_*` values safe to ship to the browser. Misconfigured
env vars typically fail as a confusing `undefined`-related bug deep in
whatever code first tries to use them — often in production, after
deploy.

## Decision

All environment variables are declared and validated in
`src/config/env.ts` using Zod schemas — a `serverSchema` for server-only
vars and a `clientSchema` for `NEXT_PUBLIC_*` vars — parsed eagerly at
import time. On validation failure, the error tree is logged and the
module throws, failing fast at boot. All app code imports the resulting
typed `env` object; direct `process.env` access elsewhere is disallowed by
an ESLint rule (`no-restricted-properties` in `eslint.config.mjs`, with a
single carve-out for `env.ts` itself).

## Alternatives considered

- **`t3-oss/env-nextjs`** — a purpose-built library for this exact problem.
  Not adopted yet to avoid adding a dependency before the project's env
  surface is large enough to need its extra ergonomics (e.g.
  `skipValidation`, `emptyStringAsUndefined`); the hand-rolled Zod version
  covers the current, small surface. Worth revisiting if the number of env
  vars grows significantly — this ADR should be superseded if so.
- **Convention only (document required vars, no runtime check)** —
  rejected: conventions that aren't enforced get skipped under deadline
  pressure; see [tooling.md](../architecture/tooling.md)'s general
  philosophy of pairing conventions with enforcement.

## Consequences

- Every consumer gets full type inference instead of
  `string | undefined`.
- A missing/malformed env var fails the build or dev server startup with a
  specific, readable error instead of surfacing as a runtime bug.
- Adding a new env var requires two touch points by design: `.env.example`
  and the schema in `env.ts` — documented in
  [environment.md](../architecture/environment.md).
- The ESLint rule means legitimate low-level exceptions (rare) must be
  scoped explicitly via a `files` override in `eslint.config.mjs`, not an
  inline `eslint-disable` — keeping exceptions visible and reviewable.
