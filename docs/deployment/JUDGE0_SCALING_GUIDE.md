# Judge0 Production Scaling Guide for 300 Concurrent Users

## Overview

This guide walks through scaling Judge0 to handle 300 concurrent users executing code simultaneously. The architecture uses:
- **Load Balancer (Nginx)**: Distributes traffic across workers
- **Judge0 Server**: API endpoint for submissions
- **Multiple Workers**: Parallel code execution (3+ workers)
- **PostgreSQL**: Persistent storage for submissions
- **Redis**: Caching & session management

---

## Architecture Diagram

```
┌─────────────────────────────────────────────┐
│        300 Concurrent Users                 │
│   (Learniverse Frontend/Mobile Apps)        │
└──────────────────┬──────────────────────────┘
                   │ HTTP/HTTPS
                   ▼
        ┌──────────────────────┐
        │   Nginx Load Balancer│
        │   (least_conn algo)  │
        └──────────────────────┘
                   │
        ┌──────────┼──────────┬──────────┐
        │          │          │          │
   ┌────▼──┐  ┌────▼──┐  ┌────▼──┐  ┌──▼───┐
   │Server │  │Worker1│  │Worker2│  │Worker3│
   │:3000  │  │:3000  │  │:3000  │  │:3000  │
   └────┬──┘  └────┬──┘  └────┬──┘  └──┬───┘
        │          │          │         │
        └──────────┼──────────┼─────────┘
                   │          │
        ┌──────────▼──┐  ┌────▼──────┐
        │  PostgreSQL │  │   Redis   │
        │  Database   │  │  Cache    │
        └─────────────┘  └───────────┘
```

---

## Deployment Steps

### 1. Prerequisites
- Docker & Docker Compose installed
- Minimum specs: 8 CPU cores, 16GB RAM, 50GB storage
- Cloud options: AWS ECS, Azure ACI, DigitalOcean, Render.com

### 2. Setup Production Environment

**Step 1: Create `.env.production`** (already provided)

```bash
cd learniverse-ai
cat > .env.production << 'EOF'
DATABASE_URL=postgresql://judge0:your_secure_password@postgres:5432/learniverse_db
DB_POOL_MIN_CONNS=20
DB_POOL_MAX_CONNS=100

JUDGE0_URL=http://nginx/
JUDGE0_API_KEY=

ALLOW_LOCAL_EXECUTION=false
CODE_EXECUTION_SEMAPHORE_LIMIT=250

GEMINI_API_KEY=your_key
GOOGLE_API_KEY=your_key
GEMINI_MODEL_NAME=gemini-2.0-flash

REDIS_URL=redis://redis:6379

ENV=production
API_SECRET_KEY=$(openssl rand -hex 32)
SECRET_KEY_BASE=$(openssl rand -hex 32)

FRONTEND_URL=https://yourdomain.com

POSTGRES_PASSWORD=your_secure_password
JUDGE0_AUTH_TOKEN=your_judge0_auth_token
EOF
```

**Step 2: Deploy Docker Compose** (use provided `docker-compose.prod.yml`)

```bash
# Copy production compose file
cp docker-compose.prod.yml docker-compose.yml

# Start services
docker-compose up -d

# Verify all services are healthy
docker-compose ps
```

Expected output:
```
NAME               STATUS              PORTS
judge0_postgres    Up (healthy)        5432
judge0_redis       Up (healthy)        6379
judge0_server      Up (healthy)        2358->3000
judge0_worker_1    Up (healthy)        
judge0_worker_2    Up (healthy)        
judge0_worker_3    Up (healthy)        
judge0_nginx       Up                  80->80, 443->443
```

### 3. Backend Configuration for 300 Users

Update `backend/config.py`:

```python
# For 300 concurrent users:
self.DB_POOL_MIN_CONNS = 20         # Min DB connections
self.DB_POOL_MAX_CONNS = 100        # Max DB connections
self.CODE_EXECUTION_SEMAPHORE_LIMIT = 250  # Max parallel code runs
```

Update `backend/app.py` startup (lifespan function):

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    global _db_pool, _code_execution_semaphore
    
    # Initialize with larger semaphore for 300 users
    _code_execution_semaphore = asyncio.Semaphore(250)
    
    if DB_URL:
        try:
            _db_pool = ThreadedConnectionPool(
                minconn=20,      # Increased from default
                maxconn=100,     # Increased from default
                dsn=DB_URL
            )
        except Exception as e:
            logger.error("[DB STARTUP] DB pool init failed: %s", e)
    
    yield
    
    # Shutdown cleanup
    if _db_pool and not _db_pool.closed:
        _db_pool.closeall()
