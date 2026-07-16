# PostgreSQL Skill
## Purpose
Operate Vault’s enterprise relational source of truth.
## Architecture
Primary writes with read replicas/projections; outbox commits with domain state.
## Libraries
PostgreSQL 16+, pgBouncer, Prisma.
## Folder structure
Versioned migrations, seeds, backup/restore runbooks.
## Best practices
Constraints first, UUIDs, tenant-leading indexes, short transactions, analyze plans.
## Performance targets
Pool saturation <70%; p95 simple query <50 ms.
## Security considerations
TLS, least-privilege roles, RLS defense-in-depth, encryption and audit.
## Examples
`FOR UPDATE SKIP LOCKED` safely claims outbox work.
## Anti-patterns
Offset pagination at scale, JSON dumping ground, destructive in-place migration.
## Testing strategy
Concurrency, isolation, restore, migration and load tests.
## Production checklist
RPO/RTO, replicas, vacuum, alerts, restore drill.
