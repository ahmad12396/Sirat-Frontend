---
tags: [tooling, conventions, ci-cd]
---

# Tooling & Enforced Conventions

Up: [[Sirat MOC]]

Philosophy: a convention should fail a commit/lint run, not just live in a
doc. See [[Rules]] for the fast-reference version.

| Convention              | Enforced by                                                           |
| ----------------------- | --------------------------------------------------------------------- |
| No direct `process.env` | ESLint `no-restricted-properties`                                     |
| Code style              | Prettier + `eslint --fix` on commit                                   |
| Lint before commit      | Husky `pre-commit` → lint-staged                                      |
| Commit format           | Husky `commit-msg` → commitlint — [[ADR 0007 - Conventional Commits]] |
| Import casing           | `tsconfig.json` `forceConsistentCasingInFileNames`                    |

ESLint: flat config — [[ADR 0002 - ESLint Flat Config]].
`.vscode/` shared: settings/extensions/launch/tasks.

## Testing

See [[Vitest]].

## CI/CD

See [[CI-CD]] and [[Deployment]].

## Agent tooling

See [[gstack]].
