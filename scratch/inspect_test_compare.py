with open('learniverse-ai/src/services/codeExecutionService.ts', encoding='utf-8') as f:
    text = f.read()

import re
matches = re.findall(r'cleanOutput|normalize|compare', text)
print("Matching functions in codeExecutionService.ts:", set(matches))

# Let's inspect how actual output is compared with expected output
for line in text.splitlines():
    if 'actual' in line.lower() and 'expected' in line.lower():
        print(line.strip())
