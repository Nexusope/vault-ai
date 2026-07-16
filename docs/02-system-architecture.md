# System Architecture

```text
Browser / Mobile / Extension
          |
      Edge Web App  ---- D1 metadata / R2 media (current deployable runtime)
          |
  Application services: Capture | Search | Fusion | Assistant | Trends
          |
       Event outbox ---- Worker queues ---- Analysis stages
          |                                 |
   Provider Router                    Embeddings / OCR / STT
          |
OpenRouter | Groq | Gemini | NVIDIA | Cerebras

Local machine: instagram-cli <-> loopback bridge <-> explicit user import
```

The current repository is an edge-first vertical slice: Vinext/React renders the application, Cloudflare D1 stores relational records, R2 is reserved for media, API routes enforce schemas, and a provider router keeps vendor logic outside features. The local Instagram bridge binds only to `127.0.0.1`, executes one-turn JSON commands, and never handles login credentials. This makes the preview deployable while preserving a migration path to the target enterprise topology.

At sustained scale, split the application services into NestJS modules backed by PostgreSQL/Prisma, Redis, BullMQ, Qdrant, and R2. D1 becomes an edge read model or is retired after a dual-write migration. Domain services own invariants; controllers validate transport; repositories own persistence; adapters own vendors. All background work is idempotent and keyed by `(tenant_id, source, source_ref, pipeline_version)`.

Trust boundaries are browser, edge runtime, private service network, worker network, provider egress, and local CLI. Browser code receives short-lived sessions and signed media URLs only. Secrets remain runtime bindings. Provider requests contain minimum required content and redact user identifiers. Observability propagates `trace_id`, `tenant_id`, `job_id`, and `prompt_version` without logging prompts or credentials by default.

Availability target is 99.9% for interactive APIs and 99.5% for asynchronous enrichment. Reads degrade to cached metadata when AI providers fail. Writes use an outbox so persistence succeeds independently of enrichment. The provider router tries the preferred provider, applies bounded exponential backoff to transient failures, then falls back by capability and cost.
