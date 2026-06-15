# Cursor — wiring

**Global:** Cursor's "User Rules" are GUI-only (Settings → Rules) — no file to sync. Paste the
contents of `rules/AGENTS.md` there once if you want machine-wide Cursor rules.

**Project:** Cursor reads a root `AGENTS.md` natively. The sync script's `--project` mode drops
`AGENTS.md` at the repo root **and** a `.cursor/rules/00-global.mdc` with frontmatter:

```mdc
---
description: Global rules (synced from AI-Memory vault)
alwaysApply: true
---
```

**Facts/recall:** via the Obsidian MCP server (add it to `.cursor/mcp.json` or Cursor's global MCP
settings — see [[mcp-setup]]).
