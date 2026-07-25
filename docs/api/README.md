# API Documentation

This is the contract between the Sirat frontend and its backend(s). Anyone
adding, changing, or deprecating an endpoint must update this doc in the same
PR — this is the section most likely to drift, and a drifted API doc is worse
than none, because people trust it and get burned.

- [Conventions](#conventions)
- [Authentication](#authentication)
- [Request / Response Envelope](#request--response-envelope)
- [Error Format](#error-format)
- [Pagination](#pagination)
- [Versioning](#versioning)
- [Rate Limiting](#rate-limiting)
- [Idempotency](#idempotency-for-mutations)
- [Endpoint Reference](#endpoint-reference)
- [Changelog & Deprecation Policy](#changelog--deprecation-policy)

---

## Conventions

- **Base URL** comes from `NEXT_PUBLIC_API_URL` (validated in
  `src/config/env.ts` — see [environment.md](../architecture/environment.md)),
  never hardcoded.
- **Transport**: all requests go through `src/lib/api` (`httpClient` +
  `api.get/post/put/patch/delete`). Nothing in `src/features/*` should call
  `axios`/`fetch` directly. See
  [api-layer.md](../architecture/api-layer.md).
- **Endpoint paths** are defined once in `src/constants/api.ts`
  (`API_ENDPOINTS`) and imported by feature code — never inlined as string
  literals at the call site. Add a new endpoint there before using it.
- **Casing**: JSON payloads use `camelCase` on the wire, matching the
  frontend's `src/types/*` models directly (no snake_case → camelCase mapping
  layer). If the backend returns `snake_case`, that conversion belongs in the
  service/feature's data-mapping code, not scattered across components.
- **Dates/times**: ISO 8601 strings (UTC) over the wire; convert to
  local/display format at the UI boundary only, using `src/lib/date`.

## Authentication

- Bearer token in the `Authorization` header, attached automatically by the
  request interceptor in `src/lib/api/interceptors.ts` from
  `localStorage[STORAGE_KEYS.AUTH_TOKEN]`.
- A `401` response clears the stored token (interceptor side effect) and
  propagates as `AppError` with `code: "UNAUTHORIZED"` — the caller (or a
  future global auth guard) is responsible for redirecting to
  `ROUTES.LOGIN`.
- Token refresh (`API_ENDPOINTS.AUTH.REFRESH`) is defined but not yet wired
  into the interceptor as an automatic retry-on-401 flow — until it is,
  treat a `401` as "session ended", not "silently retryable".

> The current token storage (`localStorage`, single access token) is a
> placeholder for early development. Before this ships to production,
> revisit: httpOnly cookie vs. localStorage tradeoffs, refresh-token
> rotation, and CSRF implications — track this as a real ticket, not a
> comment in code.

## Request / Response Envelope

Success responses are expected to return the resource directly (not
double-wrapped) — `api.get<Surah[]>(...)` resolves to the `Surah[]` itself.
Failure responses follow the `ApiErrorResponse` shape
(`src/types/api.ts`):

```jsonc
// 200 OK
[ { "number": 1, "name": "الفاتحة", "englishName": "Al-Fatihah", ... } ]

// 422 Unprocessable Entity
{
  "success": false,
  "message": "Some fields are invalid.",
  "errors": [
    { "field": "email", "message": "Must be a valid email address." }
  ]
}
```

## Error Format

| HTTP Status | `AppError.code`    | Meaning                                 |
| ----------- | ------------------ | --------------------------------------- |
| —           | `NETWORK_ERROR`    | Request never reached the server        |
| 401         | `UNAUTHORIZED`     | Missing/expired/invalid auth token      |
| 403         | `FORBIDDEN`        | Authenticated but not permitted         |
| 404         | `NOT_FOUND`        | Resource doesn't exist                  |
| 409         | `CONFLICT`         | State conflict (duplicate, stale write) |
| 422         | `VALIDATION_ERROR` | Field-level validation failure          |
| 429         | `RATE_LIMITED`     | Too many requests                       |
| 500         | `INTERNAL_ERROR`   | Unhandled server error                  |
| other       | `UNKNOWN_ERROR`    | Anything not mapped above               |

Every response is normalized into this shape by
`normalizeError`/`handleError` in `src/lib/errors/error-handler.ts` before
it reaches UI code. See
[error-handling.md](../architecture/error-handling.md). Backend changes to
error shape should be handled by updating `normalizeError`, not by adding
per-feature error parsing.

## Pagination

List endpoints that support pagination should return the
`PaginatedResponse<T>` shape (`src/types/pagination.ts`):

```jsonc
{
  "data": [/* T[] */],
  "meta": { "page": 1, "pageSize": 20, "total": 114, "totalPages": 6 },
}
```

Requests accept `page` and `pageSize` query params
(`PaginationParams`). Default `pageSize` and max `pageSize` are defined by
the backend and should be documented per-endpoint below once finalized —
don't assume a default client-side.

## Versioning

- The API is versioned via URL prefix (`/v1/...`) once a backend base path
  is finalized. Until then, `NEXT_PUBLIC_API_URL` should include the version
  segment (e.g. `https://api.sirat.app/v1`) so a `v2` migration is a single
  env var change, not a find-and-replace across `API_ENDPOINTS`.
- Breaking changes require a new version prefix. Non-breaking additions
  (new optional field, new endpoint) do not.

## Rate Limiting

- Expect `429 Too Many Requests` with `Retry-After` (seconds) once the
  backend implements rate limiting. `AppError.code === "RATE_LIMITED"`
  should be handled distinctly from a generic error — surface a
  "try again in N seconds" message, not a generic failure toast.
- Document per-endpoint limits here as they're defined; don't hardcode
  retry/backoff values in feature code — centralize in
  `src/lib/api` if/when automatic retry is added.

## Idempotency (for mutations)

For non-idempotent `POST` endpoints that create a resource (e.g. placing an
order, submitting a report), send an `Idempotency-Key` header (UUID per
logical action) once the backend supports it, so retried requests (flaky
network, double-click) don't create duplicates. Not yet implemented in
`src/lib/api` — add as a per-call `config.headers` option when needed
rather than a global default (most `GET`s and idempotent `PUT`s don't need
it).

## Endpoint Reference

> This section is intentionally thin until the backend contract is
> finalized. Each endpoint below should eventually document: method, path,
> auth requirement, request body/query shape, response shape, and possible
> error codes — in that order, one subsection per endpoint. Do not let this
> list silently fall out of sync with `src/constants/api.ts` — they must
> match 1:1.

### Auth

| Method | Endpoint (`API_ENDPOINTS.AUTH.*`) | Auth required | Notes                          |
| ------ | --------------------------------- | ------------- | ------------------------------ |
| POST   | `LOGIN`                           | No            | Returns `AuthTokens`           |
| POST   | `REGISTER`                        | No            | Returns `AuthTokens`           |
| POST   | `LOGOUT`                          | Yes           | Invalidates current token      |
| POST   | `REFRESH`                         | Refresh token | Not yet wired into interceptor |

### Users

| Method | Endpoint (`API_ENDPOINTS.USERS.*`) | Auth required | Notes          |
| ------ | ---------------------------------- | ------------- | -------------- |
| GET    | `ME`                               | Yes           | Returns `User` |

### Quran / Tafsir / Hadith

| Method | Endpoint                          | Auth required | Notes                                 |
| ------ | --------------------------------- | ------------- | ------------------------------------- |
| GET    | `QURAN.SURAHS`                    | No            | Returns `Surah[]`                     |
| GET    | `QURAN.SURAH(id)`                 | No            | Returns `SurahWithAyahs`              |
| GET    | `TAFSIR.BY_AYAH(surahId, ayahId)` | No            | Tafsir text for one ayah              |
| GET    | `HADITH.COLLECTIONS`              | No            | Returns `HadithCollection[]`          |
| GET    | `HADITH.COLLECTION(id)`           | No            | Paginated `Hadith[]` for a collection |

### User content

| Method                | Endpoint      | Auth required | Notes                       |
| --------------------- | ------------- | ------------- | --------------------------- |
| GET/POST/DELETE       | `BOOKMARKS`   | Yes           | User's saved ayahs/hadith   |
| GET/POST/PATCH/DELETE | `NOTES`       | Yes           | User's personal notes       |
| GET/POST/PATCH/DELETE | `COLLECTIONS` | Yes           | Grouping of bookmarks/notes |

### Other

| Method | Endpoint       | Auth required | Notes                                       |
| ------ | -------------- | ------------- | ------------------------------------------- |
| GET    | `PRAYER_TIMES` | No            | Query params TBD (lat/lng or city)          |
| GET    | `SEARCH`       | No            | Query params TBD (query, scope, pagination) |

## Changelog & Deprecation Policy

- New endpoints: add to the reference table above and to
  `src/constants/api.ts` in the same PR.
- Changed response shape: update the corresponding type in `src/types/*`
  and this doc together — a type change with no doc update is a review
  blocker.
- Deprecated endpoints: mark with `~~strikethrough~~` and a one-line reason
  - removal target date here before removing from `API_ENDPOINTS`. Give
    consumers at least one release cycle of overlap.
