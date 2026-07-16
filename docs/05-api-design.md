# API Design

All APIs are JSON over HTTPS under `/api/v1` in the enterprise service; the edge slice currently exposes `/api/health`, `/api/ideas`, and `/api/ai`. Requests use Zod validation, reject unknown or oversized fields, and return an error envelope `{ error: { code, message, traceId, details? } }`. IDs are opaque UUIDs. Timestamps are UTC ISO 8601.

Core contracts:

- `POST /ideas` accepts `title` (2–180), optional `summary` (≤4000), `sourceUrl` (valid URL), `creator` (≤100), and up to 20 tags. It returns `201 { idea }`; `400` for validation; `409` for duplicate source; `429` for rate limits.
- `GET /ideas?cursor=&limit=50&query=&collectionId=` returns stable cursor pagination and never exceeds 100 records.
- `POST /imports` creates an idempotent import with `Idempotency-Key`, returns `202`, and exposes progress at `GET /imports/{id}`.
- `POST /search` accepts query, filters, and mode (`keyword|semantic|hybrid`), returning match explanations and score components.
- `POST /fusions` accepts 2–5 idea ids plus constraint and output types; it returns `202`, then emits progress events.
- `POST /assistant/messages` streams server-sent events with token, citation, usage, and final frames.

Mutation authorization checks workspace membership inside the service, never only in middleware. Collection endpoints use optimistic concurrency via `If-Match`. Bulk mutations cap at 100 ids. Webhooks sign `timestamp.body` with HMAC SHA-256 and reject timestamps older than five minutes.

OpenAPI is generated from shared contracts and validated in CI. Breaking changes require a new major path or additive compatibility window. Latency budgets are p95 150 ms for metadata reads, 400 ms for hybrid search, 800 ms to first assistant token, and 2 seconds for capture acknowledgement.
