# Security Architecture

Threat modeling follows STRIDE at each trust boundary. Highest-risk assets are provider keys, Instagram sessions, private media, transcripts, organization membership, and generated exports. Controls are defense-in-depth: schema validation, URL allowlists, SSRF-safe fetchers, MIME verification, malware scanning, CSP, CSRF protection, rate limits, tenant-scoped queries, signed R2 URLs, encryption, and immutable audit events.

No secret may appear in browser bundles, source control, logs, analytics, prompts, error responses, or screenshots. Runtime keys are scoped per environment and rotated at least quarterly. The credentials pasted during initial setup are considered exposed and must be replaced before production. Provider adapters redact authorization headers and limit egress destinations.

Instagram CLI is unofficial and may violate Meta terms. The bridge binds to loopback, permits read operations by default, validates allowed subcommands, sets 30-second timeouts and 4 MB output limits, and never accepts arbitrary command arguments from the browser. Login and any send/unsend operation require direct user action.

Uploads are quarantined, content-sniffed, size-limited, and stored under generated keys. HTML is never rendered unsanitized. Prompt injection content is marked untrusted and separated from system instructions. AI tool execution uses allowlisted tools, structured arguments, confirmation for external side effects, and per-tool budgets.

CI runs dependency audit, secret scanning, static analysis, migration review, unit/integration tests, and build reproducibility. Security incidents have defined severity, owner, containment, evidence preservation, disclosure, and postmortem paths. Critical targets: revoke a provider key within 15 minutes and disable a compromised source connector within 5 minutes.
