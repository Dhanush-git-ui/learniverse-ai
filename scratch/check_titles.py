import re

with open('src/data/top100Data.ts', encoding='utf-8') as f:
    text = f.read()

titles = re.findall(r'"title":\s*"([^"]+)"', text)
print(f"Total titles found: {len(titles)}")
for i, t in enumerate(titles[:15], 1):
    print(f"{i}: {t}")
