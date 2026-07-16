# OpenRouter Skill
## Purpose
Route primary text generation through a unified provider gateway.
## Architecture
OpenRouter adapter implements Vault interfaces; Vault still owns capability routing and fallback.
## Libraries
OpenRouter OpenAI-compatible API.
## Folder structure
Adapter, model allowlist, headers/config, tests.
## Best practices
Pin approved model ids, send app attribution, validate output, record actual model/usage.
## Performance targets
First token <800 ms target and task-specific total budget.
## Security considerations
Server key only; prevent arbitrary user-selected model/egress.
## Examples
Primary assistant route falls back to Groq/Gemini after normalized failure.
## Anti-patterns
Assuming every upstream has identical behavior or pricing.
## Testing strategy
Model mapping, upstream error, fallback, usage normalization.
## Production checklist
Allowlist, budget, data policy, health, circuit breaker.
