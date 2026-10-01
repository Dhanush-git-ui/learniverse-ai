import urllib.request
import json
import ssl
import uuid

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

test_payload = {
    'session_id': str(uuid.uuid4()),
    'student_name': 'Live Vercel Verification Test',
    'roll_number': 'VERCEL_TEST_999',
    'role': 'AI Engineer Intern',
    'branch': 'CSE',
    'total_marks': 50.0,
    'max_marks': 70.0,
    'percentage': 71.43,
    'total_questions': 22,
    'attempted': 22,
    'correct_count': 18,
    'wrong_count': 4,
    'unanswered_count': 0,
    'question_answers': [
        {
            'question_id': 'ai_scenario_01',
            'category': 'Real-World Scenarios',
            'topic': 'Live Audio & Speech-to-Text Pipeline',
            'student_answer': 'Complete live architecture test via Vercel endpoint.',
            'correct_option': 'Evaluated by Engineering Rubrics',
            'is_correct': True,
            'marks_awarded': 25.0
        }
    ],
    'violations_count': 0,
    'violations_log': [],
    'status': 'completed'
}

data_bytes = json.dumps(test_payload).encode('utf-8')

# Test 1: Send directly to VERCEL live production URL
vercel_url = 'https://learniverse-ai.vercel.app/api/assessment/fixly/submit-direct'
headers = {
    'Content-Type': 'application/json',
    'X-API-Key': 'u8vX7q_K4P2mN9bL6wR1tY3zE5sA0dF8hJ9kL2mQ4wE',
    'User-Agent': 'Mozilla/5.0'
}

print(f"Step 1: Submitting candidate test to live Vercel URL: {vercel_url}")
req = urllib.request.Request(vercel_url, data=data_bytes, headers=headers, method='POST')
with urllib.request.urlopen(req, timeout=30, context=ctx) as resp:
    res = json.loads(resp.read().decode('utf-8'))
    print("Vercel Submission Response:", json.dumps(res, indent=2))

# Test 2: Check if Render Cloud DB captured it
check_url = 'https://learniverse-ai-zpph.onrender.com/api/assessment/fixly/submissions?roll_number=VERCEL_TEST_999'
print(f"\nStep 2: Checking if captured in database: {check_url}")
req2 = urllib.request.Request(check_url, headers=headers)
with urllib.request.urlopen(req2, timeout=30, context=ctx) as resp2:
    res2 = json.loads(resp2.read().decode('utf-8'))
    subs = res2.get('submissions', [])
    print(f"Found {len(subs)} verified record(s) in cloud DB!")
    for s in subs:
        print(f"  -> SUCCESS! Captured candidate: Roll={s.get('roll_number')}, Name={s.get('student_name')}, Marks={s.get('total_marks')}, Status={s.get('status')}")
