# TypeScript / JavaScript rules

> Example scoped ruleset. The sync script appends `rules/languages/*` to the global ruleset.
> Edit or delete as you like.

- Prefer TypeScript; enable `strict`. Avoid `any` — use `unknown` + narrowing.
- ESM (`import`/`export`), not CommonJS, for new code.
- Prefer `const`; avoid mutation where a pure transform reads clearly.
- Use the repo's existing test runner; colocate tests next to source when that's the convention.
