# Prompt Engineering Skill
## Purpose
Create evaluated, structured, source-grounded AI behavior.
## Architecture
Versioned system template + delimited untrusted inputs + output schema + evaluator + rollback.
## Libraries
Provider-agnostic templates, Zod/JSON Schema, evaluation harness.
## Folder structure
One prompt per capability with fixtures/evaluation metadata.
## Best practices
Minimal instruction, explicit uncertainty/citations, token caps, one repair attempt.
## Performance targets
Meet schema validity/quality baseline within cost budget.
## Security considerations
Treat source text as data; no secrets; resist injection/tool escalation.
## Examples
Fusion output cites every source idea id and separates fact from creative inference.
## Anti-patterns
Monolithic universal prompt, raw interpolation, silent prompt edits.
## Testing strategy
Golden, adversarial, provider variance, regression scoring.
## Production checklist
Version, owner, schema, evaluation, cost, rollout/rollback.
