---
tags: [testing, vitest]
---

# Vitest

Up: [[Sirat MOC]] · Part of: [[Tooling]] · [[CI-CD]]

`vitest.config.ts` (jsdom, `@/` alias, v8 coverage) + `vitest.setup.ts`
(jest-dom matchers, RTL auto-cleanup). Scripts: `test`, `test:watch`,
`test:coverage`.

11 real tests currently: `src/lib/utils.test.ts` (`cn()`),
`src/components/ui/button/button.test.tsx` (render/click/disabled),
`src/lib/errors/error-handler.test.ts` (`normalizeError` across
Zod/Axios/Error/unknown) — see [[Error Handling]].

Gotcha hit during setup: needed `@testing-library/dom` as an explicit peer
dep, and env vars (`NEXT_PUBLIC_APP_URL`/`API_URL`) injected via
`test.env` in the config since Vitest doesn't auto-load `.env`.
