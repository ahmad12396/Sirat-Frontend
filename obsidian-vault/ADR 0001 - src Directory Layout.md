---
tags: [adr, accepted]
---

# ADR 0001 — src Directory Layout

Up: [[Sirat MOC]] · Implements: [[Folder Structure]]

**Decision:** all app code under `src/`, not repo root. Root reserved for
config/`docs/`/`tests/`/`.github/`.

**Why:** scaffolded with `create-next-app`'s root-level `app/`; as
`features/`, `services/`, `store/` etc. were added, root became cluttered
config-vs-code mix.

**Consequence:** `tsconfig.json`'s `@/*` → `./src/*`, `components.json` css
path updated. Low migration cost (only 3 source files at the time).
