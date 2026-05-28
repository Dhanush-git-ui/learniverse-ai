# backend/scraper/download_calculus.py
import os
import requests
from bs4 import BeautifulSoup
import time

RAW_DIR = "backend/data/raw_calculus"
os.makedirs(RAW_DIR, exist_ok=True)

# Correct base paths for the stable single-variable edition
BASE_URL = "https://activecalculus.org/single/"
INDEX_URL = f"{BASE_URL}frontmatter.html" 

# Use standard headers so the server doesn't reject the script connection
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def download_calculus_chapters():
    print("Fetching index page to gather section targets...")
    try:
        response = requests.get(INDEX_URL, headers=HEADERS)
        if response.status_code != 200:
            print(f"Failed to download index page. HTTP Status Code: {response.status_code}")
            return
    except Exception as e:
        print(f"Network error encountered trying to hit index target: {e}")
        return
        
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract links pointing to the target chapters
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        # Isolates section files belonging to Chapters 1, 2, 3, and 4
        if href.startswith("sec-1-") or href.startswith("sec-2-") or href.startswith("sec-3-") or href.startswith("sec-4-"):
            if href not in links:
                links.append(href)
                
    print(f"Discovered {len(links)} relevant sections to download.")
    
    if len(links) == 0:
        print("Warning: No links matched structural criteria. Printing found anchor links for troubleshooting:")
        # Backup parser step if their nested page structure uses absolute paths or structural updates
        for sample_a in soup.find_all('a', href=True)[:15]:
            print(f"  -> Found alternative link text structural path: {sample_a['href']}")
    
    for link in sorted(links):
        target_url = f"{BASE_URL}{link}"
        print(f"Archiving: {target_url} ...")
        try:
            res = requests.get(target_url, headers=HEADERS)
            if res.status_code == 200:
                with open(os.path.join(RAW_DIR, link), "w", encoding="utf-8") as f:
                    f.write(res.text)
            else:
                print(f"Skipping {link} due to HTTP status {res.status_code}")
        except Exception as e:
            print(f"Failed to pull asset link {link}: {e}")
            
        time.sleep(1) # Polite scraping delay

if __name__ == "__main__":
    download_calculus_chapters()