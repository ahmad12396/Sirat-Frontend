---
tags: [security, threat-model]
---

# Security

Up: [[Sirat MOC]]

## Known gaps (tracked, not silent)

1. **Auth token in `localStorage`** instead of httpOnly cookie — XSS =
   full session takeover. Deliberate early-dev tradeoff — see
   [[ADR 0004 - Centralized API Layer]]. Revisit before production
   (cookie + CSRF together).
2. No auto-redirect-to-login on 401 / no route-guard middleware yet.
3. `env.ts`'s API URL schema doesn't enforce `https://` in production.
4. No CSP header configured yet.

## Authorization

Roles/permissions (`src/constants/roles.ts`) are **UI-layer only** — see
[[PRD]]. Backend must independently re-check every privileged action.

## Input validation

All external input validated via `zod` at the boundary — forms, API
responses. See [[Rules]]'s injection section (SQL/NoSQL/command/path
traversal/SSRF).

## Content correctness

Hadith grading + source, tafsir attribution — a trust/reputation concern,
not just accuracy — see [[UI-UX Guidelines]].
