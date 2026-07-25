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

async def run_concurrent_requests(client, endpoint, payload, concurrency):
    start_time = time.perf_counter()
    successes = 0
    failures = 0
    status_codes = {}
    latencies = []

    async def worker(idx):
        nonlocal successes, failures
        t0 = time.perf_counter()
        try:
            res = await client.post(endpoint, json=payload, headers=HEADERS, timeout=35.0)
            elapsed = time.perf_counter() - t0
            latencies.append(elapsed)
            code = res.status_code
            status_codes[code] = status_codes.get(code, 0) + 1
            if code == 200:
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
    p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0

    return {
        "concurrency": concurrency,
        "total_time_sec": round(total_time, 2),
        "successes": successes,
        "failures": failures,
        "status_codes": status_codes,
        "p50_sec": round(p50, 3),
        "p95_sec": round(p95, 3),
        "p99_sec": round(p99, 3),
    }

async def main():
    print("=====================================================")
    print("HIGH-SCALE 120-USER VERIFICATION LOAD HARNESS")
    print("=====================================================")
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        
        # 1. High Concurrency DB Start Attempt Endpoint (/api/assessment/start)
        print("\n--- 1. Testing DB Start Attempt Endpoint at 120 Concurrent Users ---")
        async def db_start_worker(idx):
            u_id = f"scale_user_120_{idx}_{time.time()}"
            try:
                res = await client.post(
                    "/api/assessment/start", 
                    json={"user_id": u_id, "browser_info": {}},
                    headers=HEADERS, 
                    timeout=35.0
                )
                return res.status_code
            except Exception as e:
                return type(e).__name__

        t0 = time.perf_counter()
        results = await asyncio.gather(*[db_start_worker(i) for i in range(120)])
        duration = time.perf_counter() - t0
        counts = {}
        for r in results:
            counts[r] = counts.get(r, 0) + 1
        
        success_rate = (counts.get(200, 0) / 120) * 100
        error_rate = 100 - success_rate
        print(f"Concurrency: 120 | Duration: {duration:.2f}s | Success Rate: {success_rate:.1f}% | Error Rate: {error_rate:.1f}% | Results: {counts}")

        # 2. Race Condition / Double Submit Test
        print("\n--- 2. Verifying Double-Submit Prevention (FOR UPDATE Lock) ---")
        user_id_race = f"race_user_{int(time.time())}"
        start_res = await client.post("/api/assessment/start", json={"user_id": user_id_race}, headers=HEADERS)
        attempt_id = start_res.json().get("attempt_id")
        
        submit_payload = {
            "attempt_id": attempt_id,
            "answers": {"apt_1": "A"},
            "coding_submissions": {}
        }
        
        res1, res2 = await asyncio.gather(
            client.post("/api/assessment/submit", json=submit_payload, headers=HEADERS),
            client.post("/api/assessment/submit", json=submit_payload, headers=HEADERS)
        )
        print(f"Double Submit Statuses: Request 1 -> {res1.status_code}, Request 2 -> {res2.status_code}")

if __name__ == "__main__":
    asyncio.run(main())
