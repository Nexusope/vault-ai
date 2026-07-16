# Embeddings Skill
## Purpose
Create stable semantic representations for search and graph candidates.
## Architecture
Embedding service hashes normalized content, batches misses, versions model/dimension, and upserts projection.
## Libraries
Approved embedding provider and Qdrant.
## Folder structure
Normalizer, cache, batcher, adapter, indexer.
## Best practices
Reuse by content hash, retain model/version, chunk with overlap and provenance.
## Performance targets
Batch completion <3 s; cache hit >70% after warmup.
## Security considerations
Minimize PII and tenant-filter storage.
## Examples
Transcript chunks retain idea id and time offsets.
## Anti-patterns
Mixing dimensions, reembedding unchanged text, losing chunk provenance.
## Testing strategy
Determinism, chunk boundaries, cache, migration, retrieval quality.
## Production checklist
Dimension/index match, budget, backfill, rollback.
