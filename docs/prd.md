# Product Requirements Document (PRD)

**Status:** Draft — inferred from the scaffolded `src/features/*` structure and
placeholder constants (routes, roles, languages) already in the codebase.
Everything in this document should be reviewed and corrected by product
ownership; treat it as a starting point to argue with, not a finished spec.

## 1. Product Overview

**Sirat** is an all-in-one Islamic digital platform following authentic
Sunni Islam: Quran, Hadith, Tafsir, Prayer, AI Q&A, Community, Learning,
and a Scholar Portal, plus a personal layer (bookmarks, notes, collections)
so a user can build their own study trail through the content.

It ships as two clients against one shared backend API:

- **Web app** (this repo) — Next.js, the primary entry point for most
  users, server-rendered where it helps SEO/speed.
- **Mobile app** — Flutter (iOS + Android), offline-first for core
  content. Built and maintained separately; **not** part of this repo —
  nothing here should assume a Flutter build step or Dart code lives
  alongside the Next.js app. Design tokens (color/typography/spacing) are
  intended to be mirrored between both clients — see
  [design.md](./design.md) — but implementation is independent per
  platform.

**Non-negotiable product requirements** (apply to the web client in this
repo):

- **Fast**: sub-second perceived load, skeleton states (not spinners),
  aggressive caching/static generation for content that doesn't change
  per request.
- **Fully responsive**: verified at real breakpoints — 360px, 768px,
  1024px, 1440px+ — not just an arbitrarily resized browser window.
