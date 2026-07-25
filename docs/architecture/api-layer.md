# API Layer

**Rule: every HTTP request goes through `@/lib/api`.** Don't instantiate
`axios`, call `fetch`, or hit an endpoint string directly from a
feature/component.

> This doc covers the client-side plumbing. For the actual backend
> contract — endpoints, auth, error format, pagination, versioning — see
> [docs/api/README.md](../api/README.md).

## Files (`src/lib/api/`)

- **`client.ts`** — the single `axios.create()` instance (`httpClient`),
  base URL from `env.NEXT_PUBLIC_API_URL`.
- **`interceptors.ts`** — registered once, as a side effect, by `api.ts`:
  - _Request_: attaches `Authorization: Bearer <token>` from
    `localStorage` (key: `STORAGE_KEYS.AUTH_TOKEN`) if present.
  - _Response_: on a `401`, clears the stored token. The error is always
    re-rejected — the interceptor does not swallow or normalize errors;
    that's `lib/errors`'s job (see [error-handling.md](./error-handling.md)).
- **`api.ts`** — the actual surface app code should call: typed
  `api.get/post/put/patch/delete<T>()`, each returning `response.data`
  directly (no `.data.data` unwrapping needed at call sites).
- **`index.ts`** — re-exports `api` (normal use) and `httpClient` (escape
  hatch for cases needing raw Axios config, e.g. multipart uploads,
  streaming, or custom retry logic).

## Usage

```ts
import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/constants/api";
import type { Surah } from "@/types/quran";

const surahs = await api.get<Surah[]>(API_ENDPOINTS.QURAN.SURAHS);
```

Always pair with the endpoint constants in `src/constants/api.ts` rather
than inlining path strings, and type the response using `src/types/`.

## Error handling

`api.*` calls throw on non-2xx responses (Axios default). Wrap calls at the
point of use and pass the caught error to `handleError` from
`@/lib/errors/error-handler` — it knows how to turn an Axios error into a
typed `AppError`. See [error-handling.md](./error-handling.md).

## Auth token (placeholder)

The interceptor currently reads/clears the token directly via
`localStorage`. Once real auth lands in `src/lib/auth/` or the auth slice in
`src/store/`, replace `getAuthToken()` in `interceptors.ts` to read from
that instead — the `localStorage` implementation is a stand-in, not the
final design.
