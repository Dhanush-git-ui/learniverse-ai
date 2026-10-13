import json

with open('scratch/extracted_existing_100.json', encoding='utf-8') as f:
    existing = json.load(f)

with open('scratch/prepinsta_sections_clean.json', encoding='utf-8') as f:
    prepinsta = json.load(f)

print("Existing questions by category:")
existing_by_cat = {}
for q in existing:
    cat = q['category']
    existing_by_cat.setdefault(cat, []).append(q['title'])

for cat, titles in existing_by_cat.items():
    print(f"  {cat}: {len(titles)}")

print("\nPrepInsta parsed sections:")
for sec, items in prepinsta.items():
    print(f"  {sec}: {len(items)}")
