# Judge0 Pro ($9.99/month) - Complete Setup Guide

## ✅ What Judge0 Pro Gives You

- ✅ **Unlimited submissions** - No request limits
- ✅ **Faster execution** - Optimized infrastructure  
- ✅ **Priority support** - 24/7 help
- ✅ **Higher concurrency** - Handles 300+ users easily
- ✅ **No self-hosting** - No Docker containers to manage
- ✅ **Auto-scaling** - Handles traffic spikes
- ✅ **99.9% uptime** - Enterprise reliability
- ✅ **All languages** - Python, JS, Java, C++, Go, Rust, etc.

**Cost: $9.99/month** (Much better than RapidAPI free tier)

---

## 🔧 Setup Judge0 Pro (5 minutes)

### Step 1: Create Judge0 Pro Account

1. Go to: https://judge0.com
2. Click **"Sign Up"** → Choose **Pro Plan ($9.99/month)**
3. Create account with email
4. Verify email
5. You'll get an **API Token**

### Step 2: Get Your Credentials

After signup, you'll have:
- **API Token**: `xxx_xxx_xxx` (keep this secret!)
- **API URL**: `https://api.judge0.com` (for Pro)

### Step 3: Update Your Environment

Create/update `backend/.env`:

```env
# Judge0 Pro Configuration
JUDGE0_API_URL=https://api.judge0.com
JUDGE0_API_TOKEN=your_api_token_here
JUDGE0_PRO_VERSION=true

# Rest of config
DATABASE_URL=postgresql://user:pass@localhost/learniverse
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_min_32_chars
ENV=development
```

### Step 4: Update Backend Code

**File: `backend/app.py`** - Find the Judge0 execution function and update it:

```python
def execute_code_via_judge0_pro(language: str, code: str, stdin: str = "") -> Optional[dict]:
    """
    Execute code using Judge0 Pro API
    
    Judge0 Pro handles:
    - Fast execution
    - Auto-scaling
    - No rate limits
    - All languages
    """
    import requests
    import base64
    import os
    import time

    lang = language.lower()
    
    # Language ID mapping (Judge0)
    lang_map = {
        "cpp": 54,
        "c++": 54,
        "java": 62,
        "python": 71,
        "py": 71,
        "javascript": 63,
        "js": 63,
        "go": 60,
        "rust": 73,
        "csharp": 51,
        "c#": 51,
    }
    
    lang_id = lang_map.get(lang, 71)  # Default to Python
    
    judge0_url = os.environ.get("JUDGE0_API_URL", "https://api.judge0.com")
    judge0_token = os.environ.get("JUDGE0_API_TOKEN", "")
    
    if not judge0_token:
        logger.error("[JUDGE0] No API token configured")
        return None
    
    try:
        # Encode code and input
        code_b64 = base64.b64encode(code.encode("utf-8")).decode("utf-8")
        stdin_b64 = base64.b64encode(stdin.encode("utf-8")).decode("utf-8")
        
        # Prepare headers with authentication
        headers = {
            "Content-Type": "application/json",
            "X-Auth-Token": judge0_token  # Judge0 Pro uses this header
        }
        
        # Prepare payload
        payload = {
            "source_code": code_b64,
            "language_id": lang_id,
            "stdin": stdin_b64,
            "cpu_time_limit": 5,  # 5 seconds
            "memory_limit": 256000,  # 256 MB
            "wall_time_limit": 10
        }
        
        # Submit code (Judge0 Pro - synchronous with wait=true)
        endpoint = f"{judge0_url}/submissions?base64_encoded=true&wait=true"
        
        logger.info(f"[JUDGE0 PRO] Submitting code for {language}")
        
        resp = requests.post(endpoint, json=payload, headers=headers, timeout=15)
        
        if resp.status_code in [200, 201]:
            data = resp.json()
            
            # Decode output
            stdout = ""
            if data.get("stdout"):
                stdout = base64.b64decode(data["stdout"].encode("utf-8")).decode("utf-8", errors="replace")
            
            stderr = ""
            if data.get("stderr"):
                stderr = base64.b64decode(data["stderr"].encode("utf-8")).decode("utf-8", errors="replace")
            
            if data.get("compile_output"):
                stderr += "\n" + base64.b64decode(data["compile_output"].encode("utf-8")).decode("utf-8", errors="replace")
            
            # Status mapping
            # 1 = In Queue
            # 2 = Processing
            # 3 = Accepted (success)
            # 4 = Wrong Answer
            # 5 = Time Limit Exceeded
            # 6 = Compilation Error
            # 7 = Runtime Error (SIGSEGV)
            # 8 = Runtime Error (SIGXFSZ)
            # 9 = Runtime Error (SIGFPE)
            # 10 = Runtime Error (SIGABRT)
            # 11 = Runtime Error (NZEC)
            # 12 = Runtime Error (Other)
            # 13 = Internal Error
            # 14 = Exec Format Error
            
            status_id = data.get("status", {}).get("id", 3)
            exit_code = 0 if status_id == 3 else 1
            
            if status_id == 5:
                stderr = "Time Limit Exceeded (Timeout > 5s)"
                exit_code = 124
            
            logger.info(f"[JUDGE0 PRO] Execution completed with status {status_id}")
            
            return {
                "run": {
                    "stdout": stdout,
                    "stderr": stderr.strip(),
                    "code": exit_code
                }
            }
        else:
            logger.error(f"[JUDGE0 PRO] API returned status {resp.status_code}")
            logger.error(f"[JUDGE0 PRO] Response: {resp.text}")
            return None
    
    except requests.Timeout:
        logger.error("[JUDGE0 PRO] Request timeout")
        return None
    except Exception as e:
        logger.error(f"[JUDGE0 PRO] Exception occurred: {e}")
        return None


# Update the main execution router to use Judge0 Pro
def execute_code_via_piston(language: str, code: str, stdin: str = "") -> Optional[dict]:
    """
    Main execution function - uses Judge0 Pro as primary
    Falls back to other methods if needed
    """
    from config import settings
    
    # Try Judge0 Pro first
    judge0_pro = execute_code_via_judge0_pro(language, code, stdin)
    if judge0_pro:
        return judge0_pro
    
    # Fallback to other methods if configured
    logger.warning("[EXECUTION] Judge0 Pro failed, trying fallback methods")
    
    # Try regular Judge0 if configured
    if settings.JUDGE0_URL and settings.JUDGE0_URL != "https://api.judge0.com":
        return execute_code_via_judge0(language, code, stdin)
    
    # Try local execution if enabled (dev only)
    if settings.ALLOW_LOCAL_EXECUTION and settings.IS_DEV:
        return execute_code_locally(language, code, stdin)
    
    return None
```

