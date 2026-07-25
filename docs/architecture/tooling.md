# Tooling & Enforced Conventions

Where possible, a convention in this codebase is backed by something that
fails a commit or a lint run — not just a line in a doc someone has to
remember to read.

| Convention                           | Enforced by                                                                    |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| No direct `process.env` access       | ESLint `no-restricted-properties` (`eslint.config.mjs`)                        |
| Code style (quotes, semicolons, ...) | Prettier (`.prettierrc`) + `eslint --fix` on commit                            |
| Lint passes before commit            | Husky `pre-commit` → `lint-staged`                                             |
| Commit message format                | Husky `commit-msg` → commitlint (`commitlint.config.js`), Conventional Commits |
| Consistent import path casing        | `tsconfig.json` → `forceConsistentCasingInFileNames`                           |
| `@/*` import alias                   | `tsconfig.json` paths + `components.json` aliases (kept in sync)               |
| Editor formatting on save            | `.vscode/settings.json` (shared via workspace, not per-user)                   |

## ESLint

Flat config (`eslint.config.mjs`), built on `eslint-config-next`
(`core-web-vitals` + `typescript`). Add new custom rules as additional
entries in the `defineConfig([...])` array; scope exceptions with a
`{ files: [...], rules: {...} }` block rather than inline
`eslint-disable` comments where the exception is structural (e.g. the
`process.env` carve-out for `src/config/env.ts`).

## Prettier

`.prettierrc` sets the house style (double quotes, trailing commas,
80-char width). `.prettierignore` excludes `.next`, `node_modules`, and the
lockfile.

## Husky + lint-staged

- `.husky/pre-commit` runs `lint-staged`, which runs `eslint --fix` on
  staged `.js/.jsx/.ts/.tsx` and `prettier --write` on those plus
  `.json/.css/.md`.
- `.husky/commit-msg` runs `commitlint --edit` against the commit message.

## Commitlint

`commitlint.config.js` extends `@commitlint/config-conventional`. Commit
messages must follow `type(scope?): subject`, e.g. `feat: add qibla compass`,
`fix(api): handle 401 on token refresh`. See the
[Conventional Commits spec](https://www.conventionalcommits.org/) for the
full type list (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`,
`ci`, `build`).

## VS Code workspace (`.vscode/`)

Checked in so every contributor gets the same setup without manual config:

- **`settings.json`** — Prettier as default formatter, ESLint auto-fix on
  save, Tailwind class-regex support for `cva`/`cx`.
- **`extensions.json`** — recommended extensions prompt on folder open.
- **`launch.json`** — debug configs for server-side, client-side, and
  full-stack (Next.js dev server + Chrome).
- **`tasks.json`** — `dev`/`build`/`lint` wired to npm scripts.

If you change a shared convention (formatter, lint rule, editor setting),
update the corresponding `.vscode/` file in the same PR so it applies to
everyone, not just your machine.
