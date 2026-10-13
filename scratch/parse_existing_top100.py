import re, json

with open('learniverse-ai/src/data/top100Data.ts', encoding='utf-8') as f:
    text = f.read()

# Let's extract the questions from existing top100Data.ts
# Using a python script that parses the TS object or regex
print("Length of top100Data.ts:", len(text))

# Let's see all categories and titles in current top100Data.ts
pattern = r'id:\s*(\d+),\s*title:\s*"([^"]+)",\s*category:\s*"([^"]+)"'
matches = re.findall(pattern, text)
print(f"Matched {len(matches)} questions:")
for m in matches[:10]:
    print(m)
print("...")
for m in matches[-10:]:
    print(m)
