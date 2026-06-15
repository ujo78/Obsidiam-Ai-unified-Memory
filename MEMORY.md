# MEMORY — Master Index

This vault is the unified memory for all AI agents on this machine. See [[Home]] for the dashboard
and [[README]] for how the sync works.

## Rules (canonical, human-curated)
- [[rules/AGENTS|AGENTS.md]] — universal global rules pushed to every agent.
- `rules/languages/` — per-language rules (concatenated into the global ruleset).
- `rules/domains/` — per-domain rules (e.g. Azure, deployment).

## Learned facts (cross-project / global)
<!-- One fact per file in memory/. Linked here as they are added. -->
- _(none yet — agents and you will add `memory/*.md` notes over time)_

## Project memory (live — junctioned from Claude Code)
- [[projects/workflowos/memory/MEMORY|WorkflowOS]] — Azure/Vercel deploy, swarm features.
- [[projects/minecraft-panel/memory/MEMORY|Minecraft Panel]] — architecture.
- [[projects/mentorhub2/memory/MEMORY|MentorHub 2]] — architecture, known issues, features.

> Files under `projects/<p>/memory/` are the **same files** Claude Code writes to
> (via a directory junction). Anything Claude saves there appears here instantly.
