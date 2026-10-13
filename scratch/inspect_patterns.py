import json, re

with open('src/data/top100Data.ts', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const TOP_100_QUESTIONS: Top100Question\[\] = (\[.*\]);', text, re.DOTALL)
qs = json.loads(m.group(1))

patterns = [q for q in qs if q['category'] == 'Pattern Printing']
print(f"Total pattern questions: {len(patterns)}")
for p in patterns:
    print(f"Q{p['id']}: {p['title']}")
    print(f"  Statement: {p['statement'][:70]}...")
    print(f"  OutputFormat: {p['outputFormat']}")
    print(f"  Example: {repr(p['examples'][0]['output'])}")
    print()
