# Event System

Domain events represent completed facts: `idea.captured.v1`, `import.started.v1`, `media.stored.v1`, `transcript.completed.v1`, `analysis.completed.v1`, `embedding.completed.v1`, `graph.updated.v1`, `trend.detected.v1`, `fusion.completed.v1`, and `notification.created.v1`. Each envelope contains event id, type, version, occurred time, tenant, actor, trace, aggregate id/version, and payload.

Producers write an outbox row in the same database transaction as the aggregate. A relay publishes and marks it sent. Consumers store processed event ids to achieve effective once-only behavior over at-least-once transport. Ordering is guaranteed only per aggregate; handlers must tolerate cross-aggregate reordering.

Schema changes are additive within a version. Removing or changing meaning requires a new event version and dual-publish window. Events carry identifiers and state deltas, not secrets or large media. R2 object references are signed only when consumed by an authorized service.

The event catalog records owner, producers, consumers, PII classification, retention, replay safety, and sample payload. Replay is scoped by tenant and time range, runs in dry mode first, and disables user notifications unless explicitly enabled. Poison events move to quarantine after bounded retries.

Real-time UI updates use a projection/SSE gateway rather than subscribing browsers to internal queues. The client receives workspace-safe events with monotonically increasing cursor and reconnects from the last cursor.
