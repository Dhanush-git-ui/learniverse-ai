#!/bin/bash
# Quick setup script for Top 100 Problems Compiler
# Integrates public LeetCode-style problem compiler into Learniverse AI

set -e

echo "======================================"
echo "Top 100 Problems Compiler Setup"
echo "======================================"
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Verify backend files
echo -e "${YELLOW}[1/5] Checking backend files...${NC}"
if [ ! -f "backend/app.py" ]; then
    echo -e "${RED}❌ backend/app.py not found${NC}"
    exit 1
fi

if [ ! -f "backend/top_100_problems.py" ]; then
    echo -e "${RED}❌ backend/top_100_problems.py not found${NC}"
    echo "Please copy the file from the provided template"
    exit 1
fi

if [ ! -f "backend/top_100_problems_api.py" ]; then
    echo -e "${RED}❌ backend/top_100_problems_api.py not found${NC}"
    echo "Please copy the file from the provided template"
    exit 1
fi

echo -e "${GREEN}✓ All backend files present${NC}"
echo ""

# Step 2: Update backend/app.py
echo -e "${YELLOW}[2/5] Updating backend/app.py...${NC}"

# Check if router is already included
if grep -q "include_router(problems_router)" backend/app.py; then
    echo -e "${GREEN}✓ problems_router already included${NC}"
else
    # Find the line where app = FastAPI(...) is defined
    line_num=$(grep -n "app = FastAPI" backend/app.py | head -1 | cut -d: -f1)

    if [ -z "$line_num" ]; then
        echo -e "${RED}❌ Could not find 'app = FastAPI' in app.py${NC}"
        exit 1
    fi

    # Add import at top
    if ! grep -q "from top_100_problems_api import" backend/app.py; then
        sed -i '1a from top_100_problems_api import problems_router' backend/app.py
        echo -e "${GREEN}✓ Added import for problems_router${NC}"
    fi

    # Add include_router after app definition
    insert_line=$((line_num + 2))
    sed -i "${insert_line}i app.include_router(problems_router)" backend/app.py
    echo -e "${GREEN}✓ Added router to FastAPI app${NC}"
fi
echo ""

# Step 3: Update environment
echo -e "${YELLOW}[3/5] Setting up environment configuration...${NC}"

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠ backend/.env not found, creating from .env.example${NC}"
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
    else
        touch backend/.env
    fi
fi

# Add problem-specific env vars if not present
if ! grep -q "PROBLEMS_PUBLIC_ACCESS" backend/.env; then
    echo "" >> backend/.env
    echo "# Top 100 Problems Configuration" >> backend/.env
    echo "PROBLEMS_PUBLIC_ACCESS=true" >> backend/.env
    echo "PROBLEMS_RATE_LIMIT_LIST=100/minute" >> backend/.env
    echo "PROBLEMS_RATE_LIMIT_SUBMIT=20/minute" >> backend/.env
    echo "PROBLEMS_RATE_LIMIT_TEST=30/minute" >> backend/.env
    echo "PROBLEMS_TIME_LIMIT=5" >> backend/.env
    echo "PROBLEMS_MEMORY_LIMIT=256" >> backend/.env
    echo -e "${GREEN}✓ Added problem configuration to .env${NC}"
else
    echo -e "${GREEN}✓ Problem configuration already in .env${NC}"
fi
echo ""

# Step 4: Frontend setup
echo -e "${YELLOW}[4/5] Setting up frontend...${NC}"

if [ ! -d "frontend" ]; then
    echo -e "${YELLOW}⚠ frontend directory not found${NC}"
else
    # Check if TopProblemsCompiler.tsx exists
    if [ ! -f "frontend/src/components/TopProblemsCompiler.tsx" ]; then
        echo -e "${YELLOW}⚠ TopProblemsCompiler.tsx not found${NC}"
        echo "Please copy the component from the provided template"
    else
        echo -e "${GREEN}✓ TopProblemsCompiler component found${NC}"
    fi

    # Check/create .env
    if [ ! -f "frontend/.env" ]; then
        echo "REACT_APP_API_URL=http://localhost:8000" > frontend/.env
        echo -e "${GREEN}✓ Created frontend/.env${NC}"
    fi
fi
echo ""

# Step 5: Verify dependencies
echo -e "${YELLOW}[5/5] Checking dependencies...${NC}"

# Check Python packages
python3 -c "import fastapi" 2>/dev/null && echo -e "${GREEN}✓ FastAPI installed${NC}" || echo -e "${RED}⚠ FastAPI not installed${NC}"
python3 -c "import pydantic" 2>/dev/null && echo -e "${GREEN}✓ Pydantic installed${NC}" || echo -e "${RED}⚠ Pydantic not installed${NC}"

echo ""
echo -e "${GREEN}======================================"
echo "Setup Complete! ✅"
echo "=====================================${NC}"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1. Start Judge0 (if not running):"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "2. Start Backend:"
echo "   cd backend"
echo "   python -m uvicorn app:app --reload --port 8000"
echo ""
echo "3. In another terminal, start Frontend:"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Visit: http://localhost:3000/problems"
echo ""
echo "📚 For detailed docs:"
echo "   cat TOP_100_PROBLEMS_INTEGRATION.md"
echo ""
