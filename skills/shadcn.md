# shadcn/ui Skill
## Purpose
Use accessible primitives while preserving Vault’s visual language.
## Architecture
Own copied component source and wrap primitives with product-specific APIs.
## Libraries
shadcn/ui, Radix primitives, class-variance-authority.
## Folder structure
`components/ui` primitives; product components outside it.
## Best practices
Preserve Radix focus/keyboard semantics; theme through tokens; expose intent variants.
## Performance targets
Import only used primitives; lazy complex dialogs if needed.
## Security considerations
Escape displayed content; confirmation for destructive actions.
## Examples
Dialog primitive powers Capture with labelled title and focus return.
## Anti-patterns
Editing accessibility internals away, generic component dumping, uncontrolled destructive menus.
## Testing strategy
Role/name/keyboard/focus tests and visual variants.
## Production checklist
Source reviewed, dependency pinned, all variants documented.