- **Arabic/RTL correctness** wherever Quran/Hadith text appears, even
  nested inside an otherwise LTR interface — see
  [ui-ux/README.md#internationalization--rtl](./ui-ux/README.md#internationalization--rtl).
- **Premium visual bar**: dark mode as the default (light mode available
  via toggle), glassmorphism accents, smooth micro-interactions, generous
  spacing — the reference points are Notion/Linear/Stripe/Arc, not a
  cluttered or gaudy consumer app. See [design.md](./design.md) and
  [ADR-0008](./decisions/0008-dark-mode-glassmorphism-design.md).

## 2. Target Users

- **Everyday practicing Muslims** wanting daily tools: prayer times, qibla,
  azkar/duas, a Hijri calendar.
- **Students of knowledge** wanting to read/search Quran, tafsir, and
  graded hadith, and to save/annotate what they find.
- **Non-Arabic speakers** (English, Urdu at minimum — see
  `src/constants/languages.ts`) who need translation and transliteration
  alongside the original Arabic text.
- **Admins/moderators** managing reported content and user-generated
  content quality (see `ROLES.ADMIN`/`ROLES.MODERATOR` in
  `src/constants/roles.ts`).

## 3. Goals

- Provide accurate, properly-attributed religious content (Quran text,
  translations, tafsir, graded hadith) — accuracy and sourcing are
  non-negotiable product requirements, not just content-team concerns (see
  [docs/ui-ux/README.md#content--tone](./ui-ux/README.md#content--tone)).
- Make daily practice frictionless: prayer times and qibla should work
  correctly with minimal setup (location permission), azkar/duas should be
  quick to reach.
- Let users build a personal relationship with the content over time
  (bookmarks, notes, collections) rather than being a one-shot lookup tool.
- Support Arabic-script content and RTL layout as a first-class citizen,
  not a translated afterthought — see
  [docs/ui-ux/README.md#internationalization--rtl](./ui-ux/README.md#internationalization--rtl).

## 4. Non-Goals (for now)

- Community/forum, Learning (courses), Scholar Portal, and Kids Mode are
  confirmed as **later-phase** modules (see [phases.md](./phases.md)'s
  Phase 6+), not part of the initial (V1) build — don't start them before
  the V1 phases are complete.
- Full offline-first sync — an offline reading cache may be a later phase,
  not an MVP requirement for the web client (the Flutter mobile app has
  its own offline-first requirement, independent of this repo).
- Payments/donations processing (`src/services/payments/` is scaffolded
  for future use, not part of the initial phases — see
  [phases.md](./phases.md)).
- Building or maintaining the Flutter mobile app from this repo — see
  Product Overview above.

## 5. Core Feature Areas

Mapped to `src/features/*`:

| Feature folder                | User-facing capability                                                                                            |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `quran`                       | Browse/read surahs and ayahs, translation + transliteration                                                       |
| `tafsir`                      | Read tafsir per ayah, with source/author attribution                                                              |
| `hadith`                      | Browse hadith collections, read hadith with grading + narrator                                                    |
| `seerah`                      | Biography of the Prophet ﷺ, structured reading                                                                    |
| `fiqh`                        | Jurisprudence reference content, likely school-of-thought aware                                                   |
| `prayer`                      | Prayer times based on location                                                                                    |
| `qibla`                       | Qibla direction (compass), based on location                                                                      |
| `calendar`                    | Hijri calendar, notable dates                                                                                     |
| `azkar`                       | Daily remembrance/dhikr collections                                                                               |
| `duas`                        | Supplication library, likely categorized by occasion                                                              |
| `bookmarks`                   | Save any content unit (ayah, hadith, dua, ...) for later                                                          |
| `notes`                       | Personal annotations attached to saved content                                                                    |
| `collections`                 | User-defined groupings of bookmarks/notes                                                                         |
| `search`                      | Cross-content search (Quran, tafsir, hadith, duas, ...)                                                           |
| `ai`                          | AI Q&A over Quran/hadith/tafsir content (scope TBD — needs its own ADR before implementation, see Open Questions) |
| `analytics`                   | Usage analytics (internal, not user-facing)                                                                       |
| `notifications`               | Prayer-time reminders, azkar reminders, app notices                                                               |
| `profile`                     | User profile management                                                                                           |
| `settings`                    | Language, theme, notification preferences                                                                         |
| `downloads`                   | Offline content download (audio, text packs)                                                                      |
| `feedback`                    | User feedback/bug reports                                                                                         |
| `reports`                     | Content moderation reports (flagging user-generated content)                                                      |
| `admin`                       | Moderator/admin console                                                                                           |
| `community` _(Phase 6+)_      | Forum/discussion — not scaffolded yet, later phase                                                                |
| `learning` _(Phase 6+)_       | Structured courses — not scaffolded yet, later phase                                                              |
| `scholar-portal` _(Phase 6+)_ | Verified-scholar tools/console — not scaffolded yet, later phase                                                  |
| `kids-mode` _(Phase 6+)_      | Child-safe experience — not scaffolded yet, later phase                                                           |

**This table is a placeholder scope statement, not a committed feature
list.** Confirm with product ownership which of these are MVP vs. later
phase — see [phases.md](./phases.md) for the confirmed frontend build
order (strict phase gating — later phases don't start until the current
one's deliverable is confirmed).

## 6. Roles & Permissions

Defined in `src/constants/roles.ts` / `permissions.ts`:

- `guest` — read-only access to public content, no personalization
- `user` — full personalization (bookmarks, notes, collections, profile)
- `moderator` — content moderation, reports review
- `admin` — full access, including user management

See [docs/security/README.md#authorization](./security/README.md#authorization)
for the critical caveat that these are UI-layer concerns — backend
authorization must independently enforce the same rules.

## 7. Key Constraints

- **Multilingual + RTL** from day one (English, Arabic, Urdu at minimum).
- **Content correctness** for religious text is a product requirement with
  real reputational/trust stakes — see
  [docs/ui-ux/README.md#content--tone](./ui-ux/README.md#content--tone).
- **Mobile-first**: prayer times/qibla/azkar are predominantly
  on-the-go, mobile use cases.
- **Backend not yet finalized** — the API contract in
  [docs/api/README.md](./api/README.md) is provisional; this PRD's feature
  list should be reconciled with actual backend capability per phase.

## 8. Success Metrics (draft — needs product input)

- Daily/weekly active use of prayer-time and azkar features (habitual-use
  proxy).
- Bookmark/note/collection creation rate (depth-of-engagement proxy).
- Search success rate (searches resulting in a saved/viewed result).
- Content-accuracy reports filed via `feedback`/`reports` (should trend
  down over time as content is verified).

## 9. Open Questions

- Which madhab(s)/school(s) of fiqh does `fiqh` content need to cover, and
  how is that reflected in the UI (a single stream vs. a school selector)?
- What's the actual scope of `ai` — summarization, semantic search,
  conversational Q&A? This has real implications for
  [docs/security/README.md](./security/README.md) (data sent to a
  third-party model) and needs its own ADR before implementation.
- Is offline support (`downloads`) an MVP requirement or later-phase?
- Source of truth for Quran/hadith/tafsir data — licensed API, self-hosted
  dataset, or a mix? This directly shapes
  [docs/api/README.md](./api/README.md)'s endpoint reference.
