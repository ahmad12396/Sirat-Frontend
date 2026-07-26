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

## CI/CD (`.github/workflows/`)

Full status and rationale in [docs/deployment/README.md](../deployment/README.md).
Summary:

- **`ci.yml`** — Lint, Type Check, Build, Unit Tests, Coverage (uploaded
  as a build artifact), and a Security Audit job on every push/PR to
  `main`. The audit is gated at `--audit-level=critical`, not `high` —
  see the comment in the workflow file for why (known, unfixable
  dev-tooling advisories; tighten this once upstream fixes land).
- **`code-quality.yml`** — Prettier check, ESLint, a Dependency Review
  (PR-only, fails on newly-introduced high-severity dependencies), and a
  secret scan (`gitleaks`) on every push/PR to `main`.
- **`pr-validation.yml`** — checks the PR title and every commit in the
  PR against Conventional Commits — a CI-side backstop for the local
  Husky `commit-msg` hook ([ADR-0007](../decisions/0007-conventional-commits.md)),
  since that hook can be bypassed with `--no-verify`.
- **`deploy.yml`** — the Deployment Pipeline. `feature/* → develop →
release/vX.Y.Z → main` maps to `dev.sirat.app → uat.sirat.app →
sirat.app` (Vercel), gated by a `verify` job (lint/typecheck/test/build)
  on every push. See [ADR-0009](../decisions/0009-git-branching-and-environments.md)
  and [docs/deployment/README.md](../deployment/README.md) — the
  workflow is written but the Vercel projects/secrets aren't provisioned
  yet, so it won't run successfully until that's done.
- **Release Pipeline** is branch-driven, not a separate automated tool —
  cutting a `release/vX.Y.Z` branch _is_ the versioning act. See
  [ADR-0009](../decisions/0009-git-branching-and-environments.md) for why
  `semantic-release`/`changesets` wasn't adopted.
