# Framer Motion Skill
## Purpose
Add purposeful hierarchy and state transitions.
## Architecture
Motion wraps route/panel state; CSS handles simple hover; a shared token set controls timing/easing.
## Libraries
Framer Motion.
## Folder structure
Variants near components; global motion tokens in theme.
## Best practices
Animate opacity/transform, use layout sparingly, preserve focus, honor reduced motion.
## Performance targets
60 FPS and ≤240 ms routine transitions.
## Security considerations
Motion must not obscure warnings or confirmation state.
## Examples
Route content enters with 12px/opacity over 240 ms.
## Anti-patterns
Continuous decorative motion, layout thrash, animation as only status cue.
## Testing strategy
Reduced-motion and interaction completion tests.
## Production checklist
No jank, no focus loss, no essential delayed action.
