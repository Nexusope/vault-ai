# React Three Fiber Skill
## Purpose
Express Galaxy scene lifecycle in React without divorcing it from accessibility.
## Architecture
`Canvas` is client-only; scene nodes are pure data projections; controls and list share selection state.
## Libraries
`@react-three/fiber`, Drei.
## Folder structure
Canvas boundary, scene components, controls, fallback list.
## Best practices
Use `useFrame` for bounded animation, memoize static points, clamp camera, cap DPR.
## Performance targets
No React state update each frame; lazy-load scene chunk.
## Security considerations
No remote executable assets; validate asset URLs.
## Examples
Icosahedron nodes pulse via refs while OrbitControls handles bounded navigation.
## Anti-patterns
DOM state in frame loop, remounting Canvas, absent fallback.
## Testing strategy
Scene smoke, fallback behavior, resize/context loss, performance profile.
## Production checklist
Client boundary, lazy chunk, disposal, reduced-motion, labels complete.
