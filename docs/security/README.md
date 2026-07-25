# Security

This document is the frontend's security baseline: what's already in place,
what's a known, tracked gap, and what every contributor is expected to check
before merging. "We'll harden it later" is how gaps become incidents —
anything marked **Known Gap** below should be a tracked ticket, not a silent
TODO in someone's memory.

- [Threat Model Summary](#threat-model-summary)
- [Authentication & Session Management](#authentication--session-management)
- [Authorization](#authorization)
- [Input Validation](#input-validation)
- [Secrets & Environment Variables](#secrets--environment-variables)
- [Data Storage](#data-storage-client-side)
- [Transport Security](#transport-security)
- [Cross-Site Scripting (XSS)](#cross-site-scripting-xss)
- [Cross-Site Request Forgery (CSRF)](#cross-site-request-forgery-csrf)
- [Dependency Management](#dependency-management)
- [Logging & Error Disclosure](#logging--error-disclosure)
- [Security Review Checklist (PRs)](#security-review-checklist-prs)
- [Known Gaps](#known-gaps)

---

## Threat Model Summary

Sirat is a Next.js frontend for an Islamic knowledge/reference app (Quran,
tafsir, hadith, prayer times, personal bookmarks/notes). Primary assets to
protect:

- **User accounts** (auth credentials, session tokens)
- **User-generated content** (notes, bookmarks, collections) — private by
  default, readable only by their owner
- **Admin/moderator capabilities** — must not be reachable by a regular
  `user` role (see [Authorization](#authorization))
- **Content integrity** — hadith grading, tafsir attribution, and Quran
  text must not be alterable by unauthorized users; incorrect religious
  content is a trust/reputational risk, not just a data-integrity one

Out of scope for this document: backend/API server security, database
security, infrastructure (hosting, CDN, DNS) — those belong in
`docs/deployment/` and the backend repo's own security docs.

## Authentication & Session Management

- All authenticated requests attach a bearer token via
  `src/lib/api/interceptors.ts`; see
  [api-layer.md](../architecture/api-layer.md) and
  [docs/api/README.md](../api/README.md#authentication).
- A `401` response clears the stored token client-side. It does **not**
  currently redirect the user to `ROUTES.LOGIN` automatically — until a
  global auth guard is added, each authenticated view is responsible for
  handling an unauthenticated state.
- Password fields, tokens, and session identifiers must never be logged —
  see [Logging & Error Disclosure](#logging--error-disclosure).

> **Known Gap:** the current token is stored in `localStorage`
> (`STORAGE_KEYS.AUTH_TOKEN`). `localStorage` is readable by any script
> executing in the page, so a successful XSS becomes full session
> takeover. Before production, evaluate moving to an httpOnly, `Secure`,
> `SameSite=Strict/Lax` cookie issued by the backend, with CSRF protection
> added to match (see [CSRF](#cross-site-request-forgery-csrf)). This is
> tracked as a deliberate early-development tradeoff — see
> [ADR-0004](../decisions/0004-centralized-api-layer.md) — not an
> oversight.

## Authorization

- Roles (`src/constants/roles.ts`) and permissions
  (`src/constants/permissions.ts`) are defined client-side for UI
  purposes (showing/hiding admin/moderator affordances).
- **Client-side role checks are UX, not security.** Hiding an "Admin"
  button from a `user`-role account does not stop a malicious actor from
  calling the admin API endpoint directly. Every privileged action must be
  authorized again on the backend. Treat `ROLE_PERMISSIONS` as "what the UI
  should show", never as "what the server should trust".
- Route-level protection (redirecting unauthenticated/unauthorized users
  away from `(dashboard)`/admin routes) should live in `src/middleware/` or
  route-group layouts once implemented — currently not yet wired up.

## Input Validation

- All form input is validated with `zod` schemas
  (`react-hook-form` + `@hookform/resolvers`), colocated in
  `src/schemas/` or feature-local schema files.
- Validate **at the boundary**: parse/validate data as it enters the app
  (form submit, API response) rather than trusting it deeper in the call
  stack. A `ZodError` from a malformed API response is normalized into an
  `AppError` — see [error-handling.md](../architecture/error-handling.md)
  — rather than allowed to propagate as an unhandled exception.
- Never interpolate raw user input into a URL, HTML string, or shell
  command. Use `URLSearchParams`/router APIs for query strings and React's
  normal JSX text rendering (not `dangerouslySetInnerHTML`) for user
  content.

## Secrets & Environment Variables

- No secret (API key, private token) belongs in a `NEXT_PUBLIC_*`
  variable — anything with that prefix is bundled into client JS and
  visible to anyone. Server-only secrets must stay unprefixed and only be
  read in server-side code (route handlers, Server Components, middleware),
  never in a client component.
- All env vars are validated in `src/config/env.ts` — see
  [environment.md](../architecture/environment.md) and
  [ADR-0006](../decisions/0006-env-validation-with-zod.md). Never commit a
  real `.env`; only `.env.example` (with placeholder values) is tracked.
- Rotate any credential that is accidentally committed immediately — a
  force-push or history rewrite does not fully remove exposure once a
  secret has been pushed to a remote.

## Data Storage (Client-Side)

- `localStorage`/`sessionStorage` should hold only non-sensitive UI state
  (theme, language, recent searches — see `src/constants/storage.ts`) plus
  the auth token placeholder noted above. Do not store PII, full user
  profiles, or payment information client-side beyond what's strictly
  necessary for the current session.
- Assume anything in `localStorage` is readable by any third-party script
  that ends up on the page (a compromised dependency, an XSS). Minimize
  what's stored there accordingly.

## Transport Security

- All API calls go through `NEXT_PUBLIC_API_URL` — this **must** be an
  `https://` origin in any non-local environment. There is no code-level
  enforcement of this today (`z.url()` in `env.ts` accepts `http://` too);
  treat enforcing `https://` in production as a **Known Gap** worth a
  small follow-up (e.g. a refinement on the schema keyed off `NODE_ENV`).
- Do not disable TLS certificate validation anywhere, including in
  scripts/tooling, even temporarily for debugging.

## Cross-Site Scripting (XSS)

- Rely on React's default escaping of rendered text. Avoid
  `dangerouslySetInnerHTML` entirely; if a future feature genuinely needs
  to render backend-supplied HTML (e.g. rich-text tafsir content), it must
  go through a sanitizer (e.g. DOMPurify) applied at the point of
  rendering, not "sanitized upstream, trust it here."
- Third-party scripts (analytics, ads, embeds) must be reviewed before
  addition — each one is a potential XSS/supply-chain vector with page-wide
  reach.

## Cross-Site Request Forgery (CSRF)

- Not currently a concern in the same way it would be for cookie-based
  sessions, since auth uses a bearer token attached via JS (not an
  automatically-sent cookie). **This changes** if/when the
  [Known Gap](#authentication--session-management) around httpOnly cookies
  is addressed — cookie-based auth requires CSRF tokens (double-submit
  cookie or synchronizer token pattern) to be added at the same time, not
  after.

## Dependency Management

- Run `npm audit` regularly (currently surfaces existing moderate/high
  advisories — track remediation, don't let the count silently grow).
  Prefer `npm audit fix` for non-breaking fixes; treat
  `npm audit fix --force` as a deliberate, reviewed upgrade, not a
  reflex — it can bump major versions.
- Review new dependencies before adding them: maintenance activity,
  download counts, and whether the functionality justifies the added
  supply-chain surface. Prefer a small amount of own code over a
  dependency for trivial functionality.
- Lockfile (`package-lock.json`) is committed — never hand-edit it; let
  `npm install`/`npm ci` regenerate it.

## Logging & Error Disclosure

- `src/lib/logger/logger.ts` is the only sanctioned logging path — see
  [error-handling.md](../architecture/error-handling.md). Never log raw
  passwords, tokens, full card numbers, or other sensitive fields, even at
  `debug` level.
- User-facing error messages (surfaced via `AppError.message`) should be
  helpful but not leak internals — no raw stack traces, SQL fragments, or
  internal file paths shown to end users. That detail belongs in
  server-side logs/monitoring only.

## Security Review Checklist (PRs)

Before merging a PR that touches auth, user data, forms, or third-party
integrations, confirm:

- [ ] No new `process.env` access outside `src/config/env.ts` (enforced by
      ESLint, but double-check intent if you had to add a
      `files`-scoped override)
- [ ] No secret introduced as a `NEXT_PUBLIC_*` variable
- [ ] All new user input goes through a `zod` schema before use
- [ ] No `dangerouslySetInnerHTML` without a sanitizer
- [ ] No sensitive data newly written to `localStorage`/`sessionStorage`
- [ ] Any new privileged UI (admin/moderator affordance) has a
      corresponding backend authorization check, not just a client-side
      role check
- [ ] `npm audit` doesn't show a new high/critical advisory introduced by
      this change

## Known Gaps

Tracked here until each has a corresponding ticket/issue link:

1. Auth token stored in `localStorage` instead of an httpOnly cookie —
   see [Authentication & Session Management](#authentication--session-management).
2. No automatic redirect-to-login on `401` / no route-level auth guard in
   `src/middleware/` yet.
3. `env.ts`'s `NEXT_PUBLIC_API_URL` schema doesn't yet enforce `https://`
   in production.
4. No CSP (Content-Security-Policy) header configured yet in
   `next.config.ts` — add once third-party script/asset origins are known.
