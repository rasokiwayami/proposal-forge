# Legacy Agent Pipeline

Proposal Forge contains a Gemini-based proposal generation pipeline that predates the Jinsei Global role consolidation. This pipeline is a legacy prototype for Proposal Forge only. It is not a Jinsei canonical sub-agent model and must not be used as the source of truth for Global departments.

## Prototype Functions

The legacy prototype pipeline functions are:

- `industryAnalyst`
- `pricingEstimator`
- `scheduleEstimator`
- `differentiator`
- `mergeAgentOutputs`
- `copyReviewer`

These names describe product-local Gemini functions, not dispatchable Jinsei roles.

## Global Capability Mapping

Reusable concerns should move to Global replacements when Jinsei needs the same capability:

| Proposal Forge function or concern | Global replacement |
| --- | --- |
| `pricingEstimator` pricing judgment | Global Finance |
| `scheduleEstimator` schedule judgment | Planning/Finance time tradeoff |
| `copyReviewer` copy review | Global Writing Quality |
| Platform policy checks inside `copyReviewer` | Global Review plus a project-specific policy role |

`industryAnalyst`, `differentiator`, and `mergeAgentOutputs` remain product-local prototype pipeline steps unless a later approved slice defines a canonical replacement or product rewrite.

## Operating Rule

Do not rewrite Proposal Forge product code as part of agent consolidation. Treat the current Gemini pipeline as a documented legacy prototype pipeline and route future Jinsei reusable work to the Global replacements above.
