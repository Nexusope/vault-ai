# Performance Skill
## Purpose
Meet explicit frontend, API, worker, search, and 3D budgets.
## Architecture
Measure first; optimize critical path, data shape, caching, concurrency, and lazy boundaries.
## Libraries
Web Vitals, profiler, load tool, query explain, bundle analyzer.
## Folder structure
Benchmarks, scenarios, baselines, reports.
## Best practices
Representative devices/data, p95/p99, regression thresholds, auth-safe cache.
## Performance targets
Use `docs/22-performance.md`.
## Security considerations
Never trade authorization/deletion for cache speed.
## Examples
Lazy-load Galaxy/chart chunks and cap Canvas DPR.
## Anti-patterns
Micro-optimizing without profile, unbounded prefetch, hiding slow errors.
## Testing strategy
CI budget plus production RUM/load.
## Production checklist
Baseline, bottleneck proof, regression gate, capacity/alert.
