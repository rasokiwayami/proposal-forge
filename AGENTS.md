<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

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
