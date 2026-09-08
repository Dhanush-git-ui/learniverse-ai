import requests

url = "https://cdc-tracks-backend.onrender.com/api/admin/students"
# from the JS bundle we saw: headers: { Authorization: `Bearer admin@hitam.org` }
headers = {"Authorization": "Bearer admin@hitam.org"}
try:
    resp = requests.get(url, headers=headers, timeout=10)
    print("GET /api/admin/students status:", resp.status_code)
    if resp.status_code == 200:
        data = resp.json()
        print("Response type:", type(data))
        if isinstance(data, list) and data:
            print("Sample student 1:", data[0])
        elif isinstance(data, dict):
            print("Keys:", list(data.keys()))
            students = data.get("students", [])
            if students:
                print("Sample student 1:", students[0])
except Exception as e:
    print("Error:", e)
