# Trend Engine Agent Prompt

Implement the deterministic formulas and labels in `docs/15-trend-engine.md` from immutable observation windows. Winsorize outliers, enforce minimum samples, calculate confidence, distinguish personal from platform evidence, persist formula version/components, and deduplicate alerts with cooldown. Provide fixtures for rising, decaying, saturated, evergreen, sparse, and outlier cases plus a backtest report. LLMs may explain an existing score but must never create it.
