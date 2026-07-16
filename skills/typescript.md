# TypeScript Skill
## Purpose
Create maintainable, explicit, safe Vault code.
## Architecture
Types follow domain contracts; runtime boundaries validate before narrowing.
## Libraries
TypeScript strict, Zod, ESLint.
## Folder structure
Domain types near domain; transport schemas in contracts; no global type dumping ground.
## Best practices
Use discriminated unions, exhaustive switches, readonly inputs, typed errors, and inference from schemas.
## Performance targets
Avoid type-driven runtime bloat and large barrel imports.
## Security considerations
Never type-cast untrusted JSON into authority.
## Examples
`const parsed = CreateIdea.safeParse(payload)` before service invocation.
## Anti-patterns
`any`, broad assertions, non-null assertions, numeric/string status constants.
## Testing strategy
Runtime validation tests and `tsc --noEmit`.
## Production checklist
Strict build passes; public types documented; no unsafe suppression.
