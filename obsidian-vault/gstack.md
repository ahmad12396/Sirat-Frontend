---
tags: [tooling, ai-workflow, gstack]
---

# gstack

Up: [[Sirat MOC]] · Part of: [[Tooling]]

AI-agent skill toolkit (by Garry Tan), installed globally at
`~/.claude/skills/gstack`, **required** for this repo — enforced by a
`PreToolUse` hook in `.claude/settings.json` +
`.claude/hooks/check-gstack.sh`, which blocks Skill-tool use if gstack
isn't installed.

Skill routing rules live in `CLAUDE.md` — request type → skill (bugs →
`/investigate`, ship → `/ship`, planning → `/office-hours`, etc.).

Not part of the app itself — a workflow layer over how work on this repo
gets done. Doesn't replace independent human review, real security audits,
or compliance — see [[Security]].
