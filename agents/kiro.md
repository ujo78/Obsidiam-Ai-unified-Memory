# Kiro — wiring

**Project:** Kiro steering lives in `.kiro/steering/*.md`. The sync script's `--project` mode writes
`.kiro/steering/global.md` with frontmatter:

```md
---
inclusion: always
---
```

so it's always in context. Kiro steering is workspace-scoped (no documented global location), so
rules reach Kiro per-project.

**Facts/recall:** via the Obsidian MCP server if Kiro's MCP config is set — see [[mcp-setup]].
