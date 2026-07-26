# Deployment & Release

CI (`.github/workflows/ci.yml`), Code Quality (`code-quality.yml`), PR
Validation (`pr-validation.yml`), and now the Deployment Pipeline
(`deploy.yml`) are live. See [ADR-0009](../decisions/0009-git-branching-and-environments.md)
for the full rationale.

## Branch → environment mapping

```
feature/*  ──▶  develop  ──▶  release/vX.Y.Z  ──▶  main
                   │                │                │
                   ▼                ▼                ▼
            dev.sirat.app     uat.sirat.app      sirat.app
             (auto-deploy)     (auto-deploy)    (production deploy)
```

- **`feature/*`** — one branch per feature/fix, PRs into `develop`. Gated
  by `ci.yml` + `code-quality.yml` + `pr-validation.yml` (see those
  workflows) — nothing deploys from a feature branch directly.
- **`develop`** — integration branch. Every push auto-deploys to
  **dev.sirat.app** via `deploy.yml`'s `deploy-dev` job.
- **`release/vX.Y.Z`** — cut from `develop` when preparing a release.
  Every push auto-deploys to **uat.sirat.app** via the `deploy-uat` job —
  this is where QA/stakeholder sign-off happens before merging to `main`.
- **`main`** — production. Every push deploys to **sirat.app** via the
  `deploy-production` job.

Every deploy job depends on a `verify` job (lint, typecheck, test, build)
in the same workflow run — a broken build never reaches Vercel, on any
branch.

## Hosting: Vercel

Three separate Vercel projects (one per environment), driven by the
Vercel CLI (`vercel pull` → `vercel build` → `vercel deploy --prebuilt`)
rather than a third-party action, per
[ADR-0009](../decisions/0009-git-branching-and-environments.md).

### Required repository secrets

**Not yet configured — the workflow is written, the hosting side is not.**
Before `deploy.yml` can actually run successfully, add these in GitHub
repo Settings → Secrets and variables → Actions:

| Secret                   | Used by               |
| ------------------------ | --------------------- |
| `VERCEL_TOKEN`           | all three deploy jobs |
| `VERCEL_ORG_ID`          | all three deploy jobs |
| `VERCEL_PROJECT_ID_DEV`  | `deploy-dev`          |
| `VERCEL_PROJECT_ID_UAT`  | `deploy-uat`          |
| `VERCEL_PROJECT_ID_PROD` | `deploy-production`   |

Get these from `vercel link` locally against each of the three Vercel
projects, or from each project's Settings → General page. Domains
(`dev.sirat.app`, `uat.sirat.app`, `sirat.app`) need to be attached to
their respective Vercel projects separately (Vercel dashboard → Domains).

Each deploy job also declares a GitHub **Environment** (`dev`/`uat`/
`production`) — use this to add required reviewers on `production` (repo
Settings → Environments) if a manual approval gate before prod is wanted;
none is configured yet, so pushes to `main` deploy immediately.

## Release strategy

Versioning is **branch-based, not automated**: cutting a `release/vX.Y.Z`
branch from `develop` _is_ the release-versioning act — there's no
`semantic-release`/`changesets` step computing a version. Tag `main` with
the matching version (`git tag vX.Y.Z`) after merging, if a durable
release marker is wanted beyond the branch name/UAT history.
