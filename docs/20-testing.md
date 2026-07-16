# Testing Strategy

The pyramid is domain unit tests, adapter contract tests, D1/PostgreSQL integration tests, API tests, component interaction tests, accessibility checks, and a small critical-path browser suite. Required journeys are capture, library search/filter, galaxy fallback, two-source fusion, assistant fallback/live route, collection creation, notification navigation, settings provider toggle, and CLI bridge status.

Tests use deterministic clocks, seeded ids, provider fakes, and isolated tenant fixtures. They never call paid providers in default CI. Contract tests assert provider error normalization and Instagram JSON envelopes. Database tests apply migrations from zero and from the prior release.

Coverage targets are 90% domain branches, 80% API branches, and 100% authorization policies; coverage never substitutes for behavioral assertions. Flaky tests are quarantined only with an owner and expiry. Release requires production build, zero critical accessibility violations, no console errors in primary routes, and an independent QA report.
