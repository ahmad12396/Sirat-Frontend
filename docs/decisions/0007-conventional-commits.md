# ADR-0007: Enforce Conventional Commits via commitlint + Husky

**Status:** Accepted
**Date:** 2026-07-26

## Context

Commit history is one of the cheapest sources of project history there
is — if it's consistent. Free-form commit messages ("fix stuff", "wip",
"final final v2") make it hard to generate changelogs, hard to spot what
kind of change a commit is at a glance, and hard to script anything against
history (e.g. automated changelog generation, semantic version bumps).

## Decision

Adopt the [Conventional Commits](https://www.conventionalcommits.org/)
format (`type(scope?): subject`, e.g. `feat: add qibla compass`,
`fix(api): handle 401 on token refresh`) and enforce it mechanically:
`commitlint.config.js` extends `@commitlint/config-conventional`, and a
Husky `commit-msg` hook (`.husky/commit-msg`) runs `commitlint --edit`
against every commit message, rejecting non-conforming ones before the
commit is created.

## Alternatives considered

- **Document the convention, don't enforce it** — rejected per the
  project's general stance (see [tooling.md](../architecture/tooling.md))
  that conventions without enforcement erode under deadline pressure.
- **Enforce only in CI, not locally** — rejected as the primary
  mechanism. CI enforcement alone means a bad message is only caught after
  push (and possibly after review comments reference the "wrong" commit),
  whereas a local `commit-msg` hook catches it before the commit exists.
  CI enforcement (re-checking commit messages in the PR) is still a
  reasonable defense-in-depth addition, since local hooks can be bypassed
  with `--no-verify`.

## Consequences

- Every commit message must declare a `type` (`feat`, `fix`, `chore`,
  `docs`, `refactor`, `test`, `perf`, `ci`, `build`, etc.) — contributors
  unfamiliar with the convention will hit a rejected commit until they
  adjust, which is the intended friction.
- Commit history becomes machine-parseable, enabling future automation:
  changelog generation, semantic-release-style version bumps, or
  filtering history by change type.
- `git commit --no-verify` still bypasses this — it's a safety net, not a
  hard guarantee. Treat a bypassed hook as something to flag in review,
  not something the tooling can fully prevent.
