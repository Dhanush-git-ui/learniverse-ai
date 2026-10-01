import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

headers = {
    'User-Agent': 'Mozilla/5.0',
    'X-API-Key': 'u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE'
}

# Run fetch_vercel_results again to update the local Excel with the latest data
import subprocess
subprocess.run(["python", "scratch/fetch_vercel_results.py"])
subprocess.run(["python", "scratch/merge_all_assessments.py"])
