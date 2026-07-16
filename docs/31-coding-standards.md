# Coding Standards

TypeScript is strict. Avoid `any`, non-null assertions, hidden global state, and stringly typed domain status. Validate every external input with Zod and narrow every caught error. Functions should express one invariant; domain decisions live outside routes/components; vendor calls stay behind interfaces.

React components use semantic HTML, accessible names, controlled interaction state, stable keys, and effects only for synchronization. Do not fetch in leaf visual components. CSS consumes tokens, starts mobile-safe, honors reduced motion, and avoids magic z-index/spacing outside the scale.

Database code uses parameterized queries, explicit transactions, tenant predicates, bounded result sets, and forward migrations. Logs are structured and redacted. Tests assert outcomes and failure paths, not implementation details. Comments explain why an invariant exists, not what the next line does.
