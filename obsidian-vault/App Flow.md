---
tags: [architecture, app-flow]
---

# App Flow

Up: [[Sirat MOC]] · Code organization: [[Folder Structure]]

## Route map

`(public)` — Quran/Hadith/Tafsir/Prayer/Qibla/Calendar/Azkar/Duas/Search
(no auth needed). `(auth)` — login/register/forgot-password. `(dashboard)`
— profile/settings/bookmarks/notes/collections + `/admin`.

## Request flow

Component → [[API Layer]] (`api.get/post/...`) → `httpClient` (Axios) →
request interceptor attaches Bearer token → backend → response interceptor
clears token on 401 → on error: [[Error Handling]]'s `normalizeError` →
`AppError` → UI shows `.message`/`.fieldErrors`.

## Auth flow

Login form (zod-validated) → `AUTH.LOGIN` → `AuthTokens` → stored in
`localStorage` (flagged placeholder, see [[Security]]) → attached
automatically to future requests. No auto-redirect-on-401 guard yet.

## State management

Server state (API-originated) → `@tanstack/react-query`. Client-only state
(theme override, UI toggles) → `zustand`. Don't mix the two.

## Rendering strategy

`(public)` → Server Components + SSG/ISR where possible. `(dashboard)` →
Client Components for interactivity. `(auth)` → Client Components (forms).

## Core user journeys

Read hadith → bookmark/note. Check prayer times → enable reminders.
Study trail: read → bookmark → note → collection. Report bad content →
`feedback`/`reports` → moderator reviews via `/admin`.
