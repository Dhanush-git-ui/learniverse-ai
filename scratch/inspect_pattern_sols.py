import json, re

with open('src/data/top100Data.ts', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const TOP_100_QUESTIONS: Top100Question\[\] = (\[.*\]);', text, re.DOTALL)
qs = json.loads(m.group(1))

patterns = [q for q in qs if q['category'] == 'Pattern Printing']
for p in patterns:
    print(f"=== Q{p['id']}: {p['title']} ===")
    print("Python sol:\n", p['solution']['python'])
    print("Python boilerplate:\n", p['boilerplate']['python'])
    print()
