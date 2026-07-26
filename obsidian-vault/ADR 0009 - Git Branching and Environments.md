---
tags: [adr, accepted]
---

# ADR 0009 — Git Branching and Environments

Up: [[Sirat MOC]] · Implements: [[Deployment]]

**Decision:** lightweight GitFlow — `feature/*` → `develop` (auto-deploy
dev.sirat.app) → `release/vX.Y.Z` (auto-deploy uat.sirat.app) → `main`
(auto-deploy sirat.app, Vercel). Versioning is branch-name-driven, not
`semantic-release`. Deploys via Vercel CLI directly (not a third-party
Action), gated by a `verify` job every time.

**Rejected:** trunk-based + feature flags (brief wants 3 persistent
environments); third-party Vercel Action (official CLI = more control,
no third-party maintenance dependency); `semantic-release` (no published
package consuming semver — this is a deployed app).

**Consequence:** needs 3 Vercel projects + 5 GitHub secrets — see
[[Deployment]]. No hotfix process defined yet (open gap).
