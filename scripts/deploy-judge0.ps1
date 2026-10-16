# Quick-start deployment script for Judge0 scaling (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File deploy-judge0.ps1

Write-Host "======================================"
Write-Host "Judge0 Production Deployment (300 users)" -ForegroundColor Cyan
Write-Host "======================================"
Write-Host ""

# Check prerequisites
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow
$docker_check = docker --version 2>&1 | Out-String
if (-not $docker_check) {
    Write-Host "❌ Docker not found. Install from https://www.docker.com/products/docker-desktop" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker installed: $($docker_check.Trim())" -ForegroundColor Green

$compose_check = docker-compose --version 2>&1 | Out-String
if (-not $compose_check) {
    Write-Host "❌ Docker Compose not found." -ForegroundColor Red
    exit 1
}
Write-Host "✓ Docker Compose installed: $($compose_check.Trim())" -ForegroundColor Green
Write-Host ""

# Generate secure tokens
Write-Host "[2/5] Generating secure credentials..." -ForegroundColor Yellow
function Generate-SecureString {
    param([int]$Length = 32)
    $chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    $random = New-Object System.Random
    $result = ''
    for ($i = 0; $i -lt $Length; $i++) {
        $result += $chars[$random.Next($chars.Length)]
    }
    return $result
}

$API_SECRET = Generate-SecureString 32
$JUDGE0_TOKEN = Generate-SecureString 16
$DB_PASS = Generate-SecureString 24

Write-Host "✓ Credentials generated" -ForegroundColor Green
Write-Host ""

# Create .env.production
Write-Host "[3/5] Creating .env.production..." -ForegroundColor Yellow
$envContent = @"
# Database
DATABASE_URL=postgresql://judge0:$DB_PASS@postgres:5432/learniverse_db
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
API_SECRET_KEY=$API_SECRET
SECRET_KEY_BASE=$API_SECRET
JUDGE0_AUTH_TOKEN=$JUDGE0_TOKEN

# Redis
REDIS_URL=redis://redis:6379

# Frontend
FRONTEND_URL=https://yourdomain.com

# Postgres
POSTGRES_PASSWORD=$DB_PASS
POSTGRES_USER=judge0
POSTGRES_DB=learniverse_db
"@

Set-Content -Path ".env.production" -Value $envContent -Encoding UTF8
Write-Host "✓ .env.production created" -ForegroundColor Green
Write-Host ""

# Deploy containers
Write-Host "[4/5] Starting Docker containers..." -ForegroundColor Yellow
if (-not (Test-Path "docker-compose.prod.yml")) {
    Write-Host "❌ docker-compose.prod.yml not found" -ForegroundColor Red
    exit 1
}

docker-compose -f docker-compose.prod.yml up -d
Write-Host "✓ Containers started" -ForegroundColor Green
Write-Host ""

# Wait and verify
Write-Host "[5/5] Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

docker-compose -f docker-compose.prod.yml ps
Write-Host ""

Write-Host "======================================"
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "======================================"
Write-Host ""
Write-Host "📊 Judge0 Server: http://localhost:2358"
Write-Host "🔌 PostgreSQL: localhost:5432"
Write-Host "💾 Redis: localhost:6379"
Write-Host "⚙️  Nginx Load Balancer: http://localhost:80"
Write-Host ""
Write-Host "📝 Credentials saved in: .env.production"
Write-Host "    API_SECRET_KEY: $API_SECRET"
Write-Host "    DB_PASSWORD: (hidden)"
Write-Host ""
Write-Host "🚀 Next steps:"
Write-Host "  1. Update backend\.env with values from .env.production"
Write-Host "  2. Start backend: cd backend && python -m uvicorn app:app --port 8000"
Write-Host "  3. Run load test: pip install locust && locust -f loadtest.py --host=http://localhost:8000 -u 300"
Write-Host ""
Write-Host "📚 For detailed docs: Get-Content JUDGE0_SCALING_GUIDE.md"
Write-Host ""
