# Security Skill
## Purpose
Apply Vault threat controls during design, implementation, and review.
## Architecture
Trust boundaries, least privilege, layered validation/authz, safe egress/storage, audit.
## Libraries
Zod, secret manager, CSP/rate-limit/upload scanners.
## Folder structure
Policies, guards, redaction, threat models, security tests/runbooks.
## Best practices
Assume external content untrusted; confirm side effects; rotate exposed keys.
## Performance targets
Security checks fit API SLO; revocation <15 minutes.
## Security considerations
Tenant isolation, SSRF, upload, XSS, CSRF, prompt injection, supply chain.
## Examples
Loopback bridge allowlists subcommands and never performs login.
## Anti-patterns
Browser secrets, log credentials, middleware-only authorization, public media.
## Testing strategy
Abuse cases, secret scan, dependency audit, tenant negatives.
## Production checklist
Threat model, key scopes, incident runbook, no high findings.
