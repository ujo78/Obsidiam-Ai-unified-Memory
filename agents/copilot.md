# GitHub Copilot — wiring

**Project:** the sync script's `--project` mode writes `.github/copilot-instructions.md` at the repo
root. Recent Copilot also reads root `AGENTS.md`, which the script writes too.

**Global (optional):** VS Code user `settings.json` key
`github.copilot.chat.codeGeneration.instructions` can hold instructions machine-wide; not synced
automatically (paste once if desired).

**Facts/recall:** Copilot's MCP support (VS Code) can use the Obsidian MCP server — see [[mcp-setup]].
