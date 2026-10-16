# PowerShell setup script for Top 100 Problems Compiler
# Run: powershell -ExecutionPolicy Bypass -File setup-problems.ps1

Write-Host "======================================"
Write-Host "Top 100 Problems Compiler Setup" -ForegroundColor Cyan
Write-Host "======================================"
Write-Host ""

$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"

# Step 1: Verify backend files
Write-Host "[1/6] Checking backend files..." -ForegroundColor $YELLOW

$backendFiles = @(
    "backend/app.py",
    "backend/top_100_problems.py",
    "backend/top_100_problems_api.py"
)

foreach ($file in $backendFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ $file not found" -ForegroundColor $RED
        exit 1
    }
}

Write-Host "✓ All backend files present" -ForegroundColor $GREEN
Write-Host ""

# Step 2: Update backend/app.py
Write-Host "[2/6] Updating backend/app.py..." -ForegroundColor $YELLOW

$appContent = Get-Content "backend/app.py" -Raw

# Check if router is already included
if ($appContent -match "include_router\(problems_router\)") {
    Write-Host "✓ problems_router already included" -ForegroundColor $GREEN
} else {
    # Add import
    if ($appContent -notmatch "from top_100_problems_api import") {
        $appContent = "from top_100_problems_api import problems_router`n" + $appContent
        Write-Host "✓ Added import for problems_router" -ForegroundColor $GREEN
    }

    # Add include_router after app = FastAPI
    $appContent = $appContent -replace `
        '(app = FastAPI\([^)]*\))', `
        '$1' + "`n`napp.include_router(problems_router)"

    Set-Content "backend/app.py" $appContent
    Write-Host "✓ Added router to FastAPI app" -ForegroundColor $GREEN
}

Write-Host ""

# Step 3: Update environment configuration
Write-Host "[3/6] Setting up environment configuration..." -ForegroundColor $YELLOW

$envFile = "backend/.env"

if (-not (Test-Path $envFile)) {
    Write-Host "⚠ backend/.env not found, creating from .env.example" -ForegroundColor $YELLOW
    if (Test-Path "backend/.env.example") {
        Copy-Item "backend/.env.example" $envFile
    } else {
        New-Item -Path $envFile -ItemType File | Out-Null
    }
}

# Read current content
$envContent = Get-Content $envFile -Raw

# Add problem-specific vars if not present
if ($envContent -notmatch "PROBLEMS_PUBLIC_ACCESS") {
    $problemsConfig = @"

# Top 100 Problems Configuration
PROBLEMS_PUBLIC_ACCESS=true
PROBLEMS_RATE_LIMIT_LIST=100/minute
PROBLEMS_RATE_LIMIT_SUBMIT=20/minute
PROBLEMS_RATE_LIMIT_TEST=30/minute
PROBLEMS_TIME_LIMIT=5
PROBLEMS_MEMORY_LIMIT=256
"@

    Add-Content $envFile $problemsConfig
    Write-Host "✓ Added problem configuration to .env" -ForegroundColor $GREEN
} else {
    Write-Host "✓ Problem configuration already in .env" -ForegroundColor $GREEN
}

Write-Host ""

# Step 4: Frontend setup
Write-Host "[4/6] Setting up frontend..." -ForegroundColor $YELLOW

if (-not (Test-Path "frontend")) {
    Write-Host "⚠ frontend directory not found" -ForegroundColor $YELLOW
} else {
    # Check if TopProblemsCompiler.tsx exists
    if (-not (Test-Path "frontend/src/components/TopProblemsCompiler.tsx")) {
        Write-Host "⚠ TopProblemsCompiler.tsx not found" -ForegroundColor $YELLOW
        Write-Host "Please copy the component from the provided template" -ForegroundColor $YELLOW
    } else {
        Write-Host "✓ TopProblemsCompiler component found" -ForegroundColor $GREEN
    }

    # Check/create .env
    if (-not (Test-Path "frontend/.env")) {
        "REACT_APP_API_URL=http://localhost:8000" | Out-File -FilePath "frontend/.env" -Encoding UTF8
        Write-Host "✓ Created frontend/.env" -ForegroundColor $GREEN
    } else {
        Write-Host "✓ frontend/.env already exists" -ForegroundColor $GREEN
    }
}

