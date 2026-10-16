#!/bin/bash
# Quick-start deployment script for Judge0 scaling
# Usage: bash deploy-judge0.sh

set -e

echo "======================================"
echo "Judge0 Production Deployment (300 users)"
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Install from https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not found.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker and Docker Compose installed${NC}"

# Generate secure tokens
echo -e "${YELLOW}[2/5] Generating secure credentials...${NC}"
API_SECRET=$(openssl rand -hex 32)
JUDGE0_TOKEN=$(openssl rand -hex 16)
DB_PASS=$(openssl rand -base64 24)
echo -e "${GREEN}✓ Credentials generated${NC}"

# Create .env.production
echo -e "${YELLOW}[3/5] Creating .env.production...${NC}"
cat > .env.production << EOF
# Database
DATABASE_URL=postgresql://judge0:${DB_PASS}@postgres:5432/learniverse_db
DB_POOL_MIN_CONNS=20
DB_POOL_MAX_CONNS=100

# Judge0
JUDGE0_URL=http://nginx/
JUDGE0_API_KEY=
ALLOW_LOCAL_EXECUTION=false
CODE_EXECUTION_SEMAPHORE_LIMIT=250

# LLM
GEMINI_API_KEY=your_gemini_key
GOOGLE_API_KEY=your_google_key

# Security
ENV=production
API_SECRET_KEY=${API_SECRET}
SECRET_KEY_BASE=${API_SECRET}
JUDGE0_AUTH_TOKEN=${JUDGE0_TOKEN}

# Redis
REDIS_URL=redis://redis:6379

# Frontend
FRONTEND_URL=https://yourdomain.com

# Postgres
POSTGRES_PASSWORD=${DB_PASS}
POSTGRES_USER=judge0
POSTGRES_DB=learniverse_db
EOF
chmod 600 .env.production
echo -e "${GREEN}✓ .env.production created (with secure credentials)${NC}"

# Copy production compose file
echo -e "${YELLOW}[4/5] Deploying containers...${NC}"
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ docker-compose.prod.yml not found${NC}"
    exit 1
fi

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}[5/5] Waiting for services to be healthy...${NC}"
sleep 10

# Verify deployments
POSTGRES_HEALTH=$(docker-compose -f docker-compose.prod.yml ps judge0_postgres | grep -c "healthy" || echo "0")
REDIS_HEALTH=$(docker-compose -f docker-compose.prod.yml ps judge0_redis | grep -c "healthy" || echo "0")
SERVER_RUNNING=$(docker-compose -f docker-compose.prod.yml ps judge0_server | grep -c "Up" || echo "0")

if [ "$POSTGRES_HEALTH" -eq 1 ] && [ "$REDIS_HEALTH" -eq 1 ] && [ "$SERVER_RUNNING" -eq 1 ]; then
    echo -e "${GREEN}✓ All services deployed successfully${NC}"
else
    echo -e "${RED}⚠ Some services may not be ready yet. Check with: docker-compose -f docker-compose.prod.yml ps${NC}"
fi

echo ""
echo -e "${GREEN}======================================"
echo "Deployment Complete!"
echo "=====================================${NC}"
echo ""
echo "📊 Judge0 Server: http://localhost:2358"
echo "🔌 PostgreSQL: localhost:5432"
echo "💾 Redis: localhost:6379"
echo "⚙️  Nginx Load Balancer: localhost:80"
echo ""
echo "📝 Credentials saved in: .env.production"
echo ""
echo "🚀 Next steps:"
echo "  1. Update backend/.env with values from .env.production"
echo "  2. Start Learniverse backend: cd backend && python -m uvicorn app:app --port 8000"
echo "  3. Run load test: locust -f loadtest.py --host=http://localhost:8000 -u 300"
echo ""
echo "📚 For detailed docs: cat JUDGE0_SCALING_GUIDE.md"
echo ""
