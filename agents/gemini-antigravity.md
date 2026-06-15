# Gemini CLI + Antigravity — wiring

Both tools **share the same global file**: `~/.gemini/GEMINI.md`. The sync script is the **sole
writer** of this file (content = `rules/AGENTS.md`).

⚠️ **Conflict warning:** Antigravity's "+ Global" button also writes `~/.gemini/GEMINI.md`. Don't
use it — it would overwrite the synced content. Edit rules in the vault instead.

**Gemini CLI project:** the script can point `contextFileName` in `~/.gemini/settings.json` to include
`AGENTS.md`, so Gemini also picks up per-project root `AGENTS.md` files.

**Antigravity project:** workspace rules live in `.agents/rules/` — the script writes
`.agents/rules/global.md` in `--project` mode.

**MCP:** Antigravity reads `~/.gemini/antigravity/mcp_config.json`; Gemini reads `mcpServers` in
`~/.gemini/settings.json` (see [[mcp-setup]]).
