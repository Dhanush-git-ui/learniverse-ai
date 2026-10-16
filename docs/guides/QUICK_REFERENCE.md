# Judge0 Quick Reference - 300 Concurrent Users

## 🚀 One-Line Quick Start

```bash
# Linux/macOS
bash deploy-judge0.sh

# Windows PowerShell
powershell -ExecutionPolicy Bypass -File deploy-judge0.ps1
```

---

## 📋 Architecture Summary

```
300 Users → Nginx Load Balancer → Judge0 Server + 3-6 Workers → PostgreSQL + Redis
```

**Key Components:**
- **Nginx**: Distributes requests (least_conn algorithm)
- **Judge0 Server**: API endpoint
- **Workers**: Execute code (4 processes each)
- **PostgreSQL**: Stores submissions
- **Redis**: Caches results & sessions

---

## ⚙️ Configuration for 300 Users

### Backend (.env.production)
```env
CODE_EXECUTION_SEMAPHORE_LIMIT=250     # Max concurrent code runs
DB_POOL_MIN_CONNS=20                   # Min database connections
DB_POOL_MAX_CONNS=100                  # Max database connections
JUDGE0_URL=http://nginx/               # Load balancer endpoint
```

### Database
```sql
-- Create indexes for performance
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
```

### Judge0 Workers
- **Minimum**: 6 workers (6 × 50 submissions = 300)
- **Recommended**: 8-10 (with redundancy)
- **Per-worker processes**: 4

---

## 📊 Expected Performance

| Metric | Target |
|--------|--------|
| Response Time (P95) | < 5 seconds |
| Response Time (P99) | < 10 seconds |
| Success Rate | > 99% |
| Throughput | 50-100 submissions/sec |
| Error Rate | < 1% |

---

## 🧪 Load Testing

```bash
# Install Locust
pip install locust

# Run 300 concurrent users
locust -f loadtest.py --host=http://localhost:8000 -u 300 -r 10 --run-time 10m
```

**Monitor in browser**: http://localhost:8089

---

## 📈 Monitoring

### Health Checks
```bash
# All services running?
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose logs judge0_server --tail 50
docker-compose logs judge0_worker_1 --tail 50

# Check API
curl http://localhost:2358/health
curl http://localhost/health
```

### Database Monitoring
```bash
docker exec judge0_postgres psql -U judge0 -d learniverse_db -c \
  "SELECT status, COUNT(*) FROM submissions GROUP BY status;"
```

### Redis Monitoring
```bash
docker exec judge0_redis redis-cli INFO memory
docker exec judge0_redis redis-cli DBSIZE
```

---

## 🔧 Troubleshooting

### Issue: "Connection pool exhausted"
```python
# In backend/config.py, increase:
self.DB_POOL_MAX_CONNS = 150  # was 100
```

### Issue: "Workers not processing"
```bash
# Check worker logs
docker-compose logs judge0_worker_1 --tail 100

# Verify Redis connectivity
docker exec judge0_worker_1 redis-cli -h redis ping
```

### Issue: "High memory usage"
```bash
# Clear Redis cache
docker exec judge0_redis redis-cli FLUSHDB

# Increase maxmemory in docker-compose.prod.yml
command: redis-server --appendonly yes --maxmemory 6gb --maxmemory-policy allkeys-lru
```

### Issue: "Slow submissions"
```bash
# Check PostgreSQL indexes
docker exec judge0_postgres psql -U judge0 -d learniverse_db \
  -c "SELECT * FROM pg_stat_user_indexes;"

# Run VACUUM if needed
docker exec judge0_postgres psql -U judge0 -d learniverse_db \
  -c "VACUUM ANALYZE submissions;"
```

---

## 📂 Files Created

| File | Purpose |
|------|---------|
| `docker-compose.prod.yml` | Production Docker setup |
| `.env.production` | Environment configuration |
| `nginx.conf` | Load balancer config |
| `deploy-judge0.sh` | Linux/macOS deployment |
| `deploy-judge0.ps1` | Windows deployment |
| `loadtest.py` | Locust load test script |
| `JUDGE0_SCALING_GUIDE.md` | Detailed documentation |
| `QUICK_REFERENCE.md` | This file |

---

## 🔐 Security Checklist

- [ ] Set `ENV=production` in `.env.production`
- [ ] Generate strong `API_SECRET_KEY` (32+ chars)
- [ ] Set strong `POSTGRES_PASSWORD`
- [ ] Set strong `JUDGE0_AUTH_TOKEN`
- [ ] Disable `ALLOW_LOCAL_EXECUTION=false`
- [ ] Set `FRONTEND_URL` to your domain
- [ ] Configure CORS properly
- [ ] Use HTTPS in production (add SSL cert to Nginx)
- [ ] Enable database backups
- [ ] Monitor logs for errors

---

## 💰 Cost (Monthly)

| Setup | Cost |
|-------|------|
| Self-hosted VPS | $210-320 |
| AWS ECS + RDS + ElastiCache | $370-450 |
| DigitalOcean App Platform | $200-300 |

---

## 🚦 Scaling Path

### 300 users (Current)
- 6-8 workers
- DB pool: 100 connections
- Redis: 2GB
- Server: 19 cores, 28GB RAM

### 500 users
- 10 workers
- DB pool: 150 connections
- Redis: 4GB
- Add geographic redundancy

### 1000+ users
- 15-20 workers
- Multiple clusters (multi-region)
- Managed databases
- Message queue (Celery)

---

## 📚 Resources

- [Judge0 GitHub](https://github.com/judge0/judge0)
- [Judge0 Community](https://judge0.com/blog)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Redis Performance](https://redis.io/docs/management/optimization/)
- [Nginx Load Balancing](https://nginx.org/en/docs/http/load_balancing.html)

---

## ✅ Deployment Checklist

- [ ] Docker & Docker Compose installed
- [ ] `.env.production` created with secure credentials
- [ ] `docker-compose.prod.yml` file present
- [ ] `nginx.conf` file present
- [ ] Run deployment script
- [ ] Verify all services healthy: `docker-compose ps`
- [ ] Test API: `curl http://localhost:2358/submissions`
- [ ] Update backend `.env` with values from `.env.production`
- [ ] Start Learniverse backend
- [ ] Run load test: `locust -f loadtest.py -u 300`
- [ ] Monitor performance metrics
- [ ] Set up automated backups

---

## 🎯 Next Steps

1. **Run deployment**:
   ```bash
   bash deploy-judge0.sh  # or deploy-judge0.ps1 on Windows
   ```

2. **Verify setup**:
   ```bash
   docker-compose -f docker-compose.prod.yml ps
   curl http://localhost:2358/health
   ```

3. **Update backend**:
   ```bash
   cp .env.production backend/.env
   cd backend
   python -m uvicorn app:app --port 8000
   ```

4. **Load test**:
   ```bash
   pip install locust
   locust -f loadtest.py --host=http://localhost:8000 -u 300
   ```

5. **Monitor**:
   - Access Locust dashboard: http://localhost:8089
   - Watch logs: `docker-compose logs -f`
   - Check metrics: See monitoring section above

---

## 🆘 Support

**Problem?** Check in this order:
1. Review logs: `docker-compose logs`
2. Verify connectivity: `docker ps`
3. Test API: `curl http://localhost:2358/submissions`
4. Check database: `docker exec judge0_postgres psql -U judge0 -d learniverse_db`
5. Read `JUDGE0_SCALING_GUIDE.md` for detailed troubleshooting

---

**Last Updated**: 2026-10-15  
**For**: 300 concurrent users on Learniverse AI
