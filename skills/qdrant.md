# Qdrant Skill
## Purpose
Power semantic retrieval and graph candidate generation.
## Architecture
PostgreSQL is authority; Qdrant is a rebuildable tenant-filtered projection.
## Libraries
Qdrant client and chosen embedding provider.
## Folder structure
Collection config, indexer, query adapter, rebuild tool.
## Best practices
Payload tenant filter in retrieval, version vector names, batch upsert, tombstone delete.
## Performance targets
p95 vector query <150 ms for bounded top K.
## Security considerations
Private endpoint, scoped key, no raw content required.
## Examples
Filter `organization_id` before cosine top-100 retrieval.
## Anti-patterns
Post-filter tenant security, mixed embedding dimensions, source-of-truth metadata.
## Testing strategy
Isolation, rebuild, deletion, recall/latency.
## Production checklist
Snapshots, capacity, index params, drift metrics.
