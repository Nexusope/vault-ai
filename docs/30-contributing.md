# Contributing

Open an issue or task with user outcome, scope, non-goals, acceptance tests, migration impact, and security/privacy notes. Branch from current main, keep commits single-purpose, and preserve the repository’s package manager and architecture. Never commit secrets or generated runtime output.

Before review run database generation when schema changed, type/lint checks, tests, and production build. Update contracts, docs, prompts, migrations, and fixtures in the same change. Pull requests explain why, behavior change, verification evidence, rollout/rollback, screenshots for UI, and known risks.

Review prioritizes correctness, tenant isolation, authorization, data migration, error handling, accessibility, performance, observability, and test strength. Comments distinguish blocking defects from suggestions. Merges are squash by default; releases use semantic versioning and changelog generated from accepted changes.
