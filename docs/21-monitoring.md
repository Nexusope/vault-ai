# Monitoring and Observability

Every request and job emits structured logs, RED metrics, and traces using shared correlation ids. Dashboards cover availability, p95/p99 latency, error rate, D1/PostgreSQL saturation, R2 failures, queue age, provider health/cost, import stage failures, search quality, and frontend Web Vitals.

SLO alerts use burn rates instead of single thresholds: 99.9% interactive availability and 99.5% pipeline completion. Paging alerts must be actionable and link a runbook; informational anomalies create tickets. Logs redact authorization, cookies, prompts, source URLs, and personal media metadata.

Synthetic checks hit health, render the dashboard, create/delete a test idea in staging, and verify a mocked fusion. Trace sampling is 100% for errors, 10% baseline, and adaptive during incidents. Retention follows data classification and regional policy.
