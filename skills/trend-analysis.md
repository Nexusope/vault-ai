# Trend Analysis Skill
## Purpose
Score momentum, freshness, saturation, and confidence from observed data.
## Architecture
Immutable observations → window features → versioned formula → alert policy.
## Libraries
SQL time series and deterministic math; optional model explanation only.
## Folder structure
Observation ingestion, features, scorer, backtest, alerts.
## Best practices
Robust scaling, minimum samples, confidence, personal/platform labels.
## Performance targets
Incremental update <500 ms per signal.
## Security considerations
Aggregate safely; never infer sensitive traits.
## Examples
Use formula and thresholds in `docs/15-trend-engine.md`.
## Anti-patterns
LLM-generated scores, sparse-data certainty, alert spam.
## Testing strategy
Formula fixtures, outliers, decay, cooldown, backtest.
## Production checklist
Version, explanation, confidence, drift/false-positive metrics.
