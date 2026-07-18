from bs4 import BeautifulSoup
from pathlib import Path
import json
import re

# Calculate paths relative to backend root (grandparent of this script)
BACKEND_ROOT = Path(__file__).resolve().parent.parent
input_dir = BACKEND_ROOT / "data" / "raw"
output_dir = BACKEND_ROOT / "data"
output_dir.mkdir(parents=True, exist_ok=True)

SKIP_FILES = {
    "Contents.html",
    "Index.html",
    "Bibliography.html",
    "Acknowledgments.html",
    "About_this_document.html",
    "ods-java-html.html",
    "Why_This_Book.html"
}

# Mapping of chapter numbers to high-level chapter names
CHAPTER_MAPPING = {
    "1": "Introduction",
    "2": "Array-Based Lists",
    "3": "Linked Lists",
    "4": "Skiplists",
    "5": "Hash Tables",
    "6": "Binary Trees",
    "7": "Random Binary Search Trees",
    "8": "Scapegoat Trees",
    "9": "Red-Black Trees",
    "10": "Heaps",
    "11": "Sorting Algorithms",
    "12": "Graphs",
    "13": "Data Structures for Integers",
    "14": "External Memory Searching"
}

all_sections = []

for file in input_dir.glob("*.html"):
    if file.name in SKIP_FILES:
        continue

    with open(file, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    # Determine chapter title from filename prefix or content
    filename = file.name
    match = re.match(r"^(\d+)_", filename)
    if match:
        chapter_num = match.group(1)
        chapter_title = f"{chapter_num}. {CHAPTER_MAPPING.get(chapter_num, 'Unknown')}"
    elif "avl" in filename.lower():
        chapter_title = "9. Red-Black Trees"
    else:
        # Fallback to HTML title
        title_tag = soup.find("title")
        chapter_title = title_tag.text.strip() if title_tag else "Unknown"

    # Clean boilerplate elements
    for nav in soup.find_all("div", class_="navigation"):
        nav.decompose()
    for addr in soup.find_all("address"):
        addr.decompose()
    for script in soup.find_all("script"):
        script.decompose()
    for ul in soup.find_all("ul", class_="ChildLinks"):
        ul.decompose()
    
    child_links_header = soup.find("a", attrs={"name": "CHILD_LINKS"})
    if child_links_header:
        child_links_header.decompose()

    # Parse sections
    sections = soup.find_all(["h1", "h2", "h3", "h4"])
    for section in sections:
        section_name = section.get_text(" ", strip=True)
        if not section_name:
            continue

        # Extract content text until the next section heading
        content = []
        sibling = section.find_next_sibling()
        while sibling and sibling.name not in ["h1", "h2", "h3", "h4"]:
            if sibling.name:
                text = sibling.get_text(" ", strip=True)
                if text:
                    content.append(text)
            sibling = sibling.find_next_sibling()

        content_str = " ".join(content).strip()
        if content_str:
            # Clean up the topic name (remove numbering at start, which may have spaces)
            clean_topic = re.sub(r"^[\d\s\.]+\s*", "", section_name).strip()

            all_sections.append({
                "book": "Open Data Structures",
                "chapter": chapter_title,
                "section": section_name,
                "topic": clean_topic,
                "source": filename,
                "content": content_str
            })

with open(output_dir / "ods_parsed.json", "w", encoding="utf-8") as f:
    json.dump(all_sections, f, indent=2)

print(f"Parsing complete. Extracted {len(all_sections)} sections.")