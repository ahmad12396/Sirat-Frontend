---
tags: [adr, accepted]
---

# ADR 0008 — Dark Mode Glassmorphism Design

Up: [[Sirat MOC]] · Implements: [[Design System]] · Product driver: [[PRD]]

**Decision:** replaced shadcn's neutral placeholder palette with
dark-mode-default + a single restrained accent color + glassmorphism
surface tokens for accent surfaces only.

**Why:** confirmed product brief: premium bar (Notion/Linear/Stripe/Arc),
dark default, not gaudy/multi-color.

**Rejected alternatives:** light-default with dark secondary; a vibrant
multi-color palette; glassmorphism applied everywhere (perf + legibility
cost, esp. Arabic diacritics — see [[UI-UX Guidelines]]).

**Consequence:** every new surface needs WCAG contrast checked in **both**
themes — stricter than the old grayscale default. See [[Security]]-adjacent
open item in [[Design System]] re: contrast not yet verified.
