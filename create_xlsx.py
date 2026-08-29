import json
import os
import openpyxl

input_file = r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\questions.json'
output_file = r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\questions.xlsx'

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    if isinstance(data, dict):
        flat_data = []
        for cat, items in data.items():
            if isinstance(items, list):
                for item in items:
                    item['category'] = cat
                    flat_data.append(item)
        data = flat_data
        
    keys = set()
    for item in data:
        keys.update(item.keys())
        
    header = ['id', 'category', 'category_label', 'topic', 'difficulty', 'question', 'options', 'answer', 'solution', 'source_repo', 'source_file']
    for k in keys:
        if k not in header:
            header.append(k)

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Questions"

    # Write header
    ws.append(header)

    # Write data
    for item in data:
        row = []
        for h in header:
            val = item.get(h, "")
            if isinstance(val, list):
                val = " | ".join([str(x) for x in val])
            elif isinstance(val, dict):
                val = json.dumps(val)
            row.append(str(val) if val is not None else "")
        ws.append(row)
        
    wb.save(output_file)
    print(f"Successfully generated {output_file}")

except Exception as e:
    print(f"Error: {e}")
