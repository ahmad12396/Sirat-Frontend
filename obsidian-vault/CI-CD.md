---
tags: [ci-cd, github-actions]
---

# CI/CD

Up: [[Sirat MOC]] · Part of: [[Tooling]] · Deploy specifics: [[Deployment]]

Three live workflows in `.github/workflows/`:

- **`ci.yml`** — Lint, Type Check, Build, Unit Tests ([[Vitest]]), Coverage
  (artifact), Security Audit (`--audit-level=critical`, not `high` — known
  unfixable dev-tooling advisories)
- **`code-quality.yml`** — Prettier check, ESLint, Dependency Review
  (PR-only), secret scan (`gitleaks`)
- **`pr-validation.yml`** — PR title + every commit checked against
  Conventional Commits — [[ADR 0007 - Conventional Commits]]

Plus **`deploy.yml`** — see [[Deployment]] for the branch/environment
mapping and [[ADR 0009 - Git Branching and Environments]] for why.
