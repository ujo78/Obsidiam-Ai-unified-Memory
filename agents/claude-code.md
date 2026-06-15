# Claude Code — wiring

**Global rules:** `~/.claude/CLAUDE.md` contains a single import line
`@C:/Users/rajra/AI-Memory/rules/AGENTS.md` (Claude Code's native `@import` syntax). No symlink.

**Project facts (live):** Claude's per-project memory dir `~/.claude/projects/<slug>/memory/` is a
**directory junction** pointing at `projects/<name>/memory/` in this vault. Claude writes facts
there during sessions; they appear in Obsidian immediately. Slugs are the project path with `:`/`\`
replaced by `-`, e.g. `C:\Users\rajra\Desktop\...\workflowos` → `C--Users-rajra-Desktop-...-workflowos`.

**Onboard a new project:** `powershell -File scripts/link-claude-project.ps1 -ProjectPath "<path>"`
(moves existing memory into the vault, then junctions it back — no facts lost).

**MCP:** registered with `claude mcp add -s user --transport http obsidian http://127.0.0.1:27123/mcp/`
(see [[mcp-setup]]).

**Note:** AGENTS.md is not yet natively read by Claude Code — that's why we use the CLAUDE.md import.
