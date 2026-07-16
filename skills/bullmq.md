# BullMQ Skill
## Purpose
Run durable asynchronous Vault pipelines.
## Architecture
One queue per workload class; versioned small job payloads reference database records.
## Libraries
BullMQ and Redis.
## Folder structure
Queue contracts, producers, processors, schedulers, dead-letter tooling.
## Best practices
Idempotency, bounded attempts/backoff, leases, concurrency caps, graceful shutdown.
## Performance targets
Oldest normal job <60 s; completion SLO by stage.
## Security considerations
Validate payload and tenant; redact failure data.
## Examples
`analysis:v3` keyed by idea id plus analysis version.
## Anti-patterns
Media bytes in jobs, infinite retries, side effects before durable checkpoint.
## Testing strategy
Duplicate, retry, timeout, poison, replay, shutdown.
## Production checklist
Dashboards, DLQ, backpressure, autoscaling, runbook.
