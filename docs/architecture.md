# App Flow

This document is the **user/system flow** view of the app — how a request
moves through the system and how a user moves between screens. For the
**code-organization** view (folder structure, why we chose `src/`, the API
layer's internal files, etc.), see [docs/architecture/](./architecture/README.md) —
that folder and this file are deliberately complementary, not duplicates.

- [Route Map](#route-map)
- [Request Flow](#request-flow)
- [Auth Flow](#auth-flow)
- [State Management Flow](#state-management-flow)
- [Rendering Strategy](#rendering-strategy)
- [Core User Journeys](#core-user-journeys)

---

## Route Map

Route groups under `src/app/`, with canonical paths from
`src/constants/routes.ts`:

```
(public)         /                      Landing
                  /quran                 Quran browse/read
                  /tafsir                Tafsir
                  /hadith                Hadith
                  /seerah                Seerah
                  /fiqh                  Fiqh
                  /prayer                Prayer times
                  /qibla                 Qibla direction
                  /calendar              Hijri calendar
                  /azkar                 Azkar
                  /duas                  Duas
                  /search                Search

(auth)            /login
                  /register
                  /forgot-password

(dashboard)       /dashboard             Authenticated home
                  /dashboard/profile
                  /dashboard/settings
                  /dashboard/bookmarks
                  /dashboard/notes
                  /dashboard/collections

                  /admin                 Moderator/admin console
```

`(public)` content (Quran, hadith, tafsir, prayer, qibla, etc.) is
readable without an account — personalization (`(dashboard)`) requires
auth. Admin routes require `role >= moderator` (client-side gate only; see
[docs/security/README.md#authorization](./security/README.md#authorization)).

## Request Flow

```
Component / feature hook
        │
        ▼
  src/lib/api  (api.get/post/put/patch/delete)
        │
        ▼
  httpClient (axios instance, src/lib/api/client.ts)
        │  ── request interceptor: attach Bearer token
        ▼
  Backend API  (NEXT_PUBLIC_API_URL)
        │
        │  ── response interceptor: clear token on 401
        ▼
  Component receives typed data, or...
        │
        ▼ (on error)
  normalizeError() → AppError → handleError() logs via `logger`
        │
        ▼
  UI shows AppError.message / AppError.fieldErrors
```

See [api-layer.md](./architecture/api-layer.md),
[error-handling.md](./architecture/error-handling.md), and
[docs/api/README.md](./api/README.md) for the detail behind each step.

## Auth Flow

```
1. User submits LoginPayload (email, password) via a react-hook-form
   + zod-validated form.
2. api.post(API_ENDPOINTS.AUTH.LOGIN, payload) → AuthTokens
3. Access token stored (currently localStorage — see Known Gap in
   docs/security/README.md) under STORAGE_KEYS.AUTH_TOKEN.
4. Subsequent requests carry `Authorization: Bearer <token>` automatically
   via the request interceptor.
5. On 401: interceptor clears the token. (Planned, not yet built: redirect
   to ROUTES.LOGIN via a global auth guard / middleware.)
6. Logout: API_ENDPOINTS.AUTH.LOGOUT + clear local token + redirect to
   ROUTES.HOME.
```

`AUTH.REFRESH` is defined in `API_ENDPOINTS` but not yet wired into an
automatic refresh-on-401 flow — see
[docs/api/README.md#authentication](./api/README.md#authentication).

## State Management Flow

Two distinct kinds of state, kept deliberately separate:

- **Server state** (anything that originates from the API — surahs,
  hadith, user profile, bookmarks): owned by `@tanstack/react-query`.
  Components read/mutate through query/mutation hooks, not by manually
  `useState`-ing API responses. React Query owns caching, refetching, and
  loading/error state for this data.
- **Client state** (UI-only state with no server source of truth — theme
  override, sidebar open/closed, in-progress form drafts not yet
  submitted, transient search-input value): owned by `zustand` slices
  under `src/store/slices/`.

Rule of thumb: if the data could be refetched from the API and it would
still be correct, it's React Query's job. If it only exists client-side,
it's a Zustand slice's job. Avoid putting server data into a Zustand store
"for convenience" — that's how server/client state drifts out of sync.

## Rendering Strategy

- **`(public)` content routes** (Quran, hadith, tafsir, etc.): prefer
  Server Components + static/ISR rendering where content doesn't change
  per-request — this content is read-heavy and identical for every
  visitor, and RTL/i18n text benefits from being in the initial HTML for
  both SEO and first-paint quality.
- **`(dashboard)` routes**: Client Components where interactivity/auth
  state is required; Server Components for the parts that are just
  rendering already-known user data server-side, where feasible.
- **`(auth)` routes**: Client Components (form-heavy, no benefit from SSR
  beyond the shell).

This is a default, not a hard rule — a specific page can deviate with a
one-line justification in its own file/PR if the default doesn't fit.

## Core User Journeys

**1. Reading a hadith (guest or user)**
`/hadith` → select collection → select hadith → read text + translation +
grading + narrator chain → (if signed in) bookmark or add a note.

**2. Checking prayer times (guest or user)**
`/prayer` → grant/confirm location → see today's five prayer times +
countdown to next → (optional) enable notifications for reminders.

**3. Personal study trail (signed-in user)**
Read Quran/tafsir/hadith → bookmark specific ayah/hadith → add a personal
note → organize into a collection → revisit via `/dashboard/collections`.

**4. Reporting bad content (any user)**
Any content unit → "Report" action → `feedback`/`reports` feature →
moderator reviews via `/admin`.
