from bs4 import BeautifulSoup
import json

with open(r'C:\Users\dhanu\.gemini\antigravity-ide\brain\55e5d2af-ec05-4784-90b4-2a7509ee6b82\.system_generated\steps\124\content.md', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

target_sections = [
    'Getting Started',
    'Working with Numbers',
    'Codes for Recursion',
    'Important Codes related to Arrays',
    'Operations on Strings',
    'Advanced Codes related to Arrays',
    'Codes related to Matrix',
    'Pattern Printing'
]

results = {}
current_sec = None

# Find main content container
for tag in soup.find_all(['h2', 'h3', 'h4', 'ul', 'ol']):
    text = tag.get_text(strip=True)
    matched = False
    for s in target_sections:
        if s.lower() in text.lower() and len(text) < 60:
            current_sec = s
            matched = True
            if current_sec not in results:
                results[current_sec] = []
            break
    if not matched and current_sec and tag.name in ['ul', 'ol']:
        for li in tag.find_all('li'):
            a = li.find('a')
            if a:
                title = a.get_text(strip=True)
                href = a.get('href', '')
                if title and len(title) > 2 and 'prepinsta.com' in href:
                    # Avoid duplicates
                    if not any(x['title'] == title for x in results[current_sec]):
                        results[current_sec].append({'title': title, 'url': href})

total_qs = 0
for sec, items in results.items():
    print(f'=== {sec} ({len(items)} questions) ===')
    total_qs += len(items)
    for it in items:
        print(f"  - {it['title']} -> {it['url']}")
print(f"\nTotal extracted: {total_qs}")

with open(r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\scratch\prepinsta_top100_parsed.json', 'w', encoding='utf-8') as out:
    json.dump(results, out, indent=2)