```

---

## Performance Tuning

### 1. Judge0 Configuration

Each worker can handle ~30-50 concurrent submissions. For 300 users:
- **Minimum workers**: 6 (6 × 50 = 300)
- **Recommended**: 8-10 workers (redundancy)
- **Per-worker setting**: `JUDGE0_WORKER_PROCESSES=4`

Adjust in `docker-compose.prod.yml`:

```yaml
judge0_worker_4:
  image: judge0/judge0-ce:1.13.0
  # ... duplicate worker_3 and increment name
  
judge0_worker_5:
  image: judge0/judge0-ce:1.13.0
  # ... duplicate worker_4

# Add more as needed
```

### 2. Database Optimization

```sql
-- Connect to PostgreSQL
psql -h localhost -U judge0 -d learniverse_db

-- Create indexes for faster submission lookups
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);

-- Optimize table
VACUUM ANALYZE submissions;
```

### 3. Redis Configuration

Current setting (from `docker-compose.prod.yml`):
```yaml
command: redis-server --appendonly yes --maxmemory 2gb --maxmemory-policy allkeys-lru
```

For 300 users, increase to 4GB:
```yaml
command: redis-server --appendonly yes --maxmemory 4gb --maxmemory-policy allkeys-lru
```

### 4. Nginx Tuning

The provided `nginx.conf` includes:
- **worker_processes: auto** (scales to CPU count)
- **worker_connections: 4096** (handles 4096 connections per worker)
- **least_conn** load balancing (distributes evenly)
- **Connection pooling** for backend

For 300 concurrent users on 8-core machine:
```
Total connections = 8 workers × 4096 = 32,768 (more than enough)
```

### 5. Application-Level Optimizations

Add to `backend/app.py`:

```python
# Connection pooling for HTTP requests to Judge0
from httpx import AsyncClient

# Reuse HTTP client across requests
http_client = AsyncClient(
    limits=httpx.Limits(
        max_keepalive_connections=100,
        max_connections=200
    )
)

async def execute_code_via_judge0_optimized(language: str, code: str, stdin: str = ""):
    """Optimized Judge0 execution with connection reuse."""
    # Reuse http_client instead of creating new requests.Session()
    # This reduces overhead per request
    pass
```

---

## Monitoring & Metrics

### 1. Docker Health Checks

```bash
# Check service health
docker-compose ps

# View logs
docker-compose logs judge0_server --tail 50
docker-compose logs judge0_worker_1 --tail 50
docker-compose logs judge0_nginx --tail 50
```

### 2. Database Monitoring

```bash
# Connect to PostgreSQL
docker exec -it judge0_postgres psql -U judge0 -d learniverse_db

# Check submission queue
SELECT status, COUNT(*) FROM submissions GROUP BY status;

-- Expected for 300 active users:
-- status=1 (In Queue): 50-100
-- status=3 (Accepted): 50-200
-- status=5 (Runtime Error): 0-10
```

### 3. Redis Monitoring

```bash
# Check Redis memory usage
docker exec judge0_redis redis-cli INFO memory

# Monitor commands in real-time
docker exec judge0_redis redis-cli MONITOR
```

### 4. Judge0 Metrics Endpoint

```bash
# Check submission stats
curl http://localhost:2358/submissions | jq '.[] | {id, status, created_at}' | head -20

# Check system health
curl http://localhost/health
```

---

## Load Testing (Validation)

### 1. Locust Script for 300 Concurrent Users

Create `loadtest.py`:

```python
from locust import HttpUser, task, between
import json
import base64

class CodeExecutionUser(HttpUser):
    wait_time = between(1, 3)
    
    @task(3)
    def execute_python(self):
        code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
print(fibonacci(10))
"""
        payload = {
            "language": "python",
            "code": code,
            "stdin": ""
        }
        self.client.post("/api/code/execute-raw", json=payload)
    
    @task(1)
    def execute_cpp(self):
        code = """
