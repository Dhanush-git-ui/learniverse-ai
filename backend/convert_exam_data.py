import os
import json
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

# 1. Convert Student Responses Excel -> students_roster.json
students_excel = os.path.join(DATA_DIR, "Student_Responses.xlsx")
if os.path.exists(students_excel):
    df_students = pd.read_excel(students_excel)
    df_students.columns = [c.strip() for c in df_students.columns]
    
    roster = []
    for idx, row in df_students.iterrows():
        raw_roll = str(row.get('College roll no', '')).strip()
        clean_roll = f"TEMP_{idx+1:03d}" if raw_roll.lower() in ('nan', 'none', '') else raw_roll.upper().replace(" ", "")
        role_str = str(row.get('Role', '')).strip()
        standard_role = "DevOps Intern" if "devops" in role_str.lower() else "Mobile App Developer Intern"
        
        roster.append({
            "roll_number": clean_roll,
            "name": str(row.get('Name', '')).strip(),
            "role": standard_role,
            "branch": str(row.get('Branch', 'CSE')).strip(),
            "email": str(row.get('Mail id', '')).strip(),
            "phone": str(row.get('Phone number', '')).strip()
        })
        
    with open(os.path.join(DATA_DIR, "students_roster.json"), "w", encoding="utf-8") as f:
        json.dump(roster, f, indent=2)
    print(f"Generated students_roster.json with {len(roster)} candidates.")

# 2. Convert DevOps Questions Excel -> devops_questions.json
devops_excel = os.path.join(DATA_DIR, "DevOps_Questions.xlsx")
if os.path.exists(devops_excel):
    df_dev = pd.read_excel(devops_excel)
    dev_qs = []
    for idx, row in df_dev.iterrows():
        dev_qs.append({
            "id": f"devops_{idx+1:03d}",
            "category": "DevOps",
            "topic": str(row.get('Topic', 'DevOps Fundamentals')).strip(),
            "difficulty": "Easy",
            "question": str(row.get('Question', '')).strip(),
            "options": [
                str(row.get('OPTION_A', '')).strip(),
                str(row.get('OPTION_B', '')).strip(),
                str(row.get('OPTION_C', '')).strip(),
                str(row.get('OPTION_D', '')).strip()
            ],
            "correct_option": str(row.get('Correct_Answer', 'A')).strip().upper(),
            "explanation": str(row.get('Answer_Explanation', '')).strip(),
            "marks": 1
        })
    with open(os.path.join(DATA_DIR, "devops_questions.json"), "w", encoding="utf-8") as f:
        json.dump(dev_qs, f, indent=2)
    print(f"Generated devops_questions.json with {len(dev_qs)} questions.")

# 3. Convert Mobile App / React Native Questions Excel -> react_native_questions.json
rn_candidates = [
    os.path.join(DATA_DIR, "Fixly_Mobile_App_Architecture_Screening_Questions_Corrected.xlsx"),
    os.path.join(os.path.dirname(__file__), "..", "..", "Fixly_Mobile_App_Architecture_Screening_Questions_Corrected.xlsx"),
    os.path.join(DATA_DIR, "ReactNative_Questions.xlsx"),
    os.path.join(DATA_DIR, "Mobile_App_Development_React_Native_Beginner_Screening_Questions (1).xlsx")
]

rn_excel = next((p for p in rn_candidates if os.path.exists(p)), None)
if rn_excel:
    df_rn = pd.read_excel(rn_excel)
    rn_qs = []
    for idx, row in df_rn.iterrows():
        diff_raw = str(row.get('Difficulty_Level', row.get('difficulty', 'Medium'))).strip()
        difficulty_formatted = diff_raw.replace('_', ' ').title() if diff_raw and diff_raw.lower() != 'nan' else 'Medium'
        
        rn_qs.append({
            "id": f"rn_{idx+1:03d}",
            "category": str(row.get('Skill', 'Mobile App Development')).strip(),
            "role": "Mobile App Developer Intern",
            "topic": str(row.get('Topic', 'Mobile App Architecture')).strip(),
            "difficulty": difficulty_formatted,
            "question": str(row.get('Question', '')).strip(),
            "options": [
                str(row.get('OPTION_A', '')).strip(),
                str(row.get('OPTION_B', '')).strip(),
                str(row.get('OPTION_C', '')).strip(),
                str(row.get('OPTION_D', '')).strip()
            ],
            "correct_option": str(row.get('Correct_Answer', 'A')).strip().upper(),
            "explanation": str(row.get('Answer_Explanation', '')).strip(),
            "tags": str(row.get('Tags', '')).strip(),
            "marks": 1,
            "negative_marks": 0.0
        })
    with open(os.path.join(DATA_DIR, "react_native_questions.json"), "w", encoding="utf-8") as f:
        json.dump(rn_qs, f, indent=2, ensure_ascii=False)
    print(f"Generated react_native_questions.json with {len(rn_qs)} questions from {os.path.basename(rn_excel)}.")

