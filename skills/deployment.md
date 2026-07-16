# Deployment Skill
## Purpose
Release Vault safely with evidence and rollback.
## Architecture
Immutable artifact, compatible migration, private canary, health/synthetic verification, promotion.
## Libraries
Sites/Cloudflare, CI, Terraform for enterprise services.
## Folder structure
Hosting config, migrations, pipeline, environment manifests, runbooks.
## Best practices
Environment isolation, managed secrets, feature flags, exact commit/artifact.
## Performance targets
Zero-downtime interactive path; rollback within 15 minutes.
## Security considerations
Credentials never in repo/remote URL/log; least privilege.
## Examples
Package Worker `dist`, D1 migration, and hosting metadata then deploy privately.
## Anti-patterns
Build-on-server drift, irreversible migration, public deploy without approval.
## Testing strategy
Clean build, migration, health, synthetic critical path, rollback drill.
## Production checklist
Status succeeded, URL recorded, monitoring quiet, rollback ready.
