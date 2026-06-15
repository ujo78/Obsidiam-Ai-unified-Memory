# AI Memory — Unified Agent Memory System

One Obsidian vault that is the **single source of truth** for what every AI coding agent on this
machine knows: human-curated **rules** and agent-learned **facts**. Edit here; it flows out to
every agent.

Vault root: `C:\Users\rajra\AI-Memory`

## How it works

Three bridge mechanisms move content from this vault to each agent:

1. **Junctions** (`mklink /J`) — Claude Code's per-project memory directories
   (`~/.claude/projects/<slug>/memory/`) ARE the folders under `projects/<name>/memory/` here.
   Anything Claude saves appears in the vault instantly, and edits here are seen by Claude.
2. **Native import** — `~/.claude/CLAUDE.md` is a one-liner: `@C:/Users/rajra/AI-Memory/rules/AGENTS.md`.
3. **Sync script** (`scripts/sync-memory.mjs`) — transforms `rules/AGENTS.md` (+ `rules/languages/*`,
   `rules/domains/*`) into each *other* agent's native format and location.

Plus the **Obsidian Local REST API plugin's built-in MCP server**, so MCP-capable agents can
read AND write this vault as a tool while Obsidian is running.

## Commands

```bash
# Push rules to every agent's GLOBAL location
node ~/AI-Memory/scripts/sync-memory.mjs

# Same, plus drop per-project rule files into a specific repo
node ~/AI-Memory/scripts/sync-memory.mjs --project "C:/Users/rajra/Desktop/microsoft-build-ai/workflowos"

# Watch rules/ and auto-sync on change
node ~/AI-Memory/scripts/sync-memory.mjs --watch

# Export Claude chat transcripts into readable Obsidian notes under sessions/
node ~/AI-Memory/scripts/export-sessions.mjs

# Onboard a Claude project: move its memory into the vault + junction it back
powershell -File ~/AI-Memory/scripts/link-claude-project.ps1 -ProjectPath "C:\Users\rajra\Desktop\<proj>"

# (Re)register the Obsidian MCP server with every agent (after installing the plugin)
node ~/AI-Memory/scripts/register-mcp.mjs --key <API_KEY> --apply
```

## What gets written where (global)

| Agent | File |
|---|---|
| Claude Code | `~/.claude/CLAUDE.md` (→ `@AGENTS.md`) |
| Gemini CLI + Antigravity | `~/.gemini/GEMINI.md` |
| Windsurf | `~/.codeium/windsurf/memories/global_rules.md` (≤6000 chars) |

Per-project (`--project`): root `AGENTS.md`, thin `CLAUDE.md`, `.github/copilot-instructions.md`,
`.cursor/rules/00-global.mdc`, `.kiro/steering/global.md`, `.agents/rules/global.md`,
`.windsurf/rules/global.md`.

## Rules

- **Edit `rules/AGENTS.md` only.** The generated files are overwritten on every sync.
- Keep `rules/AGENTS.md` under ~500 lines; use `rules/languages/` and `rules/domains/` for scope.
- Don't click Antigravity's "+ Global" button — it overwrites `~/.gemini/GEMINI.md`, which the
  sync script owns (Gemini CLI and Antigravity share that file).

See `agents/*.md` for per-agent wiring details and gotchas.
