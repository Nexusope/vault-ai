# OpenAI Provider Skill
## Purpose
Add OpenAI capabilities through the provider port when configured.
## Architecture
Adapter maps Vault request/response schemas; router owns selection/fallback.
## Libraries
Official server SDK or Responses API client.
## Folder structure
Provider adapter, schema mapping, fixtures, contract tests.
## Best practices
Structured outputs, model pinning, timeout, token cap, usage capture.
## Performance targets
First token <800 ms target where supported.
## Security considerations
Server secret only; minimize data and redact logs.
## Examples
`generateFusion()` returns validated citations and usage.
## Anti-patterns
SDK in business logic, browser key, undocumented model alias.
## Testing strategy
Recorded contract/fake plus opt-in live smoke.
## Production checklist
Quota, budget, data policy, circuit breaker, fallback.
