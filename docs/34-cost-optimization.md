# Cost Optimization

Measure cost per successful capture, search, fusion, assistant answer, and weekly active creator. Cache transcripts, OCR, embeddings, analyses, and prompt results by content hash plus version. Batch embeddings, compact context with graph retrieval, cap outputs, and route extraction/classification to the cheapest model meeting evaluation thresholds.

Escalate only on low confidence, invalid schema after repair, unsupported modality, or explicit high-quality request. Per-tenant daily/monthly budgets produce warnings, degraded model tiers, then hard limits for nonessential work. Queue expensive jobs off-peak where latency permits.

Store provider usage and estimated price at call time so later price changes do not rewrite history. Cost dashboards compare cache hit rate, fallback rate, tokens per result, and quality. Do not reduce provenance, safety, or deletion guarantees to save cost.
