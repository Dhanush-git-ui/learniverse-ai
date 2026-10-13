import json

with open(r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\scratch\prepinsta_sections_clean.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for cat, qs in data.items():
    print(f"\n===============================")
    print(f"{cat} ({len(qs)} questions)")
    print(f"===============================")
    for i, q in enumerate(qs, 1):
        print(f"{i:2d}. {q['title']}")