#include <iostream>
using namespace std;
int main() {
    cout << "Hello from C++" << endl;
    return 0;
}
"""
        payload = {
            "language": "cpp",
            "code": code,
            "stdin": ""
        }
        self.client.post("/api/code/execute-raw", json=payload)
```

Run with 300 users:

```bash
locust -f loadtest.py --host=http://localhost:8000 -u 300 -r 10 --run-time 10m
```

Expected results:
- Response time: < 5s for 95th percentile
- Error rate: < 1%
- Throughput: 50-100 submissions/sec

---

## Scaling Beyond 300 Users

### Horizontal Scaling

**For 500 users**:
- Add 2-3 more Judge0 workers
- Increase DB pool: `maxconn=150`
- Increase Redis memory: 6GB
- Increase Nginx worker_connections: 8192

**For 1000+ users**:
- Deploy multiple Judge0 clusters across regions
- Use managed databases (RDS, CloudSQL)
- Use managed Redis (ElastiCache, Redis Cloud)
- Implement request queuing with Celery + RabbitMQ

### Deployment Platforms

**Option 1: Docker Swarm** (Simple scaling)
```bash
docker swarm init
docker stack deploy -c docker-compose.prod.yml judge0
```

**Option 2: Kubernetes** (Enterprise-grade)
Create `k8s-deployment.yaml` with:
- Horizontal Pod Autoscaler
- Service mesh (Istio)
- Persistent volumes for data

**Option 3: Managed Services**
- AWS ECS + RDS + ElastiCache
- Azure Container Instances + Azure Database
- DigitalOcean App Platform

---

## Cost Estimation (300 Concurrent Users)

### Self-Hosted (On-Premise / VPS)

| Component | CPU | RAM | Storage | Monthly Cost |
|-----------|-----|-----|---------|--------------|
| Nginx + Judge0 Server | 4 | 8GB | 20GB | $50-80 |
| 6 Workers | 12 | 12GB | 30GB | $100-150 |
| PostgreSQL | 2 | 4GB | 50GB | $40-60 |
| Redis | 1 | 4GB | 10GB | $20-30 |
| **Total** | **19** | **28GB** | **110GB** | **$210-320/mo** |

### Cloud-Hosted (AWS/GCP/Azure)

**AWS ECS + RDS + ElastiCache**:
- ECS tasks (6 workers × t3.medium): $120/mo
- RDS PostgreSQL (db.t3.large): $150/mo
- ElastiCache Redis (cache.t3.medium): $80/mo
- Load Balancer (ALB): $20/mo
- **Total**: ~$370/mo

---

## Troubleshooting

### Problem: "Judge0 Server Unresponsive"

```bash
# Check if server is running
docker-compose ps judge0_server

# View logs
docker-compose logs judge0_server --tail 100

# Restart service
docker-compose restart judge0_server
```

### Problem: "Database Connection Pool Exhausted"

```python
# Increase pool size in config.py
self.DB_POOL_MAX_CONNS = 150  # was 100
```

### Problem: "High Memory Usage"

```bash
# Check Redis memory
docker exec judge0_redis redis-cli INFO memory

# Clear old cache
docker exec judge0_redis redis-cli FLUSHDB

# Increase Redis maxmemory
docker-compose down
# Edit docker-compose.prod.yml: increase --maxmemory
docker-compose up -d redis
```

### Problem: "Workers Not Processing Submissions"

```bash
# Check worker status
docker-compose logs judge0_worker_1 --tail 50

# Ensure Redis is accessible from workers
docker exec judge0_worker_1 redis-cli -h redis ping

# Verify database connection
docker exec judge0_worker_1 psql -h postgres -U judge0 -d learniverse_db -c "SELECT 1"
```

---

## Maintenance

### Daily
- Monitor error rates in logs
- Check disk usage: `docker exec judge0_postgres df -h`

### Weekly
- Database vacuum: `VACUUM ANALYZE submissions;`
- Review slow queries

### Monthly
- Update Docker images: `docker pull judge0/judge0:latest`
- Review and optimize indexes

---

## References

- [Judge0 Official Docs](https://judge0.com)
- [Judge0 CE GitHub](https://github.com/judge0/judge0)
- [PostgreSQL Connection Pooling](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Redis Performance Tuning](https://redis.io/docs/management/optimization/)
- [Nginx Load Balancing](https://nginx.org/en/docs/http/load_balancing.html)

---

## Support

For issues or questions:
1. Check application logs: `docker-compose logs`
2. Verify connectivity: `docker exec judge0_server curl http://redis:6379`
3. Test Judge0 API: `curl http://localhost:2358/submissions`
4. Review monitoring metrics

Last updated: 2026-10-15
