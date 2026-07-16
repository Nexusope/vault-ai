# React Skill
## Purpose
Build predictable accessible interaction surfaces.
## Architecture
Route containers fetch/coordinate; product components receive typed props; Zustand owns narrow cross-route client state.
## Libraries
React 19, TanStack Query, Zustand.
## Folder structure
Components by product concept, hooks by boundary, fixtures separate.
## Best practices
Semantic HTML, controlled forms, stable keys, derived state, focus restoration, effects only for synchronization.
## Performance targets
INP ≤180 ms; virtualize >200 rows; memoize only measured bottlenecks.
## Security considerations
Never render unsanitized HTML or put secrets in state.
## Examples
Capture dialog retains input through API failure and announces status.
## Anti-patterns
Effect-driven derived state, index keys, inaccessible div buttons, context for every value.
## Testing strategy
Interaction, keyboard, error, and reduced-motion tests.
## Production checklist
All states, names/roles, cleanup, console, mobile verified.
