from locust import HttpUser, task, between, events
from locust.contrib.fasthttp import FastHttpUser
import json
import time
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class CodeExecutionUser(FastHttpUser):
    """Simulates a user executing code via Judge0."""

    wait_time = between(1, 5)  # Wait 1-5 seconds between tasks

    def on_start(self):
        """Called when a user is created."""
        self.user_id = self.client.get("/health").status_code
        logger.info(f"User {self.client.base_url} started")

    @task(5)
    def execute_python_simple(self):
        """Execute simple Python code (most common)."""
        code = """
def sum_numbers(n):
    return sum(range(1, n + 1))

result = sum_numbers(100)
print(f"Sum: {result}")
"""
        payload = {
            "language": "python",
            "code": code,
            "stdin": ""
        }

        with self.client.post(
            "/api/code/execute-raw",
            json=payload,
            catch_response=True,
            timeout=15
        ) as response:
            if response.status_code == 200:
                try:
                    data = response.json()
                    if data.get("status") in ["success", "completed"]:
                        response.success()
                    else:
                        response.failure(f"Execution failed: {data.get('error')}")
                except Exception as e:
                    response.failure(f"Response parsing error: {e}")
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(3)
    def execute_cpp(self):
        """Execute C++ code."""
        code = """
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {1, 2, 3, 4, 5};
    int sum = 0;

    for (int num : nums) {
        sum += num;
    }

    cout << "Sum: " << sum << endl;
    return 0;
}
"""
        payload = {
            "language": "cpp",
            "code": code,
            "stdin": ""
        }

        with self.client.post(
            "/api/code/execute-raw",
            json=payload,
            catch_response=True,
            timeout=15
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(2)
    def execute_javascript(self):
        """Execute JavaScript code."""
        code = """
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci(10):", fibonacci(10));
"""
        payload = {
            "language": "javascript",
            "code": code,
            "stdin": ""
        }

        with self.client.post(
            "/api/code/execute-raw",
            json=payload,
            catch_response=True,
            timeout=15
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")

    @task(1)
    def execute_with_input(self):
        """Execute code with stdin input."""
        code = """
name = input("Enter name: ")
age = input("Enter age: ")
print(f"Hello {name}, you are {age} years old")
"""
        stdin_data = "Alice\n25\n"

        payload = {
            "language": "python",
            "code": code,
            "stdin": stdin_data
        }

        with self.client.post(
            "/api/code/execute-raw",
            json=payload,
            catch_response=True,
            timeout=15
        ) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"HTTP {response.status_code}")


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    """Called when load test starts."""
    print("\n" + "="*60)
    print("Judge0 Load Test - 300 Concurrent Users")
    print("="*60)
    print(f"Target: {environment.host}")
    print(f"Users: {environment.runner.target_user_count}")
    print(f"Spawn rate: {environment.runner.spawn_rate} users/sec")
    print("="*60 + "\n")


@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    """Called when load test stops."""
    print("\n" + "="*60)
    print("Test Results Summary")
    print("="*60)

    stats = environment.stats
    total_requests = stats.total.num_requests
    total_failures = stats.total.num_failures
    success_rate = ((total_requests - total_failures) / total_requests * 100) if total_requests > 0 else 0

    print(f"Total Requests: {total_requests}")
    print(f"Total Failures: {total_failures}")
    print(f"Success Rate: {success_rate:.2f}%")
    print(f"Average Response Time: {stats.total.avg_response_time:.2f}ms")
    print(f"Median Response Time: {stats.total.median_response_time:.2f}ms")
    print(f"P95 Response Time: {stats.total.get_response_time_percentile(0.95):.2f}ms")
    print(f"P99 Response Time: {stats.total.get_response_time_percentile(0.99):.2f}ms")
    print(f"Min Response Time: {stats.total.min_response_time:.2f}ms")
    print(f"Max Response Time: {stats.total.max_response_time:.2f}ms")
    print("="*60 + "\n")


# Usage:
# locust -f loadtest.py --host=http://localhost:8000 -u 300 -r 10 --run-time 10m
#
# Interpretation:
# - 300 concurrent users
# - 10 users spawned per second
# - Run for 10 minutes
#
# Expected metrics (for properly scaled Judge0):
# - Success Rate: > 99%
# - P95 Response: < 5000ms
# - P99 Response: < 10000ms
# - Average: < 2000ms
