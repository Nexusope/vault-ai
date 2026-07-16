# Three.js Skill
## Purpose
Render the Idea Galaxy efficiently and accessibly.
## Architecture
Three.js is a presentation projection of graph data; the list fallback is an equal navigation path.
## Libraries
Three.js.
## Folder structure
Galaxy scene, data mapping, LOD, and fallback separated.
## Best practices
Reuse geometries/materials, cap DPR, batch/instance nodes, dispose resources, stable positions.
## Performance targets
60 FPS desktop, 30 minimum, ≤1.5 DPR.
## Security considerations
Treat labels/media as untrusted; no shader/user code execution.
## Examples
Node size maps to bounded trend score and color to approved category token.
## Anti-patterns
One expensive material per node, forced mobile 3D, inaccessible canvas-only interaction.
## Testing strategy
FPS/memory, context loss, reduced-motion, fallback parity.
## Production checklist
LOD, cleanup, resize, low-power mode, accessibility verified.
