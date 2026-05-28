# backend/scraper/download_multi_patch.py
import os
import requests
from bs4 import BeautifulSoup
import time

RAW_DIR = "backend/data/raw_calculus"
os.makedirs(RAW_DIR, exist_ok=True)

# Direct target to the multivariable edition
BASE_URL = "https://activecalculus.org/multi/"
INDEX_URL = f"{BASE_URL}frontmatter.html"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
}

def download_multivariable():
    print("Fetching Multivariable Index...")
    res = requests.get(INDEX_URL, headers=HEADERS)
    soup = BeautifulSoup(res.text, 'html.parser')
    
    links = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        # Catch any variation of chapter 9, 10, 11, or 12 sections
        if href.startswith(("sec-9", "sec-10", "sec-11", "sec-12", "S-9", "S-10", "S-11", "S-12")):
            # Strip anchors like #ws- to get the clean base filename
            base_file = href.split('#')[0]
            if base_file not in links and base_file.endswith(".html"):
                links.append(base_file)
                
    print(f"Found {len(links)} multivariable sections to download.")
    
    for link in sorted(links):
        target_url = f"{BASE_URL}{link}"
        local_filename = f"multi_{link}"
        print(f"Patching: {target_url} -> {local_filename}")
        try:
            r = requests.get(target_url, headers=HEADERS)
            if r.status_code == 200:
                with open(os.path.join(RAW_DIR, local_filename), "w", encoding="utf-8") as f:
                    f.write(r.text)
            time.sleep(1)
        except Exception as e:
            print(f"Error downloading {link}: {e}")

if __name__ == "__main__":
    download_multivariable()