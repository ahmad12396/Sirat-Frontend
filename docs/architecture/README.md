# Architecture

This section documents _why_ the codebase is structured the way it is. If you're
changing something covered here, update the doc in the same PR — a stale doc is
worse than no doc.

> Looking for how a request/user flows through the app (routes, auth flow,
> state management, rendering strategy) rather than code organization? See
> [docs/architecture.md](../architecture.md).

- [Overview](./overview.md) — stack, high-level layout, guiding principles
- [Folder Structure](./folder-structure.md) — what each top-level `src/` folder is for
- [Environment & Config](./environment.md) — how env vars are validated and consumed
- [API Layer](./api-layer.md) — how the app talks to the backend
- [Error Handling & Logging](./error-handling.md) — how errors are normalized, logged, and surfaced
- [Tooling](./tooling.md) — lint/format/commit/editor conventions and why they're enforced
