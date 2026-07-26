# ADR-0009: Git branching model + environment mapping (dev/uat/production)

**Status:** Accepted
**Date:** 2026-07-26

## Context

[docs/deployment/README.md](../deployment/README.md) previously left the
deployment target and release strategy as open questions
([ADR-0004](./0004-centralized-api-layer.md)-adjacent infra had CI/Code
Quality/PR Validation live, but no deploy pipeline). A concrete branch →
environment mapping has now been confirmed:

```
feature/*  ──▶  develop  ──▶  release/vX.Y.Z  ──▶  main
                   │                │                │
                   ▼                ▼                ▼
            dev.sirat.app     uat.sirat.app      sirat.app
```

Hosting target: **Vercel** (three separate projects, one per environment).

## Decision

- **Branching model**: a lightweight GitFlow variant.
  - `feature/*` branches PR into `develop` — gated by `ci.yml`,
    `code-quality.yml`, `pr-validation.yml` (no deploy).
  - `develop` auto-deploys to `dev.sirat.app` on every push.
  - `release/vX.Y.Z` branches (cut from `develop`) auto-deploy to
    `uat.sirat.app` on every push — this is the QA/stakeholder
    sign-off environment before production.
  - `main` auto-deploys to `sirat.app` (production) on every push.
- **Versioning is branch-name-driven**, not automated
  (`semantic-release`/`changesets`) — cutting `release/vX.Y.Z` _is_ the
  version decision. No separate release-versioning tool is introduced.
- **Deployment mechanism**: the Vercel CLI (`vercel pull` →
  `vercel build` → `vercel deploy --prebuilt`) inside
  `.github/workflows/deploy.yml`, run per-environment with that
  environment's `VERCEL_PROJECT_ID_*` secret — not a third-party
  GitHub Action wrapper.
- **A `verify` job (lint, typecheck, test, build) gates every deploy job**
  in the same workflow run, on every branch — a broken build is never
  pushed to Vercel, including on `main`.
- Each deploy job declares a GitHub **Environment** (`dev`/`uat`/
  `production`), so environment-scoped secrets and required-reviewer
  approval gates (e.g. for `production`) can be added later via repo
  Settings → Environments without a workflow change.

## Alternatives considered

- **Trunk-based development (single `main`, feature flags for staging)**
  — rejected; the brief specifically calls for three persistent,
  independently-addressable environments (dev/uat/prod), which maps more
  directly onto separate long-lived branches than feature-flagged trunk.
- **Third-party Vercel GitHub Action** (e.g. `amondnet/vercel-action`) —
  rejected in favor of the official Vercel CLI invoked directly. The CLI
  is maintained by Vercel itself, gives explicit control over the
  pull/build/deploy steps (useful for debugging a failed deploy), and
  avoids a dependency on a third-party action's maintenance status for a
  production deployment path.
- **`semantic-release`/`changesets` for versioning** — rejected for now;
  there's no published package/artifact consuming a semver number today
  (this is a deployed app, not a library), so the release act is really
  "this branch reached `main`", which the branch/environment model already
  captures. Revisit if a versioned public API or SDK is introduced later.
- **Automatic production deploy on every `main` push with no approval
  gate** — accepted as the current default (simplest to start with), but
  explicitly flagged as something to reconsider by adding required
  reviewers to the `production` GitHub Environment once the team wants a
  manual gate before production goes live.

## Consequences

- `.github/workflows/deploy.yml` requires five repository secrets
  (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_DEV/UAT/PROD`) and
  three separately-provisioned Vercel projects with their domains
  attached — none of this infrastructure exists yet; see
  [docs/deployment/README.md](../deployment/README.md) for the setup
  checklist. The workflow will fail until these are configured.
- `release/vX.Y.Z` branches need a manual cut-and-merge process
  (`develop` → `release/vX.Y.Z` → `main`) — no tooling automates when to
  cut one; that remains a team/process decision, not a CI concern.
- Hotfixes directly against `main`/production aren't addressed by this
  ADR — if an urgent production fix is needed that can't wait for the
  full `develop → release → main` flow, that process should be defined
  as a follow-up (a conventional `hotfix/*` branch merged into both `main`
  and back into `develop` is the typical GitFlow answer, but isn't decided
  here).
