# Prisma Skill
## Purpose
Implement the target PostgreSQL repository layer safely.
## Architecture
Prisma clients remain infrastructure; map persistence rows to domain objects.
## Libraries
Prisma ORM and PostgreSQL.
## Folder structure
Schema/migrations in database package; repositories per domain.
## Best practices
Select only needed fields, explicit transactions, cursor pagination, tenant-leading predicates.
## Performance targets
No N+1; p95 metadata query ≤100 ms database time.
## Security considerations
Never construct raw SQL with user input; log no sensitive args.
## Examples
Unique `(organizationId, sourceId, externalId)` suppresses duplicate imports.
## Anti-patterns
Prisma models as API DTOs, unbounded `findMany`, long external calls in transactions.
## Testing strategy
Real database integration and migration-from-prior tests.
## Production checklist
Pool limits, indexes, explain plans, backup/rollback.
