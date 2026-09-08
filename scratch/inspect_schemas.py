import requests
import json

url = "https://cdc-tracks-backend.onrender.com/openapi.json"
resp = requests.get(url, timeout=15)
data = resp.json()

schemas = data.get("components", {}).get("schemas", {})
print("--- Available Models in cdc-tracks-backend ---")
for name in sorted(schemas.keys()):
    print(name)

print("\n--- Details for student detail endpoint ---")
student_ep = data.get("paths", {}).get("/api/admin/student/{roll_number}", {}).get("get", {})
print("Responses:", json.dumps(student_ep.get("responses"), indent=2))

print("\n--- Schemas related to Student / Assessment / Score ---")
for name, s in schemas.items():
    if any(k in name.lower() for k in ["student", "score", "academic", "dash", "analytic"]):
        print(f"\nModel: {name}")
        props = s.get("properties", {})
        for prop_name, prop_data in props.items():
            print(f"  - {prop_name}: {prop_data.get('type') or prop_data.get('$ref')}")
