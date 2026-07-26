---
tags: [adr, accepted]
---

# ADR 0006 — Env Validation with Zod

Up: [[Sirat MOC]] · Implements: [[Rules]]

**Decision:** `src/config/env.ts` validates all env vars via Zod schemas
(server vs `NEXT_PUBLIC_*` client), parsed eagerly at import, throwing with
a readable error on failure. `process.env` access blocked elsewhere by
ESLint (`no-restricted-properties`) — see [[ADR 0002 - ESLint Flat Config]].

**Why:** raw `process.env` is untyped/unchecked; misconfig otherwise
surfaces as a confusing runtime bug instead of a boot-time failure.

**Alternative considered:** `t3-oss/env-nextjs` — skipped for now (small
surface), revisit if env surface grows.
