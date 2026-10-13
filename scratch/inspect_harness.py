with open('learniverse-ai/src/services/codeExecutionService.ts', encoding='utf-8') as f:
    lines = f.readlines()

for i, l in enumerate(lines[35:100], 36):
    print(f"{i}: {l}", end='')
