import json

with open('scratch/all_175_prepinsta.json', encoding='utf-8') as f:
    questions = json.load(f)

errors = []
for q in questions:
    qid = q.get('id')
    title = q.get('title')
    for field in ['title', 'category', 'difficulty', 'statement', 'inputFormat', 'outputFormat', 'examples', 'hint1', 'hint2', 'solution', 'boilerplate']:
        if field not in q or q[field] is None:
            errors.append(f"Q#{qid} ({title}) missing {field}")
    for lang in ['python', 'cpp', 'java', 'javascript']:
        if lang not in q.get('solution', {}) or not q['solution'][lang]:
            errors.append(f"Q#{qid} ({title}) missing solution for {lang}")
        if lang not in q.get('boilerplate', {}) or not q['boilerplate'][lang]:
            errors.append(f"Q#{qid} ({title}) missing boilerplate for {lang}")
    if not q.get('examples') or len(q['examples']) == 0:
        errors.append(f"Q#{qid} ({title}) has no examples")

if errors:
    print(f"Found {len(errors)} issues:")
    for e in errors[:10]:
        print(" -", e)
else:
    print(f"ALL {len(questions)} QUESTIONS VALIDATED PERFECTLY! Zero errors.")
