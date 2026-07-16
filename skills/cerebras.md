# Cerebras Provider Skill
## Purpose
Provide low-latency open-model classification and extraction.
## Architecture
OpenAI-compatible adapter behind Vault capability port.
## Libraries
Cerebras inference API.
## Folder structure
Adapter, model config, fixtures, contract tests.
## Best practices
Small structured prompts, deterministic temperature, strict caps.
## Performance targets
Classification p95 <2 s.
## Security considerations
Server key only; redact content/logs.
## Examples
Bulk tag extraction with JSON schema and confidence.
## Anti-patterns
Long premium reasoning by default, unvalidated free text.
## Testing strategy
Batch, schema repair, timeout, fallback.
## Production checklist
Quota, cost, model pin, health metrics.
