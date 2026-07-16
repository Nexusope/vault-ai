# Performance Budgets

Desktop LCP ≤2.0 s, mobile LCP ≤2.5 s, INP ≤180 ms, CLS ≤0.05, and initial route JavaScript ≤250 KB gzip excluding lazily loaded 3D/chart code. Metadata API p95 is 150 ms, hybrid search 400 ms, assistant first token 800 ms, capture acknowledgement 2 s, embedding batch 3 s, one-minute transcript 30 s, and fusion 8 s.

The Galaxy targets 60 FPS desktop and 30 FPS minimum, caps device pixel ratio at 1.5, uses level of detail and 2D fallback on mobile/reduced motion. Routes dynamically import Three.js and charting in the optimization phase; the current build warns about a large chunk and must be split before public scale.

Performance is measured in CI and production by device class. Regressions over 10% fail the budget review. Caches include immutable assets, query results by tenant, embeddings by content hash, and precomputed graph layouts. No cache may bypass authorization or retain deleted content.
