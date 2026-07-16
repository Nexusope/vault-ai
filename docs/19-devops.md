# DevOps

CI gates are formatting, type checking, lint, unit tests, contract tests, migration validation, secret scan, dependency audit, production build, and accessibility smoke tests. Main is protected and deploys immutable artifacts. Environments are local, preview, staging, and production; each has isolated databases, buckets, keys, and provider budgets.

Infrastructure is declared with Terraform for enterprise services and Sites metadata for the edge application. Deployments use canary traffic, health/readiness probes, automated rollback, and backward-compatible migrations. Feature flags separate deployment from release.

Runbooks cover provider outage, queue backlog, database latency, bad migration, compromised key, and Instagram connector failure. Owners and escalation are explicit. No operator runs ad hoc destructive SQL without a reviewed script, dry run, backup confirmation, and incident/change record.
