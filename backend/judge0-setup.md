# Code Execution & Judge0 Setup Guide

Learniverse AI supports 3 methods for running and compiling code:

---

## Option 1: Instant Local Execution (No Docker / No Setup Needed) ⭐ Recommended for Local Dev

Since you already have Python and Node.js installed on your machine, you can run student code directly without installing Docker or external tools.

In `backend/.env`, set:
```env
ALLOW_LOCAL_EXECUTION=true
```
Restart your backend (`cd backend; python -m uvicorn app:app --reload --port 8000`). Python, JavaScript, and C++ code will execute directly!

---

## Option 2: Cloud Judge0 via RapidAPI (Free — No Docker Needed)

If you want a true sandboxed multi-language compiler without installing Docker:

1. Sign up for free at [RapidAPI Judge0 CE](https://rapidapi.com/judge0-official/api/judge0-ce)
2. Click **Subscribe to Test** (Basic Free plan)
3. Copy your `X-RapidAPI-Key`
4. Update `backend/.env`:
   ```env
   JUDGE0_URL=https://judge0-ce.p.rapidapi.com
   JUDGE0_API_KEY=your_copied_rapidapi_key
   ```
5. Restart your backend server.

---

## Option 3: Self-Hosted Judge0 with Docker

If you prefer running Judge0 CE locally inside Docker:

### 1. Install Docker Desktop first
Download and install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) (ensure WSL 2 is enabled) and start the Docker Desktop application.

### 2. Run the single-line PowerShell command:
*(In PowerShell, do NOT use `\` line breaks — run as a single line):*
```powershell
docker run -d --name judge0 -p 2358:2358 -e JUDGE0_EXECUTORS_ALLOWED=false judge0/judge0-ce:1.4.0
```

### 3. Update `backend/.env`:
```env
JUDGE0_URL=http://localhost:2358
JUDGE0_API_KEY=
```

### 4. Restart backend
Restart `uvicorn` and code will execute through your local Judge0 instance.

