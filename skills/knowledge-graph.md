# Knowledge Graph Skill
## Purpose
Build evidence-backed idea relationships and Galaxy projections.
## Architecture
Relational authority plus rebuildable graph projection; candidate edges from embeddings then validated features.
## Libraries
PostgreSQL, Qdrant, graph layout utilities.
## Folder structure
Schemas, edge builders, projectors, traversal, layout.
## Best practices
Canonical edges, confidence/evidence/version, preserve user links.
## Performance targets
Depth≤3 traversal <400 ms; stable incremental layout.
## Security considerations
Tenant-scoped nodes/edges and explanations.
## Examples
`Idea -USES_HOOK-> Hook <-USES_HOOK- Idea` explains similarity.
## Anti-patterns
Opaque edges, unbounded traversal, graph as unrebuildable authority.
## Testing strategy
Idempotency, precision sample, deletion, traversal bounds.
## Production checklist
Rebuild tool, version migration, quality/latency metrics.
