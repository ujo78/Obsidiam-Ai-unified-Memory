# OpenCode — wiring

**Global:** `~/.config/opencode/AGENTS.md`, written by the sync script (plain mode).
OpenCode **auto-loads this across all sessions** — no config entry needed. Precedence runs
project files first, then this global `AGENTS.md`, then `~/.claude/CLAUDE.md`.

**Project:** OpenCode reads root `AGENTS.md` natively (same file the other agents read).
You can also point `instructions: ["packages/*/AGENTS.md"]` in `opencode.jsonc` for monorepos.

**Facts/recall:** via the Obsidian MCP server. OpenCode uses a different schema than the other
clients — servers live under `mcp` (not `mcpServers`) with a `type` discriminator:

```jsonc
// ~/.config/opencode/opencode.jsonc
{
  "mcp": {
    "obsidian": {
      "type": "remote",
      "url": "http://127.0.0.1:27123/mcp/",
      "enabled": true,
      "headers": { "Authorization": "Bearer <YOUR_OBSIDIAN_API_KEY>" }
    }
  }
}
```

`register-mcp.mjs` handles this shape automatically (see [[mcp-setup]]). Live recall needs the
Obsidian app running; the rules files work regardless.
