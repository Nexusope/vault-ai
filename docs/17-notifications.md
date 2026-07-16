# Notifications

Notification types are trend threshold, import completed/failed, fusion completed, recommendation ready, security event, and workspace invitation. Domain events create notification records through idempotent templates. User preferences define channel, quiet hours, digest frequency, threshold, and per-type enablement.

In-app delivery is immediate through SSE and remains durable until read. Email and push are queued, rate-limited, and suppressed during quiet hours except security alerts. Duplicate key is `(user, type, aggregate, templateVersion, cooldownWindow)`. Failed external delivery retries five times, then records a terminal state without blocking in-app delivery.

Templates are localized, versioned, and render from validated variables. Links are relative application routes; no secret or private content appears in a notification preview. Targets are <2 seconds from completion to in-app alert and <2 minutes to external delivery.