Write-Host ""

# Step 5: Update config.py
Write-Host "[5/6] Updating backend/config.py..." -ForegroundColor $YELLOW

$configFile = "backend/config.py"
$configContent = Get-Content $configFile -Raw

if ($configContent -notmatch "PROBLEMS_PUBLIC_ACCESS") {
    # Find the line with "self.CODE_EXECUTION_SEMAPHORE_LIMIT" and add after it
    $problemsSettings = @"

        # Top 100 Problems Configuration
        self.PROBLEMS_PUBLIC_ACCESS = os.environ.get("PROBLEMS_PUBLIC_ACCESS", "true").lower() == "true"
        self.PROBLEMS_RATE_LIMIT_LIST = os.environ.get("PROBLEMS_RATE_LIMIT_LIST", "100/minute")
        self.PROBLEMS_RATE_LIMIT_SUBMIT = os.environ.get("PROBLEMS_RATE_LIMIT_SUBMIT", "20/minute")
        self.PROBLEMS_RATE_LIMIT_TEST = os.environ.get("PROBLEMS_RATE_LIMIT_TEST", "30/minute")
        self.PROBLEMS_TIME_LIMIT = int(os.environ.get("PROBLEMS_TIME_LIMIT", "5"))
        self.PROBLEMS_MEMORY_LIMIT = int(os.environ.get("PROBLEMS_MEMORY_LIMIT", "256"))
"@

    $configContent = $configContent -replace `
        '(self\.CODE_EXECUTION_SEMAPHORE_LIMIT.*?)(\n\s+# Assessment)', `
        '$1' + $problemsSettings + '$2'

    Set-Content $configFile $configContent
    Write-Host "✓ Added problem settings to config.py" -ForegroundColor $GREEN
} else {
    Write-Host "✓ Problem settings already in config.py" -ForegroundColor $GREEN
}

Write-Host ""

# Step 6: Verify dependencies
Write-Host "[6/6] Checking Python dependencies..." -ForegroundColor $YELLOW

$deps = @("fastapi", "pydantic", "requests")

foreach ($dep in $deps) {
    $result = python -c "import $dep" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ $dep installed" -ForegroundColor $GREEN
    } else {
        Write-Host "⚠ $dep not installed" -ForegroundColor $YELLOW
    }
}

Write-Host ""
Write-Host "======================================"
Write-Host "Setup Complete! ✅" -ForegroundColor $GREEN
Write-Host "======================================"
Write-Host ""

Write-Host "🚀 Next Steps:" -ForegroundColor $GREEN
Write-Host ""

Write-Host "1. Start Judge0 (if not running):" -ForegroundColor $YELLOW
Write-Host "   docker-compose -f docker-compose.prod.yml up -d"
Write-Host ""

Write-Host "2. Start Backend:" -ForegroundColor $YELLOW
Write-Host "   cd backend"
Write-Host "   python -m uvicorn app:app --reload --port 8000"
Write-Host ""

Write-Host "3. In another PowerShell, start Frontend:" -ForegroundColor $YELLOW
Write-Host "   cd frontend"
Write-Host "   npm start"
Write-Host ""

Write-Host "4. Visit: http://localhost:3000/problems" -ForegroundColor $YELLOW
Write-Host ""

Write-Host "📚 For detailed docs:" -ForegroundColor $YELLOW
Write-Host "   Get-Content TOP_100_PROBLEMS_INTEGRATION.md"
Write-Host ""

Write-Host "📊 To test the API:" -ForegroundColor $YELLOW
Write-Host "   Invoke-WebRequest -Uri 'http://localhost:8000/api/problems/list' -Method Get"
Write-Host ""
