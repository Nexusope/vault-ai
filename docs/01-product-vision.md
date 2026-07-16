# Vault AI Product Vision

Vault AI is a creative intelligence operating system for creators who save more inspiration than they can reuse. It converts fragmented references into a private, searchable idea graph and then turns that graph into concrete creative decisions. The product promise is: capture any useful signal, understand why it matters, connect it to prior thinking, and produce an original execution without losing provenance.

The first release serves an individual creator using Instagram and manual URLs. It includes the Control Room, Library, Idea Galaxy, Fusion Lab, AI Operator, Deep Search, Collections, Intelligence, Notifications, and Settings. Instagram access is local-first through the unofficial `instagram-cli`; Vault AI never accepts an Instagram password. Future sources implement the same `SourceAdapter` contract for TikTok, YouTube, Pinterest, Threads, X, Facebook, Reddit, web pages, PDFs, media files, voice notes, and notes.

Success is measured by activation (first 10 captures and first fusion), weekly reused ideas, search success without reformulation, time from signal to production brief, and percentage of generated work that cites source ideas. Guardrail metrics include provider cost per active user, failed-import rate, duplicate rate, and user-reported originality concerns.

The product deliberately does not automate engagement, mass messaging, scraping, or posting. Instagram CLI usage is user-initiated, rate-limited, and subject to Meta terms. Enterprise evolution adds organizations, role-based access, audit logs, retention policy, regional data residency, and export/delete workflows without changing the core idea model.

The quality bar is a sub-two-second interactive shell, keyboard-complete workflows, WCAG AA contrast, explainable recommendations, recoverable background processing, and no provider credentials in browser code. Every AI output records provider, model, prompt version, source ids, latency, cost estimate, and confidence so users can inspect how it was produced.
