# Import Pipeline

```text
Capture request -> validate/normalize -> deduplicate -> persist import -> outbox
 -> acquire metadata/media -> transcribe/OCR -> analyze -> embed
 -> graph update -> trend/recommendation update -> notify
```

Each stage reads an immutable job payload, writes a versioned result, and advances state only after success. Idempotency key is the normalized source reference plus workspace and pipeline version. Retries use exponential backoff with jitter for transient network/provider errors; invalid URLs, removed media, auth failures, and policy violations are terminal and visible to the user. The dead-letter queue preserves sanitized diagnostics and replay eligibility.

Instagram v1 supports two modes. Manual URL capture always works and records provenance. The local CLI bridge verifies `instagram-cli` 2.0.1, reports authentication status, and consumes one-turn JSON commands such as `inbox --output json`; it does not pretend the CLI can export saved Reels because that capability is absent from the referenced project. Any future feed/media extraction adapter must be separately implemented, tested, and reviewed against platform terms.

Stages and budgets: normalize <100 ms; metadata <5 s; media fetch <30 s; Whisper transcript <30 s for a one-minute clip; vision/OCR <12 s; analysis <8 s; embedding <3 s per batch; graph update <500 ms; user notification <2 s after completion. Progress weights are deterministic so the UI never moves backward.

Media bytes go to R2, relational metadata to D1/PostgreSQL, and vectors to Qdrant. Checksums deduplicate bytes. A source deletion tombstones the idea, removes signed access immediately, and asynchronously deletes media, vectors, and graph edges according to retention policy.
