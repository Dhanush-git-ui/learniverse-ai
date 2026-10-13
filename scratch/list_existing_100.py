import json

with open('scratch/extracted_existing_100.json', encoding='utf-8') as f:
    existing = json.load(f)

print(f"Total existing: {len(existing)}")
for i, q in enumerate(existing):
    print(f"{q['id']}: [{q['category']}] {q['title']}")
