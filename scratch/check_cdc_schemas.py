import requests
import json

url = "https://cdc-tracks-backend.onrender.com/openapi.json"
resp = requests.get(url, timeout=15)
data = resp.json()

schemas = data.get("components", {}).get("schemas", {})
for name in ["StudentDetailResponse", "AdminStudentResponse", "DashboardDataResponse", "CDCDashboardResponse", "StudentProfile"]:
    if name in schemas:
        print(f"--- Schema {name} ---")
        print(json.dumps(schemas[name], indent=2))
        
print("All Schema Names:")
for k in sorted(schemas.keys()):
    print(" ", k)
