import requests
from bs4 import BeautifulSoup
from pathlib import Path
from urllib.parse import urljoin, urlparse
import time

BASE_URL = "https://opendatastructures.org/ods-java/"

output_dir = Path("data/raw")
output_dir.mkdir(parents=True, exist_ok=True)

visited = set()
to_visit = {"ods-java-html.html", "Contents.html", "Index.html"}

print("Starting recursive crawl of Open Data Structures (Java Edition)...")

while to_visit:
    url_path = to_visit.pop()
    if url_path in visited:
        continue

    full_url = urljoin(BASE_URL, url_path)
    try:
        response = requests.get(full_url)
        if response.status_code != 200:
            print(f"Skipped {url_path} (status: {response.status_code})")
            continue

        visited.add(url_path)

        # Save HTML content
        with open(output_dir / url_path, "w", encoding="utf-8") as f:
            f.write(response.text)

        print(f"Downloaded {url_path}")

        # Extract links from page
        soup = BeautifulSoup(response.text, "html.parser")
        for a in soup.find_all("a", href=True):
            href = a["href"]
            parsed_href = urlparse(href)
            
            # We only follow relative links that point to local HTML files on the same site
            if not parsed_href.scheme and not parsed_href.netloc:
                clean_path = parsed_href.path
                if clean_path.endswith(".html") and clean_path not in visited:
                    to_visit.add(clean_path)

        # Politeness delay to prevent rate limits
        time.sleep(0.1)

    except Exception as e:
        print(f"Error downloading {url_path}: {e}")

print(f"Crawling complete. Total files downloaded: {len(visited)}")