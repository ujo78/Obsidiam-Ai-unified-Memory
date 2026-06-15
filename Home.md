# 🏠 AI Memory — Home

Central dashboard for the unified AI-agent memory system. Everything an AI agent on this
machine knows — rules and learned facts — lives in this one vault.

## Quick links
- [[MEMORY|📇 Master Index]] — index of all memory
- [[README|⚙️ How it works + commands]]
- [[rules/AGENTS|📜 Global rules (AGENTS.md)]] — **edit rules here**
- [[sessions/INDEX|🗂️ Sessions]] — readable Claude chat transcripts

## Areas
| Area | Folder | What it holds |
|---|---|---|
| Rules | `rules/` | Human-curated conventions/preferences → pushed to all agents |
| Facts | `memory/` | Cross-project learned facts (one per file) |
| Projects | `projects/` | Live per-project memory (junctioned from Claude Code) |
| Sessions | `sessions/` | Readable exports of Claude chat transcripts ([[sessions/INDEX|index]]) |
| Agents | `agents/` | Reference notes on how each agent is wired |

## Daily workflow
1. Edit a rule in [[rules/AGENTS|AGENTS.md]] (or add a note in `rules/languages/`, `rules/domains/`).
2. Run `node scripts/sync-memory.mjs` (or leave `--watch` running) to push to every agent.
3. Facts that Claude Code learns appear automatically under `projects/<name>/memory/`.
4. Any MCP-capable agent can read/write this vault live via the Obsidian MCP server.

## Agent wiring at a glance
[[agents/claude-code]] · [[agents/cursor]] · [[agents/windsurf]] · [[agents/gemini-antigravity]] · [[agents/copilot]] · [[agents/kiro]] · [[agents/mcp-setup]]
