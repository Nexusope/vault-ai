# Next.js and Vinext Skill
## Purpose
Build route-oriented React application surfaces deployable to Cloudflare Workers.
## Architecture
Server routes own data boundaries; client components own interaction; use Vinext Sites plugin and Worker-compatible ESM.
## Libraries
Next App Router, Vinext, Vite, Cloudflare plugin.
## Folder structure
`app/` routes/API/layout, `components/` UI, `lib/` domain adapters.
## Best practices
Keep client boundaries narrow, use metadata, stable dynamic routes, and lazy heavy visuals.
## Performance targets
LCP ≤2.5 s mobile; initial JS ≤250 KB gzip target.
## Security considerations
No secret/client environment leakage; validate API inputs.
## Examples
`app/[view]/page.tsx` validates route names before rendering `VaultApp`.
## Anti-patterns
Node-only APIs in Worker routes, fetches in every leaf, giant all-client layouts.
## Testing strategy
Production build, rendered HTML, route/API and browser tests.
## Production checklist
Starter metadata removed; routes classified; Workers build and bindings verified.
