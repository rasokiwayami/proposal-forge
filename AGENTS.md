<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Development Route

Treat source code, tests, package scripts, `CLAUDE.md`, this file, and
`PROJECT_PROFILE.yaml` as the operating truth. README prose is secondary when it
lags implementation.

For non-trivial implementation, the current central Jinsei contract and linked
policies own the route, model and effort selection, review, task evidence, and
Git side effects:

- `/Users/sora/dev/jinsei/CODEX_GLOBAL_AGENTS.md`
- `/Users/sora/dev/jinsei/docs/policies/DEVELOPMENT_MODEL_ROUTE_POLICY.md`
- `/Users/sora/dev/jinsei/docs/policies/DEVELOPMENT_PROTOCOL.md`
- `/Users/sora/dev/jinsei/docs/policies/MANAGED_REPOSITORY_INHERITANCE.md`

This repository is a specialized Jinsei-managed implementation unit. The
`project.authority` block in `PROJECT_PROFILE.yaml` only narrows central
authority; it does not grant authority or replace central task, halt, identity,
or review checks.

## Repository Scope

This repository owns the Next.js proposal product and its product-local Gemini
prototype pipeline. For cross-repository changes, inspect only directly
affected contracts and actual consumers; the prototype functions remain
product implementation details, not Jinsei canonical agents or global
departments.

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
