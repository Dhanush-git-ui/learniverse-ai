# Performance audit

**Reviewed:** 2026-11-08. No benchmark or load test was run; no concurrency target is claimed.

## Source findings

- API and assessment modules each own PostgreSQL pools. Pool sizing is configured separately and can multiply connection demand across workers.
- The AI pipeline performs embedding retrieval followed by two persona generations. Retrieval now runs in a worker thread; provider latency and external quota remain dominant.
- Code execution has a semaphore and remote request timeouts, but limit consistency and memory/CPU/output caps at the Judge0 deployment were not measured.
- Production frontend build emits chunks above 500 kB (including Monaco/editor and page bundles). The build succeeds but reports chunk-size warnings.
- Existing load scripts are present under `backend/tests`, but use development credentials and were not run against any service.

## Evidence and next measurement

Frontend production build completed successfully; Vite reported several chunks over 500 kB. No 1/10/25/50/100/120-user measurements, database saturation results, or provider-latency distributions are available. Run the existing load scripts only after replacing fixed development keys with isolated credentials and targetting a disposable staging environment. Record P50/P95/P99, RPS, errors, CPU, memory, pool occupancy, queue depth and provider time for each workload.

**Pilot status:** 120 concurrent students is unverified. Do not advertise this capacity.
