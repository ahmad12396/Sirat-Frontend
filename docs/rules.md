# Rules — What To Do, What To Avoid

A single, skimmable reference distilled from `docs/architecture/`,
`docs/security/`, and `docs/ui-ux/`. When in doubt, this is the fast
answer; the linked docs have the full reasoning. Both humans and AI coding
assistants working in this repo should treat this file as the first thing
to check before writing code, and the checklist to run before opening a PR.

- [Always Do](#always-do)
- [Never Do](#never-do)
- [Dead Code & Hygiene](#dead-code--hygiene)
- [Reuse Before You Rebuild](#reuse-before-you-rebuild)
- [Performance — Keep The App Fast](#performance--keep-the-app-fast)
- [Security — Injection & Beyond](#security--injection--beyond)
- [Escalate, Don't Guess](#escalate-dont-guess)

---

## Always Do

- **Import `env` from `@/config/env`** for any configuration value. Never
  read `process.env` directly outside `src/config/env.ts` — enforced by
  ESLint. → [environment.md](./architecture/environment.md)
- **Call the backend through `@/lib/api`** (`api.get/post/put/patch/delete`).
  Never instantiate `axios` or call `fetch` elsewhere. →
  [api-layer.md](./architecture/api-layer.md)
- **Use endpoint constants** from `src/constants/api.ts`, not inline path
  strings.
- **Normalize errors** with `handleError`/`normalizeError` from
  `@/lib/errors/error-handler` before showing or acting on them. →
  [error-handling.md](./architecture/error-handling.md)
- **Log through `@/lib/logger`**, never raw `console.*`, in app code.
- **Validate all external input** (forms, API responses, query params)
  with `zod` before using it, at the boundary where it enters the app.
- **Put domain code in `src/features/<name>/`**; put shared, domain-agnostic
  UI in `src/components/`. → [folder-structure.md](./architecture/folder-structure.md)
- **Reuse the constants** already defined for routes, roles, permissions,
  languages, theme, and storage keys (`src/constants/*`) instead of
  re-declaring string literals.
- **Design RTL-first** for anything rendering Arabic/Urdu text: logical
  CSS properties (`ms-*`/`me-*`), per-block `dir`, test with `dir="rtl"`. →
  [ui-ux/README.md#internationalization--rtl](./ui-ux/README.md#internationalization--rtl)
- **Support both light and dark theme** for any new UI.
- **Write Conventional Commit messages** (`feat:`, `fix:`, `chore:`, ...) —
  enforced by commitlint on commit.
- **Update the relevant doc in the same PR** as the code change it
  describes (API contract, ADR, architecture doc) — a stale doc is worse
  than no doc.
- **Write an ADR** (`docs/decisions/`) for a decision that's hard to
  reverse, cross-cutting, or non-obvious in hindsight.
- **Attribute religious content properly**: hadith grading + source,
  tafsir author/source, never presenting translation as the primary text.
  → [ui-ux/README.md#content--tone](./ui-ux/README.md#content--tone)

## Never Do

- **Never access `process.env` directly** outside `src/config/env.ts`.
- **Never instantiate a second HTTP client** (Axios instance, raw
  `fetch`) — everything routes through `src/lib/api`.
- **Never trust a client-side role check as security.** `ROLE_PERMISSIONS`
  is UI-only; the backend must independently authorize every privileged
  action. → [security/README.md#authorization](./security/README.md#authorization)
- **Never put a secret in a `NEXT_PUBLIC_*` variable.** Anything with that
  prefix ships to the browser.
- **Never use `dangerouslySetInnerHTML`** without a sanitizer, and avoid it
  entirely unless there's no alternative.
- **Never log sensitive data** (passwords, tokens, full card numbers) —
  not even at `debug` level.
- **Never hand-edit `package-lock.json`** — let `npm install`/`npm ci`
  regenerate it.
- **Never `git commit --no-verify`** to skip lint/commitlint hooks without
  a clearly stated reason in the PR.
- **Never hardcode a color/spacing value that bypasses the `globals.css`
  design tokens** when an existing token covers the need.
- **Never mix icon sets** — `lucide-react` only.
- **Never store sensitive data client-side beyond what's necessary** for
  the current session (see the `localStorage` auth-token caveat in
  [security/README.md](./security/README.md)).
- **Never delete an ADR when superseded** — mark it `Superseded by
ADR-000N` and link forward.

## Dead Code & Hygiene

Unused code isn't neutral — it's a maintenance and security liability
someone eventually has to re-audit to confirm it's really unused.

- **Before finishing a change, check for anything you made unreachable**:
  unused imports, exports nothing imports, components no route renders,
  now-dead feature flags/branches, commented-out old implementations. Delete
  them — don't leave them "in case we need it later"; git history already
  remembers.
- **Run `npm run lint` before considering work done** — ESLint's
  unused-vars/unused-imports checks are the first line of defense; don't
  suppress a warning with `eslint-disable` when the fix is just deleting
  the dead code.
- **Don't keep a re-export or shim "for backwards compatibility"** unless
  something outside this repo actually depends on it. An internal-only
  app has no external consumers to protect.
- **A `.gitkeep` file next to real content in the same folder is a smell**
  — remove it once the folder has actual files (see
  [folder-structure.md](./architecture/folder-structure.md)).
- **Prune dependencies you stop using** (`package.json`) in the same PR
  that removes their last usage — an unused dependency still ships in
  `node_modules`, still gets audited for vulnerabilities, and still
  confuses the next person wondering why it's there.

## Reuse Before You Rebuild

- **Before writing a non-trivial utility, check if a well-maintained
  library already solves it** (date math → `date-fns`, schema validation →
  `zod`, forms → `react-hook-form`, HTTP → the existing `axios` layer,
  animation → `framer-motion`/`tw-animate-css`, variants → `cva`). Hand-rolled
  reimplementations of solved problems are a recurring source of subtle bugs
  (timezone handling, Unicode/RTL string edge cases, debounce/throttle
  correctness) that a mature library has already hardened against.
- **The bar for a new dependency**: it should replace _more_ custom code
  than it adds in API-surface complexity, be actively maintained, and not
  duplicate something already in `package.json`. Two libraries doing the
  same job (e.g. two date libraries) is a bug, not a choice.
- **Prefer the platform when it's sufficient**: don't reach for a library
  for something `Intl`, the Fetch/URL APIs, or modern CSS already do well
  natively — an extra dependency has a real cost (bundle size, supply-chain
  surface, upgrade churn) even when it "just works."
- **This cuts both ways** — also don't add a heavy library for something a
  short, well-tested utility function in `src/lib/helpers/` would cover
  just as correctly. Judge by problem complexity, not by default instinct
  in either direction.

## Performance — Keep The App Fast

- **Default to Server Components** for content that doesn't need
  interactivity or client-only state; only opt into `"use client"` where
  it's actually needed (forms, hooks, event handlers, browser-only APIs).
  See [rendering strategy](./architecture.md#rendering-strategy).
- **Code-split anything heavy and not needed on first paint**
  (`next/dynamic` for large client-only widgets — charts, rich editors,
  admin-only panels) rather than bundling it into the main chunk every
  visitor downloads.
- **Use `next/image`** for all images — it isn't optional. Manual `<img>`
  tags skip automatic sizing, lazy loading, and format optimization.
- **Memoize deliberately, not reflexively** — `useMemo`/`useCallback`/
  `React.memo` are for measured hot paths (expensive computation, large
  list re-renders), not a default wrapper on every function and value.
  Unnecessary memoization adds complexity without a measured benefit.
- **Watch list rendering**: paginate or virtualize long lists (surah
  ayahs, hadith collections, search results) instead of rendering
  thousands of DOM nodes at once — see
  [pagination conventions](./api/README.md#pagination).
- **Keep the dependency graph lean**: a large, rarely-used dependency
  pulled into a shared/high-traffic route (e.g. the landing page) hurts
  every visitor's load time. Check bundle impact before adding a heavy
  library to a commonly-visited page.
- **Avoid layout thrash and unnecessary client-side data fetching
  waterfalls** — fetch what a page needs in parallel, not as a chain of
  sequential `await`s where the second request doesn't actually depend on
  the first's result.
- **Debounce/throttle** expensive handlers (search-as-you-type, scroll
  listeners, resize handlers) instead of running them on every event.

## Security — Injection & Beyond

This section is a quick-reference; the full model lives in
[docs/security/README.md](./security/README.md).

- **SQL / query injection**: if any server-side code in this repo (Next.js
  route handlers, a future backend) builds a database query, it must use
  parameterized queries or a query builder/ORM (e.g. Prisma, Drizzle) —
  never string-concatenate user input into a SQL string, ever, under any
  urgency.
- **NoSQL injection**: the same rule applies to Mongo-style query objects —
  never pass a raw user-supplied object directly as a query filter; validate
  its shape with `zod` first so an attacker can't inject operators like
  `$where`/`$gt` where a plain value is expected.
- **Command injection**: never pass user input to a shell command,
  `child_process.exec`, or similar without strict allow-listing/escaping —
  prefer APIs that take arguments as an array (`execFile`) over a
  shell string.
- **XSS**: see [security/README.md#cross-site-scripting-xss](./security/README.md#cross-site-scripting-xss) —
  no `dangerouslySetInnerHTML` without sanitization, no unvalidated user
  content in URLs (`javascript:` scheme, etc.).
- **Path traversal**: never build a filesystem path from unvalidated user
  input (e.g. a "download this file" feature) without normalizing and
  confirming the resolved path stays inside the expected directory.
- **SSRF**: if a server-side feature ever fetches a URL supplied by a
  user (e.g. fetching a remote image/link preview), validate/allow-list
  the target — don't let user input control what internal or external
  host the server calls.
- **Every input validation and injection concern above starts with the
  same habit**: validate shape and content with `zod` at the boundary
  (see [Input Validation](./security/README.md#input-validation)) before
  the value touches a query, a shell, a filesystem path, or a URL.

## Escalate, Don't Guess

If you hit one of these, stop and ask rather than picking an approach
unilaterally:

- Introducing a new external service/SDK (analytics, payments, AI
  provider) — has security and cost implications.
- Changing the auth/session mechanism (e.g. the `localStorage` → cookie
  migration flagged in [security/README.md](./security/README.md)).
- Adding a new top-level dependency for state management, data fetching,
  or styling that overlaps with an existing choice (Zustand, React Query,
  Tailwind).
- Any change to how religious content (Quran/hadith/tafsir) is sourced,
  graded, or attributed.
- Any server-side code that constructs a database query, shell command, or
  filesystem path from user input — get a second look before merging, not
  after.
