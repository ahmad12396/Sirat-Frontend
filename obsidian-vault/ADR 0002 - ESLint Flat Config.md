---
tags: [adr, accepted]
---

# ADR 0002 — ESLint Flat Config

Up: [[Sirat MOC]] · Implements: [[Tooling]]

**Decision:** keep `eslint.config.mjs` (flat config), reject legacy
`.eslintrc`/`.eslintignore`.

**Why:** Next 16 + ESLint 9 default to flat config; `eslint-config-next`
ships flat presets first. Converting back is a downgrade with no benefit.

**Consequence:** new rules (e.g. the `process.env` block — see
[[ADR 0006 - Env Validation with Zod]]) added as `defineConfig([...])`
entries with `{files, rules}` overrides, not legacy `overrides` syntax.
