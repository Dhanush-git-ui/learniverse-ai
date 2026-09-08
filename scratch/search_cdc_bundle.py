import requests
import re

url = "https://cdc-hitam.onrender.com/assets/index-DoTmrJxs.js"
resp = requests.get(url, timeout=15)
text = resp.text

keywords = ["learniverse", "assessment", "exam", "coding test", "marks", "score"]
for kw in keywords:
    matches = list(re.finditer(kw, text, re.IGNORECASE))
    print(f"Keyword: '{kw}' ({len(matches)} matches)")
    for m in matches[:5]:
        start = max(0, m.start() - 60)
        end = min(len(text), m.end() + 100)
        snippet = text[start:end].encode('ascii', errors='replace').decode('ascii')
        print("  -->", snippet.replace('\n', ' '))
