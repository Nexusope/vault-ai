# Versioning

Application releases use SemVer. Public API and event schemas version independently: additive optional fields are compatible; removed fields, changed meaning, stricter accepted input, or altered event semantics require a major version. Prompts, analysis schemas, graph algorithms, and ranking weights carry their own versions on every stored result.

Database migrations are ordered, immutable after release, and recorded in deployment artifacts. Clients receive a minimum-supported version and deprecation date. Deprecations have telemetry, migration documentation, at least one normal release cycle, and explicit removal approval.

The current `0.9.0-preview` label means the interface and edge contracts are usable but authentication, real import enrichment, and production provider secrets are not yet production-complete.
