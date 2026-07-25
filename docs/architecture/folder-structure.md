# Folder Structure

All application code lives under `src/`. Top-level folders and their intent:

```
src/
├── app/            Next.js App Router: routes, layouts, route groups
├── assets/         Static assets imported by code (fonts, images, lottie, icons)
├── components/     Cross-cutting UI, not tied to one feature (see below)
├── features/       Domain modules — one folder per feature (see below)
├── lib/            Framework-agnostic app infrastructure (see below)
├── providers/       React context providers composed in the root layout
├── services/       Integrations with external systems (see below)
├── store/          Zustand slices + store hooks
├── hooks/          Shared React hooks not specific to one feature
├── config/         Runtime configuration, starting with env.ts
├── constants/      App-wide constant values (see docs/architecture/overview.md)
├── styles/         Global CSS beyond app/globals.css (themes, typography, animations)
├── types/          Shared TypeScript types/interfaces
├── i18n/           Translation resources and locale config
├── middleware/     Next.js middleware (auth guards, locale detection, etc.)
├── schemas/        Zod schemas shared across features (form + API validation)
├── generated/      Generated code (e.g. API clients/types) — never hand-edit
└── workers/        Web workers / background tasks
```

## `components/` structure

Every reusable component gets its **own folder**, not a flat file — this is
what makes the design system reusable and swappable as it grows:

```
components/
├── ui/            One folder per design-system primitive:
│   ├── button/      button/button.tsx + button/index.ts (barrel)
│   ├── input/, textarea/, checkbox/, radio/, switch/, select/, combobox/
│   ├── avatar/, badge/, card/
│   ├── dialog/, drawer/, modal/, popover/, tooltip/, dropdown/
│   ├── accordion/, tabs/, carousel/, progress/
│   ├── skeleton/, spinner/, toast/
│   ├── table/, pagination/, breadcrumb/, separator/, scroll-area/
│   ├── command/, calendar/, date-picker/, chart/, typography/
│   └── index.ts     barrel — re-exports every implemented primitive
├── layout/        header/, footer/, sidebar/, mobile-nav/, desktop-nav/,
│                  search-bar/, page-container/, page-header/ + index.ts
├── forms/         form-field/, password-input/, image-upload/,
│                  rich-text/, otp-input/ + index.ts
├── feedback/      empty-state/, error-state/, loading/, not-found/,
│                  success/ + index.ts
├── navigation/    menu/, breadcrumbs/, tabs/, pagination/ + index.ts
│                  (composed nav usage — distinct from the bare `ui/tabs`
│                  and `ui/pagination` primitives)
├── charts/, animations/, common/    scaffolded, not yet subdivided
└── index.ts       top barrel — re-exports ui/layout/forms/feedback/navigation
```

- **One component = one folder** (`ui/button/button.tsx` + `ui/button/index.ts`
  re-exporting it), even before it has variants/sub-parts — this keeps every
  primitive's shape consistent and gives it room to grow (tests, stories,
  sub-components) without a later restructure.
- **A folder with no component yet** holds only a `.gitkeep`. Add the real
  file(s) and delete the `.gitkeep` in the same PR — an empty barrel
  (`export {};`) at the category level (`ui/index.ts`, `layout/index.ts`,
  ...) is expected until its first real component lands; add that
  component's export line to the barrel in the same PR that adds it.
- **shadcn CLI caveat**: `npx shadcn add <name>` writes a flat
  `ui/<name>.tsx` by default, not the `ui/<name>/<name>.tsx` +
  `ui/<name>/index.ts` folder shape used here. After running the CLI, move
  the generated file into its own folder and add the barrel — same pattern
  as the `button` migration.

## `components/` vs `features/`

- **`components/`** — reusable, presentational, no knowledge of a specific
  domain. A `Button` or `DataTable` belongs here. If you're tempted to import
  a feature's types into a shared component, it probably belongs in that
  feature's folder instead.
- **`features/<name>/`** — everything specific to one domain area (quran,
  hadith, prayer, bookmarks, admin, ...): components, hooks, API calls, and
  local types for that feature. Prefer colocating a feature's own
  `components/`, `hooks/`, `api.ts` inside `features/<name>/` rather than
  scattering them into the shared folders above.

## `lib/` vs `services/`

- **`lib/`** — infrastructure the app itself owns: the HTTP client
  (`lib/api/`), error types (`lib/errors/`), logging (`lib/logger/`), plus
  `auth/`, `cache/`, `storage/`, `validators/`, `security/`, `permissions/`,
  `helpers/`, `formatters/`, `date/`. Nothing here should know about a
  third-party SDK.
- **`services/`** — thin wrappers around external providers (Firebase,
  websockets, payments, AI, push notifications). If a dependency is swapped
  out, the blast radius should be contained to its folder in `services/`.

## Route groups in `app/`

- `(public)` — marketing/unauthenticated pages
- `(auth)` — login/register/forgot-password
- `(dashboard)` — authenticated app shell
- `api/` — Next.js route handlers, if/when needed instead of (or alongside)
  an external backend

## Empty folders

Folders scaffolded ahead of use are kept in git via a `.gitkeep` file. Delete
the `.gitkeep` the moment real content is added to that folder — an empty
folder with lingering `.gitkeep` next to real files is a sign it's time to
tidy up, not a persistent marker.
