# Prompt Library

Prompts are versioned product artifacts with identifier, semantic version, owner, capability, input/output JSON schemas, model constraints, examples, safety rules, token budget, evaluation set, and change rationale. Templates never interpolate untrusted content into system instructions; source text is delimited and explicitly labeled data.

Required prompts cover content extraction, transcript cleanup, hook/style analysis, trend explanation, semantic query interpretation, recommendation rationale, Fusion concept/script/storyboard/shot list/caption/hashtag outputs, assistant answer with citations, thumbnail concept, and repair of invalid structured output.

Deployments pin prompt versions. A candidate runs golden and adversarial evaluations before promotion. Rollback changes configuration, not code. Prompt logs store version and hashes by default, with raw content only under explicit diagnostic consent. All outputs carry source ids; unsupported claims are omitted or marked uncertain.
