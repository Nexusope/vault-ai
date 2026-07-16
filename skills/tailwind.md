# Tailwind Skill
## Purpose
Apply utility styling without weakening Vault design tokens.
## Architecture
Tokens remain CSS custom properties; utilities compose layout and responsive behavior.
## Libraries
Tailwind CSS 4 and PostCSS.
## Folder structure
Global token/theme CSS in `app/globals.css`; component-specific composition with component.
## Best practices
Use semantic token variables, mobile-first breakpoints, visible focus, reduced-motion variants.
## Performance targets
No runtime styling; keep generated CSS bounded.
## Security considerations
Do not interpolate arbitrary user strings into class names.
## Examples
Map a finite status enum to approved token classes.
## Anti-patterns
Literal color sprawl, `!important` chains, dynamic unscannable classes.
## Testing strategy
Visual/contrast/responsive snapshots.
## Production checklist
Token audit, dark/light contrast, purge output, 320px overflow check.
