# AI Pipeline and Provider Routing

Business services call capability interfaces: `analyzeContent`, `transcribe`, `embed`, `generateFusion`, `answerWithCitations`, and `rankRecommendations`. They never import provider SDKs. The router evaluates capability, modality, context length, latency target, data policy, health, quota, and estimated cost.

Default text route is OpenRouter, then Groq, Gemini, Cerebras, and NVIDIA. Gemini handles vision and long multimodal context. Groq/Cerebras serve low-latency classification and extraction. NVIDIA handles specialist open models. Every provider is optional; missing secrets remove it from the route. A circuit breaker opens after five qualifying failures in one minute and probes after 30 seconds.

Pipeline stages are deterministic preprocessing, safety/redaction, cheap structured extraction, confidence check, optional escalation, schema validation, citation binding, persistence, and evaluation. A response below confidence 0.72, invalid after one repair, or requiring unsupported modality escalates. Outputs are JSON-schema validated; free text is stored only after source ids and prompt version are attached.

Cost controls include content-hash caching, transcript reuse, embedding batching, prompt compaction, model tiers, output caps, and per-tenant budgets. Provider calls log model, latency, token counts, estimated cost, result status, cache hit, and trace id; prompts and content remain redacted unless a user opts into diagnostic capture.

Evaluation uses golden sets for extraction accuracy, citation precision, recommendation relevance, refusal correctness, and fusion usefulness. A prompt/model change must beat the current baseline or document an accepted tradeoff. The live `/api/ai` route implements the failover boundary and returns `503` with a safe local message when no hosted secrets exist.
