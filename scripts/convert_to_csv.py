import json
import csv
import sys
import os

input_file = r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\questions.json'
output_file = r'C:\Users\dhanu\OneDrive\Desktop\learn\learniverse-ai\questions.csv'

try:
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Some datasets might be a single dictionary with categories as keys. 
    # From previous check, it's a list of dictionaries.
    if isinstance(data, dict):
        print("Dataset is a dictionary, need to flatten it.")
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
    # Add any extra keys found in the JSON
    for k in keys:
        if k not in header:
            header.append(k)

    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=header, extrasaction='ignore')
        writer.writeheader()
        for item in data:
            row = item.copy()
            # Convert lists/dicts to strings for CSV
            for k, v in row.items():
                if isinstance(v, list):
                    row[k] = " | ".join([str(x) for x in v])
                elif isinstance(v, dict):
                    row[k] = json.dumps(v)
            writer.writerow(row)
            
    print(f"Successfully generated {output_file}")
except Exception as e:
    print(f"Error: {e}")
