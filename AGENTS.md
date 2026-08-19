<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development Route

Treat source code, tests, package scripts, `CLAUDE.md`, this file, and
`PROJECT_PROFILE.yaml` as the operating truth. README prose is secondary when it
lags implementation.

For non-trivial implementation, use the parent-owned route:
Plan -> Work -> independent Sol max Review. The central instructions are
`/Users/sora/dev/jinsei/CODEX_GLOBAL_AGENTS.md`, and the deterministic task,
authority, evidence, and Git boundary is `/Users/sora/dev/jinsei/bin/jinsei`.
The Codex parent owns model launch; the current TaskIntent, exact worktree
scope, and fresh verification/review evidence must bind to the current HEAD.
Do not infer launch commands from this repository.

## Development Autonomy

Development GitHub operations are L5 under Jinsei's
`GITHUB_DEVOPS_AUTONOMY_POLICY.md` after this repo's verification and fresh
independent Sol max review evidence bound to the current HEAD pass. This
includes branch work, local commits, pushes to an existing approved remote, PR
creation/update, and issue operations.

Public deployment, repository visibility changes, billing or paid services,
secret mutation, production data mutation, public claims, and publication remain
gated.

Do not read, print, commit, or copy `.env*`, Supabase keys, Gemini/API keys,
auth tokens, customer/proposal private data, browser profiles, raw logs, or
generated private workspaces. Do not deploy or mutate production data without
explicit approval.

## Legacy Gemini Prototype Pipeline

Proposal Forge's Gemini functions are a legacy prototype pipeline for this product, not Jinsei canonical sub-agents or reusable Global departments.

The legacy prototype functions are:

- `industryAnalyst`
- `pricingEstimator`
- `scheduleEstimator`
- `differentiator`
- `mergeAgentOutputs`
- `copyReviewer`

Reusable capability mapping:

- `pricingEstimator` pricing judgment maps to Global Finance.
- `scheduleEstimator` schedule judgment maps to Planning/Finance time tradeoff.
- `copyReviewer` copy review maps to Global Writing Quality.
- Platform policy checks map to Global Review plus a project-specific policy role.

Do not route Jinsei work through these functions as named sub-agents. Product changes should treat them as existing Proposal Forge implementation details unless a separate product rewrite is approved.
