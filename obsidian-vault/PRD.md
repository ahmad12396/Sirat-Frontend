---
tags: [product, prd]
---

# PRD

Up: [[Sirat MOC]]

**Sirat** — all-in-one Islamic platform (authentic Sunni Islam): Quran,
Hadith, Tafsir, Prayer, AI Q&A, Community, Learning, Scholar Portal, plus a
personal layer (bookmarks, notes, collections).

Two clients, one backend: **web** (this repo, Next.js — see [[App Flow]])
and **mobile** (Flutter, separate repo, not built here).

## Non-negotiable requirements

- Fast: skeleton states, static generation where possible — see [[Tooling]]
- Fully responsive: 360/768/1024/1440px
- Arabic/RTL correct wherever Quran/Hadith text appears — see [[UI-UX Guidelines]]
- Premium: dark-mode-default, glassmorphism — see [[Design System]], [[ADR 0008 - Dark Mode Glassmorphism Design]]

## Target users

Everyday practicing Muslims (prayer/qibla/azkar), students of knowledge
(Quran/tafsir/hadith study), non-Arabic speakers (en/ar/ur), moderators/admins.

## Feature areas → build order

See [[Phases]] for the confirmed sequencing. Community/Learning/Scholar
Portal/Kids Mode are Phase 6+, not MVP.

## Roles

guest / user / moderator / admin — defined in `src/constants/roles.ts`.
Client-side only; backend must independently enforce — see [[Security]].

## Open questions

- Fiqh madhab coverage
- AI Q&A scope (needs its own ADR — see [[Security]] re: third-party model data)
- Offline support scope
- Quran/hadith/tafsir data source (licensed API vs self-hosted)
