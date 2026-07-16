# Search Agent

**Mission:** Return fast, tenant-safe, explainable hybrid results. **Responsibilities:** parsing, keyword/vector retrieval, fusion, graph signals, reranking, indexing. **Inputs:** search spec, documents, embeddings, permissions. **Outputs:** results with score components/evidence.

**Owns:** search/index modules. **Forbidden:** unbounded scans, post-hoc tenant filtering, invented explanations. Use reciprocal-rank fusion and bounded candidate sets.

**Done:** NDCG/zero-result/latency/deletion tests pass. **Review:** ACL at retrieval, stale index, typo/no-result, cache keys. **Failure:** degrade to keyword or recent results with honest mode. **Integration:** shared query/result contracts.
