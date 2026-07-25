# ADR-0004: Centralize all HTTP access behind `src/lib/api`

**Status:** Accepted
**Date:** 2026-07-26

## Context

The application will eventually have dozens of features (quran, hadith,
tafsir, prayer times, bookmarks, notes, admin, ...), each needing to talk to
a backend API. Left unconstrained, each feature tends to accumulate its own
`axios`/`fetch` calls, its own base URL handling, its own auth-header logic,
and its own error-shape assumptions — producing subtle inconsistencies
(one feature retries on 401, another doesn't; one reads the token from a
cookie, another from `localStorage`) that surface as hard-to-reproduce bugs.

## Decision

All HTTP requests go through a single module, `src/lib/api/`:
`client.ts` (one Axios instance), `interceptors.ts` (auth header injection,
401 handling), `api.ts` (typed `get/post/put/patch/delete` wrappers), and
`index.ts` (public surface). No feature code instantiates Axios or calls
`fetch` directly.

## Alternatives considered

- **Per-feature API clients** (e.g. `features/quran/api.ts` with its own
  Axios instance) — rejected as the default. It duplicates base
  URL/auth/error handling per feature and makes a global change (e.g.
  adding a retry policy, switching auth mechanisms) an N-file change
  instead of a 1-file change. Features may still have their own
  `api.ts` that _calls_ the shared `api` object with feature-specific
  endpoint/type pairings — that's encouraged; it's a separate Axios
  instance that's disallowed.
- **A GraphQL client** (Apollo/urql) — rejected at this stage since the
  backend contract isn't finalized; revisit if/when GraphQL is adopted, as
  it would replace this ADR rather than extend it.

## Consequences

- Endpoint paths live once in `src/constants/api.ts`; feature code imports
  the constant, not a string literal — see
  [docs/api/README.md](../api/README.md) for the endpoint reference.
- Auth-token handling (attach/clear) is one interceptor, not one per
  feature.
- Swapping the HTTP library (e.g. Axios → `ky`/`fetch`) or adding
  cross-cutting behavior (retry, request dedup, telemetry) touches
  `src/lib/api` only.
- The current auth-token storage (`localStorage`) inside
  `interceptors.ts` is a known placeholder — see the note in
  [api-layer.md](../architecture/api-layer.md) — and should be revisited
  before production, independent of this ADR's core decision.
