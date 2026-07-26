---
tags: [adr, accepted]
---

# ADR 0004 — Centralized API Layer

Up: [[Sirat MOC]] · Implements: [[API Layer]]

**Decision:** all HTTP through `src/lib/api/` — one Axios instance, shared
interceptors, typed wrappers. No feature instantiates its own client.

**Why:** dozens of planned features (see [[PRD]]) would otherwise each grow
inconsistent base-URL/auth/error handling — a global change (retry policy,
auth swap) would become an N-file change instead of 1.

**Consequence:** endpoint paths centralized ([[API Contract]]); auth-token
handling is one interceptor (currently `localStorage` — flagged placeholder
in [[Security]]).
