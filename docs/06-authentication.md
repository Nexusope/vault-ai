# Authentication and Authorization

Use Clerk for the hosted product because it provides mature organization membership, session management, MFA, passkeys, and enterprise SSO while keeping application code focused on workspace authorization. The edge preview deliberately has no sign-in gate; it contains demo data and must not be used for private production content until Clerk is enabled.

The browser receives an HttpOnly, Secure, SameSite=Lax session cookie. API middleware verifies issuer, audience, expiry, and signature, then services resolve membership from the database. Roles are `owner`, `admin`, `editor`, `viewer`, and `service`. Capabilities—not role strings—guard actions: manage billing, manage members, connect sources, write ideas, run AI, export, and view audit logs.

Instagram is a separate credential boundary. The agent must never perform `instagram-cli auth login`; the user completes login in their terminal. Vault AI stores only connection status, account handle, and last successful sync. The CLI owns its local session. Hosted services cannot execute a CLI on the user’s computer, so an explicit loopback bridge/desktop companion is required.

Sessions expire after 12 hours of inactivity and 7 days absolute, with step-up authentication for export, organization deletion, and credential changes. Service accounts use scoped, rotated tokens stored in a secret manager. Authorization tests cover tenant isolation, revoked membership, stale sessions, object-level access, and role downgrade.
