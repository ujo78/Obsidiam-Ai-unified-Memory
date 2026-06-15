# Azure / deployment rules

> Example scoped ruleset (domain). Appended to the global ruleset by the sync script.

- This account uses Azure for some backends (see [[projects/workflowos/memory/MEMORY|WorkflowOS]]).
- The tenant requires MFA — `az login --tenant <tenant-id>` before deployments.
- Never hard-code secrets in code or rules. Reference Key Vault / env vars.
- Confirm subscription + resource group before any `az` command that changes infra.
