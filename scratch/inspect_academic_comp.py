import requests
import re

url = "https://cdc-hitam.onrender.com/assets/index-DoTmrJxs.js"
resp = requests.get(url, timeout=15)
text = resp.text

idx = text.find("$.student?.cgpa")
if idx != -1:
    snippet = text[max(0, idx-300):min(len(text), idx+1000)]
    print("--- Academic / Student Details in CDC HITAM ---")
    print(snippet.encode('ascii', errors='replace').decode('ascii'))
