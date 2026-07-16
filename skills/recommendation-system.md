# Recommendation System Skill
## Purpose
Rank useful, novel, diverse next actions.
## Architecture
Multiple candidate generators → hard filters → feature rank → diversification → optional LLM rerank.
## Libraries
Domain ranker, Qdrant, feature store/SQL.
## Folder structure
Candidates, features, scorer, diversity, feedback, evaluation.
## Best practices
Version weights, deterministic online fallback, evidence reasons, feedback taxonomy.
## Performance targets
Online slate <300 ms without LLM.
## Security considerations
Tenant isolation and preference consent.
## Examples
Limit creator to two and topic to 40% per slate.
## Anti-patterns
Clicks-only objective, filter bubbles, unexplained ranking.
## Testing strategy
Precision, diversity, novelty, calibration, latency, holdout.
## Production checklist
Cold start, rollback weights, experiment guardrails, cost.
