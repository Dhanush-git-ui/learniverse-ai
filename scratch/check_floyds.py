import json, re

with open('src/data/top100Data.ts', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const TOP_100_QUESTIONS: Top100Question\[\] = (\[.*\]);', text, re.DOTALL)
qs = json.loads(m.group(1))

q173 = next(q for q in qs if q['title'] == "Floyd's Triangle")
print("Statement:", q173['statement'])
print("Examples:", q173['examples'])
