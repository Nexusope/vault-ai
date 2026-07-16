# NestJS Skill
## Purpose
Implement the target enterprise service layer.
## Architecture
Feature modules expose controllers, application services, domain policies, repositories, and events; cross-module calls use explicit ports.
## Libraries
NestJS, Zod or generated DTO bridge, Prisma, BullMQ, OpenTelemetry.
## Folder structure
`modules/<feature>/{api,application,domain,infrastructure}`.
## Best practices
Thin controllers, constructor injection, request context, idempotency, typed exceptions.
## Performance targets
Metadata p95 150 ms; avoid request-scoped provider overhead.
## Security considerations
Guards supplement—not replace—object-level authorization.
## Examples
`IdeasController` parses DTO then calls `CaptureIdeaService` with tenant actor.
## Anti-patterns
Fat services, circular modules, ORM entities as API, global mutable providers.
## Testing strategy
Domain unit, module integration, API contract, authorization tests.
## Production checklist
Health/readiness, graceful shutdown, tracing, limits, rollback.
