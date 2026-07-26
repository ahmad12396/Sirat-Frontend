---
tags: [adr, accepted]
---

# ADR 0005 — Centralized Error Handling

Up: [[Sirat MOC]] · Implements: [[Error Handling]]

**Decision:** one `AppError` class with a `code` discriminant + static
factories, not a subclass hierarchy. `normalizeError`/`handleError` convert
any thrown value (Zod/Axios/Error/unknown).

**Why:** a discriminant is simpler to exhaustively switch on / serialize
than `instanceof` chains; single point of change when backend error shape
or monitoring platform changes.

**Consequence:** UI code relies uniformly on `.message`/`.code`/`.fieldErrors`.
Sentry integration later = one change inside `logger.ts`'s `write()`.
