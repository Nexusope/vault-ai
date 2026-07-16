# Worker System

Workers execute import, media, transcript, analysis, embedding, graph, trend, recommendation, notification, and cleanup queues. BullMQ/Redis is the enterprise target; the edge slice uses synchronous API operations only for fast metadata and defers heavy jobs until the worker service is deployed.

Every job includes `jobId`, `tenantId`, `traceId`, `type`, `version`, `attempt`, `notBefore`, and a small payload referencing persisted records. Workers acquire a lease, heartbeat long work, and perform an atomic compare-and-set on completion. Jobs are idempotent; retries must not duplicate provider calls, graph edges, notifications, or billable outputs.

Concurrency is queue-specific: media download 20 per pod, transcription 4 GPU tasks, embeddings 8 batches, LLM analysis 16 requests subject to provider quotas, graph updates 32, and notifications 100. Autoscaling uses oldest-job age and queue depth, with maximum concurrency caps that respect provider limits. Backpressure pauses upstream acquisition before storage or provider limits cascade.

Retry policy: network/429/5xx up to five attempts with jittered exponential delay; validation and policy errors no retry; provider exhaustion routes once to fallback before retrying. Dead-letter records include category, sanitized message, last stage, attempts, and replay command. Operators can replay by job id after correcting root cause.

Metrics include throughput, success ratio, p50/p95 duration, retry count, oldest age, dead-letter rate, provider spend, and duplicate suppression. Shutdown stops intake, waits up to 30 seconds for leases, then returns unfinished jobs safely.
