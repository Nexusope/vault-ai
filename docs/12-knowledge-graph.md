# Knowledge Graph

Node types are `Idea`, `Creator`, `Audio`, `Hook`, `Topic`, `Audience`, `Style`, `Trend`, `Collection`, `Script`, and `Asset`. Edge types are `SIMILAR_TO`, `USES_AUDIO`, `USES_HOOK`, `TARGETS`, `HAS_STYLE`, `PART_OF`, `TRENDING_WITH`, `INSPIRED_BY`, `REFERENCES`, and `CREATED_FROM`. Every edge stores weight 0–1, confidence 0–1, evidence source, algorithm/prompt version, and timestamps.

Symmetric edges use canonical ordered node ids; directed edges preserve semantic direction. Automatic edges require confidence ≥0.72 and are recomputed when embeddings or analysis versions change. User-created edges are immutable evidence and never overwritten by automation. Low-confidence candidates remain in a review queue.

The initial implementation derives graph views from relational records and client fixtures. At scale, PostgreSQL remains the authority, Qdrant provides nearest-neighbor candidates, and a graph projection optimizes traversal. A projection can be rebuilt entirely from domain events.

Galaxy clustering uses weighted similarity across embedding (0.45), topic overlap (0.20), hook/style (0.15), audience (0.10), audio (0.05), and recency-adjusted trend (0.05). Layout positions are cached per workspace and updated incrementally to avoid disorienting jumps. The 3D view targets 60 FPS desktop, limits visible nodes by level of detail, and provides a complete list/network fallback for keyboard, reduced-motion, and low-power devices.

Traversal APIs cap depth at three, nodes at 500, and execution at 400 ms. Explanations return the shortest high-weight evidence paths so recommendations and search results can state why they matched.
