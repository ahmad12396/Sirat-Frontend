---
tags: [product, phases, roadmap]
---

# Phases

Up: [[Sirat MOC]] · Product scope: [[PRD]]

**Strict gating: one phase at a time.** Frontend/web only — see [[App Flow]].

## Phase 0

Foundation & design system. Infra done (tooling, env validation, API layer,
error handling — see [[Tooling]], [[API Layer]], [[Error Handling]]).
Design tokens done ([[Design System]], [[ADR 0008 - Dark Mode Glassmorphism Design]]).
Base components done (Button/Card/Input/Dialog/Skeleton/Switch/Tabs/Header).
Remaining: breakpoint verification. **← we are here**, see [[Memory Status]].

## Phase 1

App shell & navigation: top nav, sidebar, auth UI (mocked), routing skeleton.

## Phase 2

Quran Reader — the flagship screen. Surah list, ayah reader (RTL-correct —
[[UI-UX Guidelines]]), word-by-word, reading settings.

## Phase 3

Prayer, Bookmarks, Notes — daily-use utility screens.

## Phase 4

Performance & responsiveness pass — Lighthouse 90+, SSG, CLS, bundle size.
See [[Tooling]]'s performance rules.

## Phase 5

Search, Settings, Profile — V1 feature-complete.

## Phase 6+

Hadith, Tafsir, AI Q&A (own ADR needed — [[Security]]), Community, Learning,
Scholar Portal, Kids Mode. Not before Phase 0-5 done.

## Related

[[Deployment]] — the branch → environment mapping (develop/release/main)
these phases deploy through.
