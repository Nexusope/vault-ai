# Observability Skill
## Purpose
Make requests, jobs, providers, and user-visible failures diagnosable.
## Architecture
Structured logs, RED metrics, traces, SLO dashboards, actionable alerts with shared ids.
## Libraries
OpenTelemetry and platform logging/metrics.
## Folder structure
Shared instrumentation, redaction, dashboards, alerts, runbooks.
## Best practices
Log once at boundary, semantic fields, trace async events, burn-rate alerts.
## Performance targets
Instrumentation overhead <2%; useful trace sampling.
## Security considerations
Redact secrets, prompts, URLs, cookies, PII.
## Examples
Provider span records model, tokens, cost, status—not content/key.
## Anti-patterns
String logs, alert on every error, high-cardinality raw values.
## Testing strategy
Telemetry assertions, redaction tests, synthetic alert drills.
## Production checklist
SLO, owner, dashboard, runbook, retention, sampling.
