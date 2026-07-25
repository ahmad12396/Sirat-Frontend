# Error Handling & Logging

## Logging (`src/lib/logger/logger.ts`)

**Rule: use `logger`, not `console.*`, directly in app code.**

A single `logger` object (`debug/info/warn/error`) is the one place that
touches `console`. `debug` is suppressed outside development
(`env.NODE_ENV`). When a monitoring platform (Sentry or similar) is
introduced, the transport swap happens once inside `logger.ts`'s internal
`write()` function — every call site in the app is unaffected.

```ts
logger.info("User bookmarked an ayah", { userId, ayahId });
logger.error("Failed to load surah", error, { surahId });
```

## Errors (`src/lib/errors/`)

**Rule: normalize unknown errors into `AppError` before showing or logging
them.** Don't branch on raw Axios/Zod/native errors in UI code.

- **`ErrorCodes.ts`** — `ERROR_CODES` (`VALIDATION_ERROR`, `UNAUTHORIZED`,
  `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `RATE_LIMITED`, `NETWORK_ERROR`,
  `INTERNAL_ERROR`, `UNKNOWN_ERROR`) and their default HTTP status mapping.
- **`AppError.ts`** — the one error class the app throws/catches. Carries
  `code`, `statusCode`, optional `fieldErrors` (for form validation), and an
  `isOperational` flag. Static factories (`AppError.unauthorized()`,
  `.forbidden()`, `.notFound()`, `.validation()`) cover the common cases —
  add a new factory here rather than a new subclass elsewhere.
- **`error-handler.ts`**:
  - `normalizeError(error: unknown): AppError` — converts a `ZodError`, an
    Axios error (network failure vs. `401/403/404/422/other`, using the
    backend's `ApiErrorResponse` shape), a plain `Error`, or a total
    unknown value into an `AppError`.
  - `handleError(error: unknown): AppError` — normalizes _and_ logs via
    `logger.error`, then returns the `AppError` for the caller to act on
    (e.g. show `err.message` in a toast, or `err.fieldErrors` next to form
    fields).

```ts
try {
  await api.post(API_ENDPOINTS.AUTH.LOGIN, payload);
} catch (e) {
  const err = handleError(e);
  toast.error(err.message);
}
```

## Why centralize this

Without a single error type, every feature ends up with its own ad hoc
`catch (e: any)` and its own idea of what a "not found" or "unauthorized"
error looks like. Centralizing means:

- One place to change how errors reach Sentry/monitoring.
- One shape (`AppError`) that UI components, forms, and toasts can rely on.
- New backend error formats only require updating `normalizeError`, not
  every call site.
