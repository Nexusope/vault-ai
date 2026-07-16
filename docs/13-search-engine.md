# Search Engine

Search combines PostgreSQL full-text ranking, Qdrant cosine similarity, graph proximity, freshness, and user feedback. The query parser identifies entities, intent, time constraints, modality, and requested sort. Exact filters apply before vector retrieval; keyword and vector candidates are independently capped, normalized, merged by reciprocal-rank fusion, then optionally reranked by a cheap model.

Default score is `0.36 semantic + 0.24 keyword + 0.18 graph + 0.12 freshness + 0.10 personal`. Each result returns score components, highlighted evidence, matching graph path, source, and access check. Empty queries show recent/recommended ideas instead of scanning all records. Tenant id is mandatory in every index payload and filter.

Budgets are p95 150 ms keyword, 400 ms hybrid, and 900 ms natural-language search. Cache normalized queries for 60 seconds per workspace. Index updates are event-driven and idempotent. Deleted ideas are immediately filtered by the source database and asynchronously removed from vector storage. Quality evaluation tracks NDCG@10, zero-result rate, reformulation rate, and clicked/saved result position.
