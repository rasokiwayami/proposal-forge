<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Global Routing

Treat source code, tests, package scripts, `CLAUDE.md`, this file, and
`PROJECT_PROFILE.yaml` as the operating truth. README prose is secondary when it
lags implementation.

For non-trivial implementation, route through Jinsei / Global Coding Department:

```bash
cd /Users/sora/dev/jinsei
python3 scripts/dispatch_codex_session.py --queue-request --project "Proposal Forge" --repo /Users/sora/dev/proposal-forge --operation-id <operation_id> --goal "<bounded goal>" --authority-band A2
python3 scripts/dispatch_codex_session.py --from-queue --limit 3
python3 scripts/dispatch_codex_session.py --check-push-review --project "Proposal Forge" --operation-id <operation_id>
```

Use Planning Worker, Implementation Worker, and Review Controller separation for
multi-file changes, Supabase/auth work, Gemini/API behavior, GUI/design work,
deployment readiness, or push readiness.

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
