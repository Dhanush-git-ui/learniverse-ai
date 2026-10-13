import re
from collections import Counter

content = open('learniverse-ai/src/data/top100Data.ts', encoding='utf-8').read()
cats = re.findall(r'category:\s*"([^"]+)"', content)
print("Current categories in top100Data.ts:")
for cat, count in Counter(cats).items():
    print(f"  {cat}: {count}")

titles = re.findall(r'title:\s*"([^"]+)"', content)
print(f"\nTotal titles: {len(titles)}")
