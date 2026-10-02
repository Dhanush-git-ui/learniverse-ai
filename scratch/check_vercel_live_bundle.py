import urllib.request
import re
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = 'https://learniverse-ai.vercel.app/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
with urllib.request.urlopen(req, timeout=15, context=ctx) as r:
    html = r.read().decode('utf-8')

scripts = re.findall(r'src="([^"]+)"', html)
print('Live scripts found:', scripts)

for s in scripts:
    s_url = 'https://learniverse-ai.vercel.app' + s if s.startswith('/') else s
    req_s = urllib.request.Request(s_url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
    with urllib.request.urlopen(req_s, timeout=15, context=ctx) as rs:
        js = rs.read().decode('utf-8', errors='ignore')
    
    # Check for PlacementAssessment chunk references
    sub_chunks = re.findall(r'assets/PlacementAssessment-[^"]+\.js', js)
    if sub_chunks:
        print('PlacementAssessment chunks found:', sub_chunks)
        for chunk in sub_chunks:
            c_url = f'https://learniverse-ai.vercel.app/{chunk}'
            with urllib.request.urlopen(urllib.request.Request(c_url, headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'}), timeout=15, context=ctx) as rc:
                c_js = rc.read().decode('utf-8', errors='ignore')
            if 'Admin Portal' in c_js:
                print(f'-> [STALE BUNDLE] Admin Portal IS STILL PRESENT in {c_url}')
            else:
                print(f'-> [FRESH BUNDLE] Clean! Admin Portal is GONE in {c_url}')
