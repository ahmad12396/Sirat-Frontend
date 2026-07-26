---
tags: [rules, conventions]
---

# Rules

Up: [[Sirat MOC]] · Full detail: [[Tooling]]

Fast do's/don'ts — see `docs/rules.md` for the complete version.

## Always

`env` from [[Folder Structure]]'s `config/`, never raw `process.env`. HTTP
via [[API Layer]] only. Errors via [[Error Handling]]. Endpoint constants,
not inline strings. RTL-first — [[UI-UX Guidelines]]. Both themes —
[[Design System]]. Conventional commits — [[ADR 0007 - Conventional Commits]].

## Never

Second HTTP client. Client-side role check as real security — [[Security]].
Secrets in `NEXT_PUBLIC_*`. `dangerouslySetInnerHTML` unsanitized. Log
sensitive data. Hand-edit `package-lock.json`.

## Dead code & hygiene

Delete unreachable code — don't keep "just in case." Prune unused deps in
the same PR that drops their last usage.

## Reuse before rebuild

Check for a library before hand-rolling — but don't add a library where a
platform API or short utility suffices either.

## Performance

Server Components by default, `next/dynamic` code-split, `next/image`
mandatory, deliberate memoization, virtualize long lists.

## Security / injection

SQL/NoSQL parameterized always, no shell string interpolation, validate
with `zod` at every boundary — see [[Security]].