---

## 📋 Update Configuration Files

### `backend/.env` (for local development)

```env
# Judge0 Pro
JUDGE0_API_URL=https://api.judge0.com
JUDGE0_API_TOKEN=your_token_here
JUDGE0_PRO_VERSION=true

# Database (local)
DATABASE_URL=postgresql://postgres:password@localhost:5432/learniverse_local
REDIS_URL=redis://localhost:6379

# Other
JWT_SECRET=your_32_char_secret_key_here
ALLOW_LOCAL_EXECUTION=false
ENV=development
```

### `backend/.env.production` (for Render deployment)

```env
# Judge0 Pro (same for production)
JUDGE0_API_URL=https://api.judge0.com
JUDGE0_API_TOKEN=your_token_here
JUDGE0_PRO_VERSION=true

# Production Database (use Render PostgreSQL)
DATABASE_URL=postgresql://user:password@dpg-xxx.render.internal:5432/learniverse
REDIS_URL=redis://:password@redis.render.internal:6379

# Security
ENV=production
JWT_SECRET=generate_with_openssl_rand_-hex_32
DEBUG=false

# Other services
GEMINI_API_KEY=your_key
SENDGRID_API_KEY=your_key
```

---

## ✅ Verification - Test Judge0 Pro Locally

### Test 1: Check API Token Works

```bash
# Verify your Judge0 Pro token
curl -X GET "https://api.judge0.com/statuses" \
  -H "X-Auth-Token: your_token_here"

# Should return list of status codes (not 401 error)
```

### Test 2: Test Code Execution

```bash
# In Python, test the execution function
python -c "
from app import execute_code_via_judge0_pro

code = '''
def hello():
    return 'Hello from Judge0 Pro!'

print(hello())
'''

result = execute_code_via_judge0_pro('python', code, '')
print(result)
"

# Should return:
# {'run': {'stdout': 'Hello from Judge0 Pro!\n', 'stderr': '', 'code': 0}}
```

### Test 3: Full Backend Test

```bash
# Start backend
cd backend
python -m uvicorn app:app --reload --port 8000

# In another terminal, test submission
curl -X POST "http://localhost:8000/api/problems/submit" \
  -H "Content-Type: application/json" \
  -d '{
    "problem_id": 1,
    "language": "python",
    "code": "def twoSum(nums, target):\n    d = {}\n    for i, num in enumerate(nums):\n        if target - num in d:\n            return [d[target - num], i]\n        d[num] = i\n    return []",
    "user_id": "test-user"
  }'

# Should return successful submission result
```

---

## 🚀 NO MORE Docker Needed!

Before (self-hosted):
```bash
docker-compose -f docker-compose.prod.yml up -d  # Start Judge0 containers
# Takes 2-3 minutes, uses 2GB+ RAM, complex setup
```

After (Judge0 Pro):
```bash
# Just set JUDGE0_API_TOKEN in .env
# Done! No containers, no complexity
```

