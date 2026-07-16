# Error Handling

Errors are classified as validation, authentication, authorization, conflict, not found, rate limit, dependency transient, dependency terminal, invariant, and internal. APIs map them to stable codes and safe messages with trace id. Internal stack, SQL, provider response, and credentials never reach clients.

User surfaces state what failed, what was preserved, and the next safe action. Retriable actions retain input and expose retry; destructive retries require idempotency. Background jobs record stage, attempt, next retry, terminal reason, and replay eligibility. Circuit breakers prevent provider cascades.

Unexpected errors are logged once at the ownership boundary with structured context and redaction. Tests cover malformed input, unavailable DB/provider/bridge, timeouts, duplicate captures, and partial pipeline completion. A global error boundary preserves navigation and offers recovery.
