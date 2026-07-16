# Architecture Skill
## Purpose
Translate Vault requirements into bounded domains and reversible delivery slices.
## Architecture
Use hexagonal boundaries: UI/controllers → application services → domain → repositories/adapters; commit events through an outbox.
## Libraries
TypeScript, Zod, Drizzle/Prisma, OpenTelemetry.
## Folder structure
Keep routes, domain, adapters, persistence, contracts, and tests separate.
## Best practices
Record invariants, trust boundaries, ownership, failure modes, rollout, and evidence before implementation.
## Performance targets
Respect budgets in `docs/22-performance.md` and quantify capacity assumptions.
## Security considerations
Pass tenant/actor explicitly; keep secrets behind runtime adapters.
## Examples
`CaptureIdea` validates, persists, emits `idea.captured.v1`, then returns without waiting for AI.
## Anti-patterns
Shared mutable globals, vendor SDKs in domain code, synchronous pipelines, speculative services.
## Testing strategy
Architecture dependency tests plus end-to-end vertical slice.
## Production checklist
Contracts, migration, observability, SLO, rollback, runbook, owner.
