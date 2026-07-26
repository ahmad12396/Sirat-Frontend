---
tags: [adr, accepted]
---

# ADR 0007 — Conventional Commits

Up: [[Sirat MOC]] · Implements: [[Tooling]], [[CI-CD]]

**Decision:** Conventional Commits format (`type(scope?): subject`),
enforced by commitlint via a Husky `commit-msg` hook, plus a CI-side
backstop (`pr-validation.yml`) since the local hook can be bypassed with
`--no-verify`.

**Why:** consistent history enables changelog generation, filtering by
change type; unenforced conventions erode under deadline pressure.

**Consequence:** every commit needs a recognized `type:` prefix (`feat`,
`fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `ci`, `build`, ...).
