# AGENTS.md — Universal AI Agent Rules

> **Single source of truth.** This file is the canonical global ruleset for every AI coding
> agent on this machine (Claude Code, Cursor, Windsurf, Gemini, Copilot, Kiro, Antigravity).
> Edit it **here only** (in the Obsidian vault), then run `scripts/sync-memory.mjs` to push it
> to every agent. Do not edit the generated copies — they are overwritten.
>
> Keep this file focused and under ~500 lines. Put scoped rules in `rules/languages/*` and
> `rules/domains/*` (the sync script concatenates them).

## About me
- Name: Rakshit Raj. Primary OS: Windows 11. Shell: Git Bash. Editors: VS Code family + several agentic IDEs.
- Projects live under `C:\Users\rajra\Desktop\`.

## How you should work
- Be concise and direct. When you have enough to act, act — don't over-explain.
- Prefer editing existing code/patterns over inventing new structure. Match the surrounding style.
- Confirm before destructive or hard-to-reverse actions (deleting files, force-pushing, dropping data).
- When tests or a build exist, run them after changes and report real results — never claim success unverified.
- Reference files by clickable path + line where the tooling supports it.

## Coding conventions
- Favor clear names over clever ones. Small, single-purpose functions.
- Don't add comments that restate the code; comment the *why* when it's non-obvious.
- Keep diffs minimal and scoped to the task. No drive-by reformatting.
- Handle errors explicitly; don't swallow exceptions silently.

## Tooling defaults
- Package manager: prefer the one already in the repo (lockfile wins). Otherwise `npm`.
- Use the repo's existing lint/format config; don't introduce a competing one.

## Project-specific context
- Per-project details live in this vault under `projects/<name>/memory/` and are surfaced to
  each agent through its own memory mechanism. See [[MEMORY]] for the index.

<!-- Add your real preferences below. This starter is intentionally generic — tune it. -->
