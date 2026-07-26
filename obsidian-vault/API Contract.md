---
tags: [api, contract, backend]
---

# API Contract

Up: [[Sirat MOC]] · Client side: [[API Layer]]

Base URL: `NEXT_PUBLIC_API_URL` — never hardcoded. Endpoint paths in
`src/constants/api.ts`.

## Auth

Bearer token via request interceptor — see [[API Layer]]. 401 clears token,
propagates as `AppError` (`UNAUTHORIZED`) — see [[Error Handling]]. Refresh
endpoint defined but not auto-wired yet.

## Error format

`ApiErrorResponse` (`{success:false, message, errors?}`) → normalized into
`AppError` — table of HTTP status → error code in [[Error Handling]].

## Pagination

`PaginatedResponse<T>` = `{data: T[], meta: {page, pageSize, total, totalPages}}`.

## Versioning

URL-prefix strategy (`/v1/...`) via the base URL env var — not yet real
since no backend exists.

## Status

Provisional — endpoint reference is a placeholder until the real backend
contract is finalized. See [[PRD]]'s open questions.
