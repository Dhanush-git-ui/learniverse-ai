import re

with open(r'c:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\src\data\top100Data.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Match id, title, category
pattern = r'id:\s*(\d+),\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)"'
matches = re.findall(pattern, content)

print(f"Total questions currently in top100Data.ts: {len(matches)}")
categories = {}
for qid, title, cat in matches:
    if cat not in categories:
        categories[cat] = []
    categories[cat].append((int(qid), title))

for cat, qs in categories.items():
    print(f"\n=== {cat} ({len(qs)} questions) ===")
    for qid, t in qs[:10]:
        print(f"  {qid}. {t}")
    if len(qs) > 10:
        print(f"  ... and {len(qs)-10} more (last is {qs[-1][0]}. {qs[-1][1]})")
