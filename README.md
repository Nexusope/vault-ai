# VAULT//AI

Vault AI is a database-backed creative intelligence workspace with a technical-brutalist dark interface, ten routed product areas, a React Three Fiber Idea Galaxy, Fusion workflow, hybrid-search interface, analytics, a server-side multi-provider AI router, Cloudflare D1/R2 bindings, and a local `instagram-cli` bridge.

## Run locally

Requirements: Node.js 22.13+ and `instagram-cli` 2.0.1.

```powershell
npm install
npm run db:generate
npm run dev
```

Open `http://localhost:3000/`. D1 tables initialize idempotently on the first Ideas API request. Run `npm test` for the build/render suite and `npm run lint` for static analysis.

For Instagram, start the loopback bridge in a second terminal:

```powershell
npm run bridge:instagram
instagram-cli auth login --username
```

The login command is intentionally user-only. Vault AI never receives the Instagram password or session. The current CLI exposes agent-friendly JSON for inbox/read/send flows but does not provide a documented saved-Reels export; URL capture remains the honest content-ingestion path until a separate compliant adapter exists.

Copy `.env.example` to an ignored local environment file and add freshly rotated provider keys. Supported routes are OpenRouter, Groq, Gemini, Cerebras, and NVIDIA. Keys must remain server-side. Credentials pasted into chat or committed elsewhere are considered compromised and should be rotated before use.

## Verification

```powershell
instagram-cli --version
instagram-cli --help
npm run db:generate
npm run build
npm test
```

Architecture is in `docs/`; agent ownership is in `agents/`; reusable implementation playbooks are in `skills/`; versioned execution prompts are in `prompts/`. `agents/main-orchestrator.md` is the controlling collaboration contract.

## Current status

The application shell, routes, capture API, D1 schema/migration, provider abstraction, CLI bridge, docs, agents, and skills are implemented. Production activation still requires the user’s Instagram login, rotated provider secrets, hosted authentication, and real media enrichment workers. These boundaries are explicit rather than simulated as connected production services.