**Advantages:**
- ✅ Simpler - No Docker/containers to manage
- ✅ Faster - No wait time, instant submissions
- ✅ Cheaper - $9.99/month vs $50-150/month for self-hosting
- ✅ Reliable - 99.9% uptime SLA
- ✅ Scalable - Auto-handles 1000+ concurrent users
- ✅ Supported - Professional support included

---

## 💾 Update Required Files

You need to update these files in your repo:

1. **`backend/app.py`**
   - Add `execute_code_via_judge0_pro()` function (above)
   - Update `execute_code_via_piston()` to use Pro first

2. **`backend/.env`**
   ```env
   JUDGE0_API_URL=https://api.judge0.com
   JUDGE0_API_TOKEN=your_token
   JUDGE0_PRO_VERSION=true
   ```

3. **`backend/.env.production`**
   ```env
   JUDGE0_API_URL=https://api.judge0.com
   JUDGE0_API_TOKEN=your_token
   JUDGE0_PRO_VERSION=true
   ```

4. **`docker-compose.prod.yml`** (optional - keep for database only)
   - Remove Judge0 services (judge0_server, judge0_worker_1, etc.)
   - Keep PostgreSQL and Redis only

---

## 📊 Cost Breakdown (With Judge0 Pro)

| Service | Cost/Month | Notes |
|---------|-----------|-------|
| **Judge0 Pro** | **$9.99** | Unlimited submissions, Pro API |
| Vercel (Frontend) | $0 | Free tier |
| Render (Backend) | $7-25 | Free to $25/mo |
| PostgreSQL | $15-50 | Managed database |
| Redis | $5-10 | Cache layer |
| SendGrid (Email) | $0-20 | Notifications |
| **TOTAL** | **$37-115/month** | For 500-2000 users |

**Much cheaper than self-hosted Judge0!**

---

## 🚀 Updated Deployment (Simpler Now!)

### Step 1: Get Judge0 Pro Account
- Go to https://judge0.com
- Sign up for Pro ($9.99/month)
- Get API token

### Step 2: Update Environment Variables
```bash
# backend/.env
JUDGE0_API_URL=https://api.judge0.com
JUDGE0_API_TOKEN=your_token_here
```

### Step 3: Deploy Backend to Render
```
Same as before, but much simpler setup:
- No Docker Judge0 containers to configure
- Just set environment variables
- Deploy and go!
```

### Step 4: Deploy Frontend to Vercel
```
Same as before:
- Connect GitHub
- Deploy
- Works immediately
```

**Total setup time: 20 minutes** (vs 30-45 before)

---

## 📞 Quick Start Checklist

- [ ] Get Judge0 Pro account (https://judge0.com)
- [ ] Copy your API token
- [ ] Update `backend/.env` with token
- [ ] Update `execute_code_via_judge0_pro()` in app.py
- [ ] Test locally: `curl http://localhost:8000/api/problems/list`
- [ ] Submit test code - should work instantly
- [ ] Deploy to Render + Vercel
- [ ] Share with institution ✅

---

## ❓ FAQ

**Q: Is Judge0 Pro worth it vs free tier?**
A: Yes! Free tier has limits. Pro gives unlimited submissions, higher priority, better support.

**Q: Can I start with free and upgrade later?**
A: Yes, start with free tier (RapidAPI), upgrade to Pro when you scale.

**Q: What if Judge0 Pro goes down?**
A: 99.9% uptime SLA = ~8 hours downtime/year. Plus you can have fallback.

**Q: Can multiple institutions share one Judge0 Pro account?**
A: Yes, the account is per API token. All submissions use same token.

**Q: How many concurrent submissions can Judge0 Pro handle?**
A: Designed for 1000+ concurrent, with auto-scaling.

---

## 🎯 Your New Stack (Judge0 Pro)

```
┌─────────────────────┐
│   Vercel Frontend   │
│  learniverse.ai     │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Render Backend     │
│  FastAPI App        │
└──────────┬──────────┘
           │
   ┌───────┼────────┐
   │       │        │
┌──▼─┐ ┌──▼──┐ ┌───▼──────┐
│RDS │ │Redis│ │Judge0 Pro│
│    │ │     │ │  API     │
└────┘ └─────┘ └──────────┘
```

**NO MORE SELF-HOSTED JUDGE0 CONTAINERS!** ✅

---

## 🔒 Security Notes

- Keep `JUDGE0_API_TOKEN` secret (don't commit to Git)
- Use environment variables on Render
- Rotate token periodically
- Judge0 Pro has rate limiting per account

---

## 📚 Next: Update Your Code

Now update your `backend/app.py` with the `execute_code_via_judge0_pro()` function above, then test!

**Status: Judge0 Pro Setup Ready** ✅

Your institution will have:
- ✅ Professional code execution
- ✅ Unlimited submissions
- ✅ Enterprise reliability
- ✅ Automatic scaling
- ✅ Cost-effective ($9.99/month)

Ready to update your code? 🚀
