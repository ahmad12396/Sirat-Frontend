---
tags: [deployment, vercel, git-branching]
---

# Deployment

Up: [[Sirat MOC]] · Decision: [[ADR 0009 - Git Branching and Environments]] · Pipeline details: [[CI-CD]]

```
feature/*  →  develop  →  release/vX.Y.Z  →  main
                │               │              │
                ▼               ▼              ▼
         dev.sirat.app   uat.sirat.app    sirat.app
```

Hosting: **Vercel**, three separate projects (sirat-dev/sirat-uat/sirat-prod),
git auto-deploy disconnected — deploys driven entirely by `deploy.yml`'s
`verify` job (lint/typecheck/test/build) + Vercel CLI
(`vercel pull → build → deploy --prebuilt`).

**Status: workflow written, hosting not fully wired** — needs 5 GitHub
secrets (`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_DEV/UAT/PROD`)
and domains attached per project. GitHub Environments `dev`/`uat`/`production`
created; `production` has no required-reviewer gate configured (Hobby plan
limitation — needs GitHub Pro/Team/Enterprise or a public repo).

Release strategy: branch-name-driven, not `semantic-release` — cutting
`release/vX.Y.Z` _is_ the version decision. See [[Phases]] for what ships
in which release.

**Open gap:** no hotfix process defined for urgent prod fixes bypassing the
full develop→release→main flow.
