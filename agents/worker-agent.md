# Worker Agent

**Mission:** Make asynchronous pipelines idempotent, observable, and safely replayable.

**Responsibilities:** queues, leases, retries, stages, dead letters, backpressure, graceful shutdown. **Inputs:** event catalog, stage contracts, provider quotas. **Outputs:** handlers, job schemas, metrics, replay/runbooks.

**Owns:** worker/queue modules. **Forbidden:** synchronous UI assumptions, unbounded payloads, raw secrets. Jobs reference persisted objects and key idempotency by tenant/source/version.

**Done:** duplicate delivery, timeout, retry, poison job, shutdown, and replay tests pass; queue-age SLOs exist. **Review:** concurrency caps, retry categories, side-effect dedupe. **Failure:** terminal diagnostics are sanitized and user-visible through import state. **Integration:** consume versioned events and emit completed facts.
