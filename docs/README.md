# Sirat — Documentation

This is the project's internal wiki. Start here.

## Read First

- **[rules.md](./rules.md)** — what to always do, what to never do. The
  fast reference; read this before writing code.
- **[memory.md](./memory.md)** — what's actually done vs. in progress vs.
  not started, right now.

## Product & Planning

- **[prd.md](./prd.md)** — product requirements: vision, users, feature
  scope, roles, open questions.
- **[phases.md](./phases.md)** — how the PRD's scope is sequenced into
  shippable phases.
- **[architecture.md](./architecture.md)** — app flow: routes, request
  flow, auth flow, state management, rendering strategy, core user
  journeys.
- **[design.md](./design.md)** — color, typography, spacing, radius,
  iconography tokens.

## Reference

- **[architecture/](./architecture/README.md)** — code organization: why
  the codebase is structured the way it is (folders, env validation, API
  layer internals, error handling, tooling).
- **[api/](./api/README.md)** — the frontend↔backend API contract:
  conventions, auth, error format, pagination, endpoint reference.
- **[security/](./security/README.md)** — threat model, auth/session
  security, authorization, input validation, known gaps, PR checklist.
- **[ui-ux/](./ui-ux/README.md)** — design system usage, theming, RTL/i18n,
  accessibility, content/tone, PR checklist.
- **[decisions/](./decisions/README.md)** — ADR log: significant technical
  decisions and why they were made.

## Not Yet Written

`docs/database/`, `docs/deployment/`, `docs/roadmap/` are scaffolded but
empty — fill in as those areas take shape.

## Keeping This Wiki Alive

A doc that drifts from the code is worse than no doc — people trust it and
get burned. The rule across every page here: **update the doc in the same
PR as the code change it describes.** If you're not sure a doc needs
touching, check `docs/rules.md`'s "Always Do" list — updating the relevant
doc is on it.
