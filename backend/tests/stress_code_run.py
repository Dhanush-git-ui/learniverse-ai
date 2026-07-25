import asyncio
import time
import json
import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import httpx
from app import app

API_KEY = "devsecretkey"
HEADERS = {
    "X-API-Key": API_KEY,
    "Content-Type": "application/json"
}

async def run_concurrent_code_requests(concurrency):
    transport = httpx.ASGITransport(app=app)
    payload = {
        "problemId": "code_two_sum",
        "language": "python",
        "code": "def solve(nums, target):\n    return [0, 1]"
    }
    
    start_time = time.perf_counter()
    successes = 0
    failures = 0
    status_codes = {}
    latencies = []

    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        async def worker(idx):
            nonlocal successes, failures
            t0 = time.perf_counter()
            try:
                res = await client.post("/api/code/run", json=payload, headers=HEADERS, timeout=40.0)
                elapsed = time.perf_counter() - t0
                latencies.append(elapsed)
                code = res.status_code
                status_codes[code] = status_codes.get(code, 0) + 1
                if code in (200, 429):  # 429 is rate limit / queue busy protection (handled)
                    successes += 1
                else:
                    failures += 1
            except Exception as e:
                elapsed = time.perf_counter() - t0
                latencies.append(elapsed)
                failures += 1
                err_name = type(e).__name__
                status_codes[err_name] = status_codes.get(err_name, 0) + 1

        tasks = [worker(i) for i in range(concurrency)]
        await asyncio.gather(*tasks)

    total_time = time.perf_counter() - start_time
    latencies.sort()
    p50 = latencies[int(len(latencies) * 0.50)] if latencies else 0
    p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0

    print(f"Concurrency: {concurrency} | Duration: {total_time:.2f}s | Statuses: {status_codes} | p50: {p50:.2f}s | p95: {p95:.2f}s")
    return status_codes

async def main():
    print("=====================================================")
    print("STRESS TESTING /api/code/run AT 80 & 120 CONCURRENT")
    print("=====================================================")
    
    print("\n--- Running 80 Concurrent Code Executions ---")
    await run_concurrent_code_requests(80)

    print("\n--- Running 120 Concurrent Code Executions ---")
    await run_concurrent_code_requests(120)

if __name__ == "__main__":
    asyncio.run(main())
