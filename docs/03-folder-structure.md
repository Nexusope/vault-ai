# Folder Structure

```text
app/                 Vinext routes and edge API handlers
components/          Product UI and reusable visual components
db/                  Drizzle schema and D1 access boundary
drizzle/             Ordered SQL migrations
lib/                 Domain data, state, and provider abstractions
scripts/             Local-only bridges and deterministic operations
worker/              Cloudflare worker entry point
docs/                Architecture decision source of truth
agents/              Agent roles, ownership, and handoff contracts
skills/              Reusable implementation playbooks
prompts/             Versioned generation and agent prompts
tests/               Contract, rendered-output, and interaction tests
```

Imports flow inward: route/UI code may import domain modules; domain modules never import routes or components. Vendor SDK calls are limited to adapter modules. Database access is limited to `db/` and repositories. A feature spanning UI and API receives a stable domain name, typed request/response schema, and tests beside the boundary.

Future monorepo packages are `apps/web`, `apps/api`, `apps/worker`, `apps/extension`, `apps/mobile`, `packages/domain`, `packages/contracts`, `packages/ui`, `packages/observability`, and `packages/testing`. Move code only when the second consumer exists; avoid premature package fragmentation. Every package exposes a deliberate public entry point and forbids deep imports.

Generated outputs (`dist`, `.vinext`, `.wrangler`, coverage) are ignored. Secrets live in ignored environment files locally and managed runtime values when hosted. Migration files, prompt versions, OpenAPI contracts, and test fixtures are committed because they are part of product behavior.
