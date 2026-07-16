# Agent Orchestration

`agents/main-orchestrator.md` is authoritative. Work begins from a requirement and evidence plan, then decomposes into bounded tasks with owner, allowed files, dependencies, acceptance tests, and handoff artifact. One agent owns a file at a time. Shared contracts and migrations land before dependent implementations.

Agents do not declare completion from code inspection. They run the relevant build/tests, capture exact outcomes, and list unverified requirements. Security, database, and public contract changes require specialist review. Integration resolves contract mismatches at the source rather than adding local adapters without documentation.

Handoffs contain summary, decisions, files, commands/results, risks, follow-ups, and rollback. Conflicts are escalated to the orchestrator with both invariants. The orchestrator favors product requirements, security, data integrity, compatibility, maintainability, then local convenience.

Independent QA receives the running app and requirements, not the implementer’s conclusions. Findings include route, steps, expected/actual, severity, and evidence. Fixes are re-tested by both implementer and QA agent.
