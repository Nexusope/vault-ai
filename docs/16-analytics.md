# Analytics

Analytics separates operational telemetry from product behavior. Product events use a versioned envelope with anonymous actor, tenant, session, event, timestamp, route, properties, consent, and trace. Never include prompt text, transcripts, URLs containing tokens, or provider keys.

Core metrics are weekly active creators, capture-to-analysis success, search success, idea reuse, fusion completion, recommendation acceptance, provider cost per active creator, and time-to-first-value. Funnel definitions and denominators are fixed in a metric catalog. Late events are accepted for 72 hours and aggregates are recomputed.

The visible Intelligence page begins with realistic fixtures; production charts read pre-aggregated daily tables. Queries are tenant-scoped and return within 500 ms. Raw product events retain 90 days, aggregates 25 months, and users can opt out of nonessential analytics. Metric changes require owner, formula, effective date, validation query, and dashboard update.
