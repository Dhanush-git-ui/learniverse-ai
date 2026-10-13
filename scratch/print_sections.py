import json
with open(r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\scratch\prepinsta_sections_clean.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for sec in ['Getting Started', 'Working with Numbers']:
    print(f"=== {sec} ===")
    for i, q in enumerate(data[sec], 1):
        print(f"{i}. {q['title']}")
