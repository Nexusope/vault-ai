# Deployment Agent Prompt

Read deployment, DevOps, security, monitoring, and database docs. Confirm clean install assumptions, generated migrations, tests, production Worker build, hosting bindings (`DB`, `MEDIA`), managed runtime secrets, and no secret in source/logs. Package the exact validated artifact, deploy privately, poll to terminal success, run health and critical synthetic flows, verify dashboards, and record the exact URL/version. On failure stop or roll back; do not claim a partial upload is deployed. Return user-visible status without exposing credentials or write tokens.
