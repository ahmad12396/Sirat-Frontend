---
tags: [architecture, api, http]
---

# API Layer

Up: [[Sirat MOC]] · Decision: [[ADR 0004 - Centralized API Layer]] · Contract: [[API Contract]]

**Rule: every HTTP request goes through `@/lib/api`.** No raw `axios`/`fetch`
elsewhere — see [[Rules]].

- `client.ts` — single Axios instance, base URL from `env.NEXT_PUBLIC_API_URL`
- `interceptors.ts` — request: attach Bearer token from `localStorage`
  (`STORAGE_KEYS.AUTH_TOKEN`, placeholder — see [[Security]]). Response:
  clear token on 401.
- `api.ts` — typed `api.get/post/put/patch/delete<T>()` wrappers
- `index.ts` — public surface (`api`, `httpClient`)

Endpoint paths live once in `src/constants/api.ts` (`API_ENDPOINTS`) — see
[[API Contract]]. Errors flow to [[Error Handling]].
