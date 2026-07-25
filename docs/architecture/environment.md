# Environment & Config

**Rule: never read `process.env` directly.** Import `env` from
`@/config/env` instead. This is enforced by an ESLint rule
(`no-restricted-properties` in `eslint.config.mjs`), not just convention —
see [tooling.md](./tooling.md).

## Why

- A typo'd or missing env var fails loudly at startup, with a Zod error
  listing exactly what's wrong — not as an obscure `undefined` bug three
  layers deep in a component.
- Every consumer gets a fully-typed `env` object instead of
  `string | undefined` from raw `process.env`.
- Server-only vs. client-exposed (`NEXT_PUBLIC_*`) variables are validated
  against separate schemas, so it's obvious which values are safe to ship to
  the browser.

## How it works (`src/config/env.ts`)

- `serverSchema` validates server-only vars (currently just `NODE_ENV`).
- `clientSchema` validates `NEXT_PUBLIC_*` vars (`NEXT_PUBLIC_APP_URL`,
  `NEXT_PUBLIC_API_URL`), each parsed with `z.url()`.
- Both are parsed eagerly at import time. On failure, the tree of Zod issues
  is logged and the module throws — the app won't boot with a broken config.
- The merged, typed result is exported as `env`.

## Adding a new variable

1. Add it to `.env.example` (and your local `.env`) with a sane placeholder.
2. Add it to `serverSchema` or `clientSchema` in `src/config/env.ts`,
   whichever matches whether it needs to reach the browser.
3. Import `env.YOUR_VAR` wherever it's needed.

## `.env` vs `.env.example`

`.gitignore` ignores `.env*` except `.env.example` (explicit negation) —
`.env.example` is the only env file that should ever be committed.
