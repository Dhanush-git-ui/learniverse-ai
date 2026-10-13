from bs4 import BeautifulSoup
import json
import re

with open(r'C:\Users\dhanu\.gemini\antigravity-ide\brain\55e5d2af-ec05-4784-90b4-2a7509ee6b82\.system_generated\steps\124\content.md', 'r', encoding='utf-8', errors='ignore') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

headings = soup.find_all(['h2', 'h3'])
print(f"Total h2/h3 headings found: {len(headings)}")

sections_data = {}

for h in headings:
    htext = h.get_text(strip=True)
    if not htext or len(htext) > 80:
        continue
    
    # Check parent elementor widget container and sibling text-editors
    parent_elementor = h.find_parent('div', class_='elementor-element')
    if not parent_elementor:
        continue
    
    # Find next sibling elementor widgets
    siblings = []
    curr = parent_elementor.find_next_sibling('div', class_='elementor-element')
    while curr:
        # If it's another heading, stop
        if curr.find(['h2', 'h3']):
            break
        siblings.append(curr)
        curr = curr.find_next_sibling('div', class_='elementor-element')
    
    questions = []
    for sib in siblings:
        for li in sib.find_all('li'):
            # Text of li
            li_full = li.get_text(" ", strip=True)
            # Find question title
            # Look for strong or text before languages
            strong = li.find(['strong', 'b'])
            strong_text = strong.get_text(strip=True) if strong else ""
            
            # Extract links
            links = {}
            for a in li.find_all('a'):
                lt = a.get_text(strip=True)
                lh = a.get('href', '')
                if lt and lh:
                    links[lt] = lh
            
            clean_title = strong_text
            if not clean_title or clean_title in ['C', 'C++', 'Java', 'Python']:
                # Clean from li_full
                clean_title = re.split(r'[:–\-\|]|\b(C|C\+\+|Java|Python)\b', li_full)[0].strip()
            
            clean_title = clean_title.rstrip(':').strip()
            if clean_title and len(clean_title) > 2 and clean_title not in ['Introduction to Top 100 codes', 'ASCII Table']:
                questions.append({
                    'title': clean_title,
                    'raw': li_full,
                    'links': links
                })
    
    if questions:
        sections_data[htext] = questions

print(f"\nExtracted sections with questions: {len(sections_data)}")
total_q = 0
for sec, qs in sections_data.items():
    print(f"\n=== {sec} ({len(qs)} questions) ===")
    total_q += len(qs)
    for i, q in enumerate(qs, 1):
        print(f"  {i}. {q['title']}")
print(f"\nTOTAL QUESTIONS: {total_q}")

with open(r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\scratch\prepinsta_sections_clean.json', 'w', encoding='utf-8') as out:
    json.dump(sections_data, out, indent=2)
