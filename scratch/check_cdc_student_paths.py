import requests
import json

url = "https://cdc-tracks-backend.onrender.com/openapi.json"
try:
    resp = requests.get(url, timeout=15)
    data = resp.json()
    
    # Check paths related to student / marks / assessment
    for path, methods in data.get("paths", {}).items():
        if any(k in path for k in ["student", "academic", "sync", "batch"]):
            print("PATH:", path)
            for m, det in methods.items():
                print(f"  {m.upper()}: {det.get('summary')}")
                req_body = det.get("requestBody", {})
                if req_body:
                    content = req_body.get("content", {})
                    schema_ref = content.get("application/json", {}).get("schema", {})
                    print("    RequestBody Schema:", schema_ref)
except Exception as e:
    print("Error:", e)
