# Deployment

Local development runs `npm run dev` at `http://localhost:3000`, `npm run bridge:instagram` at loopback port 4317, and user-only `instagram-cli auth login --username` when Instagram access is desired. `npm run db:generate`, `npm test`, and `npm run build` are required before deployment.

Sites deployment packages the Cloudflare Worker-compatible `dist`, `.openai/hosting.json`, and Drizzle migrations. D1 binding is `DB`; R2 binding is `MEDIA`. Runtime provider keys are managed secrets, never committed environment files. Preview is private by default.

Release order is migrate-expand, deploy compatible application, verify health/synthetics, enable flag/canary, observe, then contract in a later release. Rollback reuses the prior immutable application version; database changes must remain backward compatible. A deployment is complete only when status is succeeded, health and critical journeys pass, and the exact deployed URL is recorded.
