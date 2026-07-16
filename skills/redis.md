# Redis Skill
## Purpose
Provide bounded cache, rate limit, and BullMQ infrastructure.
## Architecture
Redis is never the sole authority for user data; keys are namespaced by environment/tenant/version.
## Libraries
Redis 7, ioredis.
## Folder structure
Shared client/config; feature-specific key builders.
## Best practices
TTL every cache, explicit serialization version, jitter, stampede lock, memory budget.
## Performance targets
p95 <5 ms in-region; hit-rate target per cache.
## Security considerations
TLS/auth, private network, no secrets or raw prompts.
## Examples
`vault:search:v2:{tenant}:{queryHash}` with 60-second TTL.
## Anti-patterns
Wildcard production scans, unbounded values, auth-bypassing shared cache.
## Testing strategy
Expiry, eviction, reconnect, tenant isolation.
## Production checklist
Maxmemory policy, persistence choice, alerts, fail-open/closed decision.
