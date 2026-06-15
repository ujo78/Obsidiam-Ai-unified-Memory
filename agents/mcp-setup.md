# MCP setup — Obsidian Local REST API (built-in MCP server)

The Obsidian **Local REST API** community plugin (by coddingtonbear) ships a built-in MCP server.
No third-party npm server needed. It runs *inside Obsidian* — Obsidian must be open for MCP to work.
(Junctions + the sync script work even when Obsidian is closed.)

## One-time Obsidian steps (GUI)
1. Open the vault: Obsidian → *Open folder as vault* → `C:\Users\rajra\AI-Memory`.
2. Settings → Community plugins → turn off Restricted mode → Browse → install **Local REST API** → Enable.
3. In the plugin settings: copy the **API key**. Enable the **non-encrypted (HTTP) server** to avoid
   self-signed-cert friction (default `http://127.0.0.1:27123`). The MCP endpoint is `…/mcp/`.

## Register with agents
```bash
# Claude Code (user scope = all projects)
claude mcp add -s user --transport http obsidian http://127.0.0.1:27123/mcp/ \
  --header "Authorization: Bearer <API_KEY>"
```
- **Cursor:** add to `.cursor/mcp.json` (project) or global MCP settings.
- **Windsurf:** `~/.codeium/windsurf/mcp_config.json`.
- **Gemini CLI:** `mcpServers` block in `~/.gemini/settings.json`.
- **Antigravity:** `~/.gemini/antigravity/mcp_config.json`.

All use the same URL + Authorization header.

## Notes
- HTTPS endpoint is `https://127.0.0.1:27124/mcp/` (self-signed cert — trust it or use HTTP).
- If a client can't do remote HTTP MCP (e.g. classic Claude Desktop), bridge with `npx mcp-remote@latest`.
