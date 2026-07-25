# Architecture Decision Records (ADRs)

This is a log of significant technical decisions and the reasoning behind
them — not just _what_ we chose, but _why_, and what we explicitly gave up
by choosing it. When someone asks "why is it done this way?" six months
from now, the answer should be here, not in someone's memory.

## When to write one

Write an ADR when a decision:

- is hard or expensive to reverse later,
- affects more than one feature/module,
- was chosen over a reasonable-looking alternative, or
- will look wrong out of context ("why isn't this just X?").

Don't write one for routine implementation choices that a code review can
settle on their own.

## Process

1. Copy [`0000-template.md`](./0000-template.md).
2. Number it sequentially (`000N-short-title.md`).
3. Set **Status** to `Proposed`, open a PR, get it discussed.
4. On merge, set **Status** to `Accepted`.
5. If a later decision replaces this one, don't delete it — set its status
   to `Superseded by ADR-000N` and link the new one. The history of _why we
   changed our minds_ is as valuable as the current answer.

## Index

| ADR                                              | Title                                                         | Status   |
| ------------------------------------------------ | ------------------------------------------------------------- | -------- |
| [0001](./0001-src-directory-layout.md)           | Adopt `src/` directory layout                                 | Accepted |
| [0002](./0002-eslint-flat-config.md)             | Keep ESLint flat config over legacy `.eslintrc`               | Accepted |
| [0003](./0003-tailwind-v4-css-config.md)         | Stay CSS-based for Tailwind v4 config                         | Accepted |
| [0004](./0004-centralized-api-layer.md)          | Centralize all HTTP access behind `src/lib/api`               | Accepted |
| [0005](./0005-centralized-error-handling.md)     | Normalize all errors into a single `AppError` type            | Accepted |
| [0006](./0006-env-validation-with-zod.md)        | Validate environment variables with Zod at startup            | Accepted |
| [0007](./0007-conventional-commits.md)           | Enforce Conventional Commits via commitlint + Husky           | Accepted |
| [0008](./0008-dark-mode-glassmorphism-design.md) | Adopt dark-mode-default, glassmorphism-accented design system | Accepted |
