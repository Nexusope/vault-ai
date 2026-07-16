# Grok Provider Skill
## Purpose
Support Grok as an optional reasoning provider through the shared adapter.
## Architecture
Capability adapter only; provider router decides when it is eligible.
## Libraries
xAI API client or OpenAI-compatible transport.
## Folder structure
Adapter, config, normalized errors, contract tests.
## Best practices
Pin model, schema validation, timeout, usage/cost telemetry.
## Performance targets
Meet task latency budget or fall back.
## Security considerations
Server-only scoped secret; review data retention.
## Examples
Use for current-event reasoning only when approved source context exists.
## Anti-patterns
Claiming web freshness without sources, direct feature coupling.
## Testing strategy
Capability, 429/5xx, schema, fallback tests.
## Production checklist
Key, quota, pricing, policy, circuit breaker.
