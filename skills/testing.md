# Testing Skill
## Purpose
Prove Vault behavior and expose uncertainty.
## Architecture
Domain unit → adapter contract → database/API integration → component → critical browser journeys.
## Libraries
Node test/Vitest-compatible tools, Testing Library, browser runtime, axe.
## Folder structure
Tests near boundary; shared deterministic fixtures and QA reports.
## Best practices
Test outcomes/failures, isolate tenants, fake paid providers, exact evidence.
## Performance targets
Fast unit suite; bounded critical browser suite.
## Security considerations
No production keys/data; test authorization negatives.
## Examples
Capture persists after schema init and rejects invalid URL.
## Anti-patterns
Snapshot-only confidence, retrying flakes, mocks that bypass contracts.
## Testing strategy
Requirement-to-evidence matrix and independent QA.
## Production checklist
Build, migrations, APIs, keyboard/mobile, console, accessibility pass.
