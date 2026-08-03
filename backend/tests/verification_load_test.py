import asyncio
import time
import json
import os
import sys

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import httpx
from app import app, get_code_execution_semaphore

API_KEY = "devsecretkey"

async def run_scenario(concurrency):
    # Ensure code execution semaphore is initialized
    get_code_execution_semaphore()
    
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://test") as client:
        start_time = time.perf_counter()
        
        status_counts = {}
        latencies = []
        compiler_failures = 0
        total_requests = 0
        
        async def student_flow(idx):
            nonlocal total_requests, compiler_failures
            roll = f"23E51A05{idx:02d}"
            headers = {
                "X-API-Key": API_KEY,
                "X-Roll-Number": roll,
                "Content-Type": "application/json"
            }
            
            # Step 1: Start Attempt
            t0 = time.perf_counter()
            try:
                res1 = await client.post('/api/assessment/start', json={'user_id': roll, 'roll_number': roll, 'browser_info': {}}, headers=headers, timeout=30.0)
                latencies.append(time.perf_counter() - t0)
                code = res1.status_code
                status_counts[code] = status_counts.get(code, 0) + 1
                total_requests += 1
                if code != 200:
                    return
                data = res1.json()
                attempt_id = data.get('attempt_id')
            except Exception as e:
                latencies.append(time.perf_counter() - t0)
                err = type(e).__name__
                status_counts[err] = status_counts.get(err, 0) + 1
                total_requests += 1
                return

            # Step 2: Log Violation
            t0 = time.perf_counter()
            try:
                res2 = await client.post('/api/assessment/log-violation', json={'attempt_id': attempt_id, 'violation_type': 'fullscreen_exit', 'details': 'Exited fullscreen'}, headers=headers, timeout=10.0)
                latencies.append(time.perf_counter() - t0)
                code = res2.status_code
                status_counts[code] = status_counts.get(code, 0) + 1
                total_requests += 1
            except Exception as e:
                latencies.append(time.perf_counter() - t0)
                err = type(e).__name__
                status_counts[err] = status_counts.get(err, 0) + 1
                total_requests += 1

            # Step 3: Periodic Auto-Save
            t0 = time.perf_counter()
            try:
                res_auto = await client.post('/api/assessment/autosave', json={'attempt_id': attempt_id, 'answers': {'apt_0001': 'A'}, 'coding_submissions': {}}, headers=headers, timeout=10.0)
                latencies.append(time.perf_counter() - t0)
                code = res_auto.status_code
                status_counts[code] = status_counts.get(code, 0) + 1
                total_requests += 1
            except Exception as e:
                latencies.append(time.perf_counter() - t0)
                err = type(e).__name__
                status_counts[err] = status_counts.get(err, 0) + 1
                total_requests += 1

            # Step 4: Run Code
            t0 = time.perf_counter()
            try:
                res3 = await client.post('/api/code/run', json={'problemId': 'code_0001', 'language': 'python', 'code': 'def solve(nums):\n    return nums'}, headers=headers, timeout=30.0)
                latencies.append(time.perf_counter() - t0)
                code = res3.status_code
                status_counts[code] = status_counts.get(code, 0) + 1
                total_requests += 1
                if code != 200:
                    compiler_failures += 1
            except Exception as e:
                latencies.append(time.perf_counter() - t0)
                compiler_failures += 1
                err = type(e).__name__
                status_counts[err] = status_counts.get(err, 0) + 1
                total_requests += 1

            # Step 5: Submit Final Assessment
            t0 = time.perf_counter()
            try:
                res4 = await client.post('/api/assessment/submit', json={'attempt_id': attempt_id, 'answers': {'apt_0001': 'A'}, 'coding_submissions': {}}, headers=headers, timeout=30.0)
                latencies.append(time.perf_counter() - t0)
                code = res4.status_code
                status_counts[code] = status_counts.get(code, 0) + 1
                total_requests += 1
            except Exception as e:
                latencies.append(time.perf_counter() - t0)
                err = type(e).__name__
                status_counts[err] = status_counts.get(err, 0) + 1
                total_requests += 1

        await asyncio.gather(*[student_flow(i) for i in range(concurrency)])
        
        duration = time.perf_counter() - start_time
        latencies.sort()
        
        p50 = latencies[int(len(latencies) * 0.50)] if latencies else 0
        p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0
        p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0
        avg_lat = sum(latencies) / len(latencies) if latencies else 0
        max_lat = latencies[-1] if latencies else 0
        
        succ = status_counts.get(200, 0)
        fails = total_requests - succ
        rps = round(total_requests / duration, 2)
        
        print(f"=== Concurrency Level: {concurrency} ===")
        print(f"Duration: {duration:.2f}s | RPS: {rps} | Total Requests: {total_requests} | Successes: {succ} | Failures: {fails}")
        print(f"Status Breakdown: {status_counts}")
        print(f"Latencies -> Avg: {avg_lat*1000:.1f}ms | p50: {p50*1000:.1f}ms | p95: {p95*1000:.1f}ms | p99: {p99*1000:.1f}ms | Max: {max_lat*1000:.1f}ms")
        print(f"Compiler Failures / Rate Limits: {compiler_failures}\n")

async def main():
    print("=========================================================")
    print("POST-FIX VERIFICATION LOAD TEST (1 to 150 CONCURRENT USERS)")
    print("=========================================================\n")
    for c in [1, 10, 25, 50, 75, 100, 120, 150]:
        await run_scenario(c)
        await asyncio.sleep(1)

if __name__ == "__main__":
    asyncio.run(main())
