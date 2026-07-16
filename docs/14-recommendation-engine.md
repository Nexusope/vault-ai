# Recommendation Engine

Candidates come from semantic neighbors, rising trends, underused collections, creator affinity, and graph bridge opportunities. Hard filters remove deleted, blocked, already dismissed, inaccessible, and near-duplicate content. The base score is `0.30 relevance + 0.20 trend + 0.15 freshness + 0.15 preference + 0.10 novelty + 0.10 creator diversity`; weights are versioned and observable.

An LLM reranks only the top 30 candidates when the predicted value exceeds its cost. Diversification limits one creator to two items and one dominant topic to 40% of a slate. Every recommendation includes a reason and evidence path. Feedback events distinguish impression, open, save, fusion-use, dismiss, and “not relevant.”

Daily opportunity generation is asynchronous and cached. Online requests return within 300 ms without LLM dependency. Offline evaluation uses precision@K, coverage, novelty, diversity, calibration, and creator concentration. A holdout group detects whether recommendation changes improve actual reuse rather than clicks alone.
