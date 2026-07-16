# Gemini Provider Skill
## Purpose
Provide multimodal vision and long-context reasoning.
## Architecture
Gemini adapter implements Vault capability interfaces and normalizes safety/errors.
## Libraries
Google Generative AI REST/SDK server-side.
## Folder structure
Adapter, content-part mapper, schemas, contract fixtures.
## Best practices
Use `gemini-2.5-flash` tier by default, bound media/context, validate output.
## Performance targets
Vision analysis <12 s and bounded output tokens.
## Security considerations
Server key, no URL key logging, redact media metadata.
## Examples
Map transcript plus selected frames to structured style analysis.
## Anti-patterns
Sending full library, trusting safety text as schema, hardcoded key.
## Testing strategy
Multimodal mapping, block/error, malformed output, fallback.
## Production checklist
Region/data policy, quota, model version, evaluation.
