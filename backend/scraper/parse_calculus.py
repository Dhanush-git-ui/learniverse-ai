# backend/scraper/parse_calculus.py
import os
import json
from bs4 import BeautifulSoup

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, "..", "data"))
RAW_DIR = os.path.join(DATA_DIR, "raw_calculus")
OUTPUT_JSON = os.path.join(DATA_DIR, "calculus_parsed.json")

def parse_html_files():
    parsed_data = []
    
    if not os.path.exists(RAW_DIR):
        print(f"Error: Raw directory '{RAW_DIR}' not found. Run your downloaders first!")
        return

    files = [f for f in os.listdir(RAW_DIR) if f.endswith(".html")]
    print(f"Found {len(files)} raw calculus HTML files to parse.")

    for filename in sorted(files):
        file_path = os.path.join(RAW_DIR, filename)
        with open(file_path, "r", encoding="utf-8") as f:
            soup = BeautifulSoup(f.read(), 'html.parser')
            
        # Extract section titles safely from PreTeXt structures
        heading_node = soup.find(['h2', 'h3', 'h4'], class_='heading')
        if heading_node:
            section_title = heading_node.get_text(strip=True)
        else:
            title_node = soup.find('title')
            section_title = title_node.get_text(strip=True) if title_node else filename

        # Isolate structured blocks for Peer AI (activities/explorations)
        activities = []
        for act in soup.find_all(['article', 'div'], class_=['activity', 'exploration']):
            text_content = act.get_text(separator=" ", strip=True)
            if text_content:
                activities.append(text_content)
        
        # Isolate structured definitions for Teacher AI
        theorems_and_defs = []
        for block in soup.find_all(['article', 'div'], class_=['theorem', 'definition', 'assemblage']):
            text_content = block.get_text(separator=" ", strip=True)
            if text_content:
                theorems_and_defs.append(text_content)
        
        # Gather supporting standard paragraphs
        paragraphs = []
        for p in soup.find_all('p'):
            p_text = p.get_text(separator=" ", strip=True)
            if len(p_text) > 40:  # Avoid empty tags or brief nav strings
                paragraphs.append(p_text)
        
        parsed_data.append({
            "source_file": filename,
            "topic": section_title,
            "activities": activities,
            "theorems_and_definitions": theorems_and_defs,
            "general_paragraphs": paragraphs
        })
        
    with open(OUTPUT_JSON, "w", encoding="utf-8") as out:
        json.dump(parsed_data, out, indent=2)
        
    print(f"🎉 Success! Structured data compiled into {OUTPUT_JSON}")

if __name__ == "__main__":
    parse_html_files()