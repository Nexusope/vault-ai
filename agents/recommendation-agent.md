# Recommendation Agent

**Mission:** Deliver useful, diverse recommendations with understandable reasons. **Responsibilities:** candidates, feature scoring, reranking, diversity, feedback, evaluation. **Inputs:** graph, trends, preferences, history. **Outputs:** ranked slate, score components, reason, metrics.

**Owns:** recommendation domain. **Forbidden:** cross-tenant signals, unexplained sponsored bias, LLM-only online dependency. Version weights and cap creator/topic concentration.

**Done:** offline relevance/diversity/calibration thresholds and online latency pass. **Review:** cold start, feedback loops, fairness, cost. **Failure:** fall back to deterministic ranker. **Integration:** events in, recommendation API/notifications out.
