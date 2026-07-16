# Semantic Search Skill
## Purpose
Answer concept-level queries with explainable hybrid ranking.
## Architecture
Parse/filter → keyword/vector candidates → reciprocal-rank fusion → graph/personal features → optional rerank.
## Libraries
PostgreSQL FTS, Qdrant, optional reranker.
## Folder structure
Query parser, retrievers, ranker, explanation, evaluation.
## Best practices
Filter tenant before retrieval, normalize scores, cap candidates, return evidence.
## Performance targets
Hybrid p95 <400 ms.
## Security considerations
ACL in both indexes and cache key.
## Examples
“emotional founder proof” explains semantic and graph matches.
## Anti-patterns
Vector-only truth, post-filter authorization, fabricated match reason.
## Testing strategy
NDCG, zero results, isolation, stale/delete, latency.
## Production checklist
Index health, fallback, quality dashboard, budgets.
