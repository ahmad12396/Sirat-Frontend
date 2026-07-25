# Project Phases — Frontend Build Order

**This is the confirmed, strict build order for the web (Next.js) client.**
Build one phase at a time. Do not start a phase until the previous one's
deliverable is functionally complete and confirmed — don't jump ahead to
later-phase modules (Hadith, Tafsir, AI Q&A, Community, Learning, Scholar
Portal, Kids Mode) while an earlier phase is still in progress.

Scope reminder: **frontend only, web (Next.js) only, in this repo.** The
Flutter mobile app is a separate client built elsewhere — see
[prd.md](./prd.md#1-product-overview). Don't fabricate religious content
(Quran/Hadith/Tafsir text or Hadith grading) — use placeholder/mock data
shaped like the real [API contract](./api/README.md) until real content is
provided, flagged with `// TODO: confirm API contract` wherever the shape
is a guess.

- [Phase 0 — Foundation & Design System](#phase-0--foundation--design-system)
- [Phase 1 — App Shell & Navigation](#phase-1--app-shell--navigation)
- [Phase 2 — Quran Reader](#phase-2--quran-reader-the-core-screen)
- [Phase 3 — Prayer, Bookmarks, Notes](#phase-3--prayer-bookmarks-notes)
- [Phase 4 — Performance & Responsiveness Pass](#phase-4--performance--responsiveness-pass)
- [Phase 5 — Search, Settings, Profile](#phase-5--search-settings-profile)
- [Phase 6+ — Expansion](#phase-6--expansion)

---

## Phase 0 — Foundation & Design System

**Goal:** a codebase and design system ready for screen-building, with
conventions enforced, not just documented.

**Infrastructure** (complete):

- [x] `src/` layout, tooling (ESLint/Prettier/Husky/commitlint/`.vscode/`)
- [x] Env validation, centralized API layer, error handling, logging
- [x] Shared constants/types, full `docs/` set

**Design system** (in progress — this is the active phase):

- [ ] Dark-mode-default, glassmorphism-accented design tokens in
      `src/app/globals.css` (color, typography, spacing, radius, shadow) —
      see [design.md](./design.md) and
      [ADR-0008](./decisions/0008-dark-mode-glassmorphism-design.md)
- [ ] Base components: Button, Card, Input, Modal/Sheet, Skeleton loader,
      Toggle (dark/light), Tabs, Top nav — each in its own
      `src/components/ui/<name>/` folder per
      [folder-structure.md](./architecture/folder-structure.md)
- [ ] Responsive breakpoint system verified at 360px / 768px / 1024px /
      1440px+ for every base component, in every state (default, hover,
      active, disabled, loading)
- [ ] Component preview page showing every base component in every state

**Exit criteria:** the preview page renders every base component
correctly, in both themes, at all four breakpoints, before Phase 1 starts.

## Phase 1 — App Shell & Navigation

**Goal:** a navigable shell; every route reachable, nothing behind it yet.

- [ ] Sticky top nav, collapsible sidebar, responsive hamburger menu at
      mobile widths, dark/light toggle wired to the real `ThemeProvider`
- [ ] Routing skeleton for every Phase 1–3 page (empty placeholders are
      fine at this point) — route groups per
      [architecture.md#route-map](./architecture.md#route-map)
- [ ] Auth UI only — login, signup, forgot-password screens calling a
      **mocked** auth API (no real backend auth logic; see
      [api-layer.md](./architecture/api-layer.md) for how the API layer
      itself is structured so the mock is a drop-in swap later)

**Exit criteria:** every route in the sitemap is reachable and responsive;
auth screens work end-to-end against mock data.

## Phase 2 — Quran Reader (the core screen)

**Goal:** the flagship reading experience, polished enough to be
indistinguishable from the final product once real content is wired in.

- [ ] Surah list screen (searchable, filterable)
- [ ] Surah detail / ayah reader: Arabic text (correct RTL rendering per
      [ui-ux/README.md#internationalization--rtl](./ui-ux/README.md#internationalization--rtl)),
      translation toggle, per-ayah audio play button, bookmark icon, note
      icon
- [ ] Word-by-word expandable view per ayah, against mocked word-level data
- [ ] Reading settings: font size, translation language selector, reciter
      selector (UI only, mocked data)

**Exit criteria:** fully responsive Quran reading flow, working end-to-end
on mock content, in both themes and at all breakpoints.

## Phase 3 — Prayer, Bookmarks, Notes

**Goal:** the daily-use utility screens.

- [ ] Prayer times: today's times, next-prayer countdown, location
      selector (UI only, mock geolocation/calculation)
- [ ] Qibla: compass UI (mock heading data acceptable if native sensor
      access isn't wired yet)
- [ ] Bookmarks: list of saved ayahs, grouped/sortable
- [ ] Notes: list + detail view, simple rich-text or plain-text editor

**Exit criteria:** all four screens responsive, wired to mock data, with
realistic loading/empty/error states (using the `AppError`/logger pattern
from [error-handling.md](./architecture/error-handling.md)).

## Phase 4 — Performance & Responsiveness Pass

**Goal:** verify the V1 surface actually meets the non-negotiable
performance bar before adding more screens.

- [ ] Lighthouse audit on every screen built so far — target 90+ on
      Performance, Accessibility, Best Practices
- [ ] Convert static content pages to SSG where applicable — see
      [architecture.md#rendering-strategy](./architecture.md#rendering-strategy)
- [ ] Image/audio lazy-loading verified (`next/image`, audio elements)
- [ ] Zero unexpected layout shift (CLS), especially on the Quran reader
      as Arabic text/fonts load
- [ ] Bundle-size check per [rules.md#performance](./rules.md#performance--keep-the-app-fast)

**Exit criteria:** a performance report with fixes applied, not just
findings — this phase produces a document AND the corrections it calls for.

## Phase 5 — Search, Settings, Profile

**Goal:** V1 feature-complete.

- [ ] Global search UI (search bar, results, filters) against a mocked
      search API
- [ ] Settings: account, notification preferences, appearance, language
- [ ] Profile: basic info, reading stats/progress placeholders

**Exit criteria:** full V1 frontend feature set complete, responsive, and
performant per Phase 4's bar.

## Phase 6+ — Expansion

**Do not start until every V1 phase above (0–5) is fully done.** Each
becomes its own mini-phase, following the same shell → core screen →
secondary screens → performance-pass pattern as V1:

- Hadith module UI
- Tafsir module UI
- AI Q&A chat UI _(needs its own ADR before implementation — see
  [prd.md#9-open-questions](./prd.md#9-open-questions), data sent to a
  third-party model has security implications — see
  [docs/security/README.md](./security/README.md))_
- Community/forum UI
- Learning/courses UI
- Scholar Portal UI
- Kids Mode UI

---

## Per-Phase Output Expectations

Before writing code for a phase:

1. List exactly which screens/components will be built.
2. State the mock data shape assumed for each screen (a TypeScript
   `interface`/`type` in `src/types/`, matching
   [docs/api/README.md](./api/README.md) as closely as possible).
3. Flag ambiguous design decisions and pick a sensible default rather than
   stopping to ask — unless it's a genuinely irreversible structural
   choice, in which case write an ADR
   ([docs/decisions/](./decisions/README.md)) or ask.

After writing code for a phase:

1. Summarize what was built and where (file paths).
2. List what remains mock/placeholder vs. real.
3. Note any performance or accessibility concern found during the build.
4. Update [memory.md](./memory.md)'s Completed/In Progress/Not Started
   sections to match reality.
