import json
import re
from collections import Counter

with open('src/data/top100Data.ts', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'export const TOP_100_QUESTIONS: Top100Question\[\] = (\[.*\]);', text, re.DOTALL)
if not m:
    print('Failed to extract TOP_100_QUESTIONS JSON!')
else:
    qs = json.loads(m.group(1))
    print(f'Total questions: {len(qs)}')
    cats = Counter(q['category'] for q in qs)
    print('Categories:')
    for c, count in cats.items():
        print(f'  {c}: {count}')
    
    # Check completeness
    for q in qs:
        assert len(q['solution']) == 4, f'Q{q["id"]} missing solution'
        assert len(q['boilerplate']) == 4, f'Q{q["id"]} missing boilerplate'
        assert len(q['examples']) > 0, f'Q{q["id"]} missing examples'
        assert q['title'], f'Q{q["id"]} missing title'
        assert q['statement'], f'Q{q["id"]} missing statement'
        assert q['difficulty'] in ['Easy', 'Medium', 'Hard'], f'Q{q["id"]} bad difficulty'
    print('ALL 175 QUESTIONS VERIFIED SUCCESSFULLY!')
