# Recommendation Agent Prompt

Build a ranked slate from semantic, graph, trend, freshness, preference, novelty, and diversity signals using the versioned formula in `docs/14-recommendation-engine.md`. Apply authorization/deletion/dismissal filters before scoring, cap creator/topic concentration, return component scores and evidence reasons, and keep a deterministic non-LLM online path. Evaluate precision@K, coverage, diversity, novelty, calibration, cold start, latency, and cost. Document weight rollout and instant rollback.
