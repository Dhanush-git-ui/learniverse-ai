import os
import json
import uuid
import re
from datetime import datetime, timezone, timedelta
from typing import Dict, List, Optional, Any

def init_multi_tenant_tables(db):
    """Creates the multi-tenant tables in PostgreSQL or SQLite if they do not exist."""
    # 1. Startup Companies
    db.execute("""
        CREATE TABLE IF NOT EXISTS startup_companies (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL,
            logo_url TEXT DEFAULT '',
            description TEXT DEFAULT '',
            website_url TEXT DEFAULT '',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 2. Assessment Tests
    db.execute("""
        CREATE TABLE IF NOT EXISTS assessment_tests (
            id TEXT PRIMARY KEY,
            company_id TEXT NOT NULL,
            test_name TEXT NOT NULL,
            role_track TEXT NOT NULL,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            duration_minutes INT DEFAULT 60,
            total_marks REAL DEFAULT 70.0,
            pass_percentage REAL DEFAULT 50.0,
            status TEXT DEFAULT 'ongoing',
            is_active INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 3. Test Rosters (Candidate registration per test)
    db.execute("""
        CREATE TABLE IF NOT EXISTS test_rosters (
            id TEXT PRIMARY KEY,
            test_id TEXT NOT NULL,
            full_name TEXT NOT NULL,
            roll_number TEXT NOT NULL,
            email TEXT DEFAULT '',
            branch TEXT DEFAULT 'CSE',
            phone TEXT DEFAULT '',
            attempt_status TEXT DEFAULT 'NOT_ATTEMPTED',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 4. Test Questions Pool
    db.execute("""
        CREATE TABLE IF NOT EXISTS test_questions (
            id TEXT PRIMARY KEY,
            test_id TEXT NOT NULL,
            question_id TEXT NOT NULL,
            category TEXT DEFAULT 'Domain',
            topic TEXT DEFAULT 'General',
            question_type TEXT DEFAULT 'mcq',
            question_data TEXT NOT NULL,
            marks REAL DEFAULT 1.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 5. Live Candidate Test Sessions
    db.execute("""
        CREATE TABLE IF NOT EXISTS test_candidate_sessions (
            id TEXT PRIMARY KEY,
            test_id TEXT NOT NULL,
            session_id TEXT NOT NULL,
            roll_number TEXT NOT NULL,
            student_name TEXT NOT NULL,
            started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            last_heartbeat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            current_question_index INT DEFAULT 0,
            violations_count INT DEFAULT 0,
            status TEXT DEFAULT 'in_progress',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)


def seed_default_multi_tenant_data(db, root_dir: str):
    """Seeds TechHash & Fixly default companies and current drives if not already present."""
    db.execute("SELECT count(*) as cnt FROM startup_companies WHERE slug = %s;", ("techhash",))
    row = db.fetchone()
    if row and (row.get("cnt") or row.get("count") or 0) > 0:
        return  # Already seeded

    now_utc = datetime.now(timezone.utc)
    th_comp_id = "comp_techhash_01"
    fx_comp_id = "comp_fixly_02"

    # Seed TechHash
    db.execute("""
        INSERT INTO startup_companies (id, name, slug, logo_url, description, website_url)
        VALUES (%s, %s, %s, %s, %s, %s);
    """, (
        th_comp_id,
        "TeccHash Pvt. Ltd.",
        "techhash",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80",
        "Enterprise technology solutions, AI pipelines, and high-performance backend systems.",
        "https://techhash.in"
    ))

    # Seed Fixly
    db.execute("""
        INSERT INTO startup_companies (id, name, slug, logo_url, description, website_url)
        VALUES (%s, %s, %s, %s, %s, %s);
    """, (
        fx_comp_id,
        "Fixly Innovations",
        "fixly",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80",
        "Next-generation mobile apps, modern web platforms, and automated workflow intelligence.",
        "https://fixly.ai"
    ))

    # Seed TechHash Active Test
    th_test_id = "test_techhash_fall_2026"
    test_start = (now_utc - timedelta(days=14)).isoformat()
    test_end = (now_utc - timedelta(days=2)).isoformat()

    db.execute("""
        INSERT INTO assessment_tests (
            id, company_id, test_name, role_track, start_time, end_time, duration_minutes, total_marks, status, is_active
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        th_test_id,
        th_comp_id,
        "TechHash Internship Screening Assessment 2026",
        "Engineering & Growth Interns",
        test_start,
        test_end,
        60,
        70.0,
        "completed",
        1
    ))

    # Seed Fixly Past Test
    fx_test_id = "test_fixly_summer_2026"
    db.execute("""
        INSERT INTO assessment_tests (
            id, company_id, test_name, role_track, start_time, end_time, duration_minutes, total_marks, status, is_active
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        fx_test_id,
        fx_comp_id,
        "Fixly Backend & Cloud Engineer Assessment",
        "Backend & Cloud Roles",
        test_start,
        test_end,
        90,
        100.0,
        "completed",
        1
    ))

    # Seed Roster from Excel / JSON if available
    roster_file = os.path.join(root_dir, "01_TechHash_Internship_Tests/Source_Documents/TeccHash Pvt. Ltd. - Internship Application Form (Responses).xlsx")
    roster_rows = []
    if os.path.exists(roster_file):
        try:
            import pandas as pd
            df = pd.read_excel(roster_file)
            name_c = next((c for c in df.columns if 'name' in c.lower()), 'Full Name')
            roll_c = next((c for c in df.columns if 'roll' in c.lower()), 'Roll Number ')
            email_c = next((c for c in df.columns if 'email' in c.lower()), 'College Email ID')
            branch_c = next((c for c in df.columns if 'branch' in c.lower()), 'Branch / Department')
            phone_c = next((c for c in df.columns if 'phone' in c.lower() or 'whatsapp' in c.lower()), 'Phone Number / WhatsApp Number')

            for _, r in df.iterrows():
                roll_val = str(r.get(roll_c, "")).strip().upper()
                name_val = str(r.get(name_c, "")).strip()
                if roll_val and roll_val != "NAN" and name_val:
                    roster_rows.append({
                        "id": f"rst_th_{uuid.uuid4().hex[:8]}",
                        "test_id": th_test_id,
                        "full_name": name_val,
                        "roll_number": roll_val,
                        "email": str(r.get(email_c, "")).strip(),
                        "branch": str(r.get(branch_c, "CSE")).strip(),
                        "phone": str(r.get(phone_c, "")).strip()
                    })
        except Exception as e:
            print(f"[MULTI-TENANT SEED] Roster read error: {e}")

    for r in roster_rows:
        try:
            db.execute("""
                INSERT INTO test_rosters (id, test_id, full_name, roll_number, email, branch, phone)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (r["id"], r["test_id"], r["full_name"], r["roll_number"], r["email"], r["branch"], r["phone"]))
        except Exception:
            pass


def get_all_tests_catalog(db) -> Dict[str, Any]:
    """Returns the multi-tenant catalog categorized into ongoing, upcoming, and past tests."""
    init_multi_tenant_tables(db)

    # 1. Fetch companies (auto-seed if empty)
    db.execute("SELECT * FROM startup_companies ORDER BY name ASC;")
    companies = [dict(c) for c in (db.fetchall() or [])]
    if not companies:
        root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
        seed_default_multi_tenant_data(db, root_dir)
        db.execute("SELECT * FROM startup_companies ORDER BY name ASC;")
        companies = [dict(c) for c in (db.fetchall() or [])]

    # 2. Fetch tests with company details
    db.execute("""
        SELECT t.*, c.name as company_name, c.slug as company_slug, c.logo_url as company_logo
        FROM assessment_tests t
        LEFT JOIN startup_companies c ON t.company_id = c.id
        ORDER BY t.start_time DESC;
    """)
    raw_tests = [dict(t) for t in (db.fetchall() or [])]

    now_utc = datetime.now(timezone.utc)
    ongoing = []
    upcoming = []
    past = []

    for t in raw_tests:
        test_id = t["id"]
        # Count roster
        db.execute("SELECT count(*) as cnt FROM test_rosters WHERE test_id = %s;", (test_id,))
        rcnt = db.fetchone()
        t["total_candidates"] = (rcnt.get("cnt") or rcnt.get("count") or 0) if rcnt else 0

        # Count completed submissions
        db.execute("""
            SELECT count(*) as cnt FROM fixly_test_submissions
            WHERE status IN ('completed', 'disqualified');
        """)
        scnt = db.fetchone()
        t["completed_count"] = (scnt.get("cnt") or scnt.get("count") or 0) if scnt else 0

        # In-progress sessions
        db.execute("""
            SELECT count(*) as cnt FROM test_candidate_sessions
            WHERE test_id = %s AND status = 'in_progress';
        """, (test_id,))
        ipcnt = db.fetchone()
        t["in_progress_count"] = (ipcnt.get("cnt") or ipcnt.get("count") or 0) if ipcnt else 0

        # Timing categorization
        s_time = t.get("start_time")
        e_time = t.get("end_time")
        try:
            if isinstance(s_time, str):
                s_dt = datetime.fromisoformat(s_time.replace("Z", "+00:00"))
            else:
                s_dt = s_time
            if isinstance(e_time, str):
                e_dt = datetime.fromisoformat(e_time.replace("Z", "+00:00"))
            else:
                e_dt = e_time
        except Exception:
            s_dt = now_utc - timedelta(days=1)
            e_dt = now_utc + timedelta(days=1)

        t["is_window_active"] = bool(s_dt <= now_utc <= e_dt) if (s_dt and e_dt) else True

        if t.get("status") == "completed" or (e_dt and now_utc > e_dt):
            t["computed_status"] = "past"
            past.append(t)
        elif s_dt and now_utc < s_dt:
            t["computed_status"] = "upcoming"
            upcoming.append(t)
        else:
            t["computed_status"] = "ongoing"
            ongoing.append(t)

    return {
        "status": "success",
        "counts": {
            "companies": len(companies),
            "ongoing": len(ongoing),
            "upcoming": len(upcoming),
            "past": len(past),
            "total_tests": len(raw_tests)
        },
        "companies": companies,
        "ongoing_tests": ongoing,
        "upcoming_tests": upcoming,
        "past_tests": past
    }


def lookup_candidate_assessment(db, identifier: str) -> Dict[str, Any]:
    """Finds active test for a candidate via Roll Number or Email with smart formatting tolerance."""
    init_multi_tenant_tables(db)
    raw = (identifier or "").strip().upper()
    clean = re.sub(r'[^A-Z0-9]', '', raw)
    if not clean:
        return {"found": False, "message": "Please enter a valid Roll Number or Email."}

    # Query all rosters
    db.execute("""
        SELECT r.*, t.id as test_id, t.test_name, t.role_track, t.start_time, t.end_time,
               t.duration_minutes, t.total_marks, t.status as test_status, t.is_active,
               c.name as company_name, c.logo_url as company_logo
        FROM test_rosters r
        JOIN assessment_tests t ON r.test_id = t.id
        LEFT JOIN startup_companies c ON t.company_id = c.id
        WHERE t.is_active = 1
        ORDER BY t.start_time DESC;
    """)
    rows = [dict(r) for r in (db.fetchall() or [])]

    matched_candidate = None
    for item in rows:
        r_clean = re.sub(r'[^A-Z0-9]', '', str(item.get("roll_number", "")).upper())
        r_email = str(item.get("email", "")).strip().lower()
        r_name = str(item.get("full_name", "")).strip().lower()

        # 1. Exact clean roll or email match
        if clean == r_clean or raw.lower() == r_email:
            matched_candidate = item
            break
        # 2. Tolerant missing 'E'
        if r_clean.replace("E", "") == clean.replace("E", "") and len(clean) >= 6:
            matched_candidate = item
            break
        # 3. Name match fallback
        if len(raw) >= 4 and (raw.lower() == r_name or raw.lower() in r_name):
            matched_candidate = item
            break

    if not matched_candidate:
        return {
            "found": False,
            "message": f"No active test roster entry found for '{identifier}'. Please check your Roll Number or contact the placement admin."
        }

    # Validate window
    now_utc = datetime.now(timezone.utc)
    s_time = matched_candidate.get("start_time")
    e_time = matched_candidate.get("end_time")
    try:
        s_dt = datetime.fromisoformat(str(s_time).replace("Z", "+00:00")) if s_time else now_utc
        e_dt = datetime.fromisoformat(str(e_time).replace("Z", "+00:00")) if e_time else now_utc + timedelta(days=1)
    except Exception:
        s_dt = now_utc
        e_dt = now_utc + timedelta(days=1)

    window_state = "active"
    window_message = "Test is currently LIVE and open."
    time_until_start_seconds = 0
    time_until_end_seconds = 0

    if now_utc < s_dt:
        window_state = "upcoming"
        time_until_start_seconds = int((s_dt - now_utc).total_seconds())
        window_message = f"Test has not started yet. It will open at {s_dt.strftime('%d %b %Y, %I:%M %p')}."
    elif now_utc > e_dt:
        window_state = "closed"
        window_message = f"Assessment window closed on {e_dt.strftime('%d %b %Y, %I:%M %p')}."
    else:
        time_until_end_seconds = int((e_dt - now_utc).total_seconds())

    # Check if already submitted
    roll = matched_candidate["roll_number"]
    db.execute("""
        SELECT id, total_marks, max_marks, percentage, status, submitted_at
        FROM fixly_test_submissions
        WHERE roll_number = %s
        ORDER BY submitted_at DESC LIMIT 1;
    """, (roll,))
    existing_sub = db.fetchone()

    return {
        "found": True,
        "candidate": {
            "full_name": matched_candidate["full_name"],
            "roll_number": matched_candidate["roll_number"],
            "email": matched_candidate.get("email"),
            "branch": matched_candidate.get("branch", "CSE"),
            "assigned_role": matched_candidate.get("role_track") or "Engineering Intern",
        },
        "test": {
            "test_id": matched_candidate["test_id"],
            "test_name": matched_candidate["test_name"],
            "company_name": matched_candidate.get("company_name", "Partner Startup"),
            "company_logo": matched_candidate.get("company_logo"),
            "role_track": matched_candidate["role_track"],
            "duration_minutes": matched_candidate.get("duration_minutes", 60),
            "total_marks": matched_candidate.get("total_marks", 70.0),
            "start_time": str(matched_candidate.get("start_time")),
            "end_time": str(matched_candidate.get("end_time")),
            "window_state": window_state,
            "window_message": window_message,
            "time_until_start_seconds": max(0, time_until_start_seconds),
            "time_until_end_seconds": max(0, time_until_end_seconds)
        },
        "submission": dict(existing_sub) if existing_sub else None
    }


def get_test_live_monitor(db, test_id: str) -> Dict[str, Any]:
    """Provides full real-time command center data for an active test drive."""
    init_multi_tenant_tables(db)

    # 1. Fetch test details
    db.execute("""
        SELECT t.*, c.name as company_name, c.logo_url as company_logo
        FROM assessment_tests t
        LEFT JOIN startup_companies c ON t.company_id = c.id
        WHERE t.id = %s;
    """, (test_id,))
    t_info = db.fetchone()
    if not t_info:
        # Fallback to first test
        db.execute("SELECT t.*, c.name as company_name FROM assessment_tests t LEFT JOIN startup_companies c ON t.company_id = c.id LIMIT 1;")
        t_info = db.fetchone()
        if not t_info:
            return {"status": "error", "message": "Test not found"}
        test_id = t_info["id"]

    # 2. Fetch full roster
    db.execute("SELECT * FROM test_rosters WHERE test_id = %s ORDER BY full_name ASC;", (test_id,))
    roster_rows = [dict(r) for r in (db.fetchall() or [])]

    # 3. Fetch submissions
    db.execute("SELECT * FROM fixly_test_submissions ORDER BY submitted_at DESC;")
    submissions = [dict(s) for s in (db.fetchall() or [])]
    sub_by_roll = {}
    for s in submissions:
        r_num = str(s.get("roll_number", "")).strip().upper()
        if r_num and r_num not in sub_by_roll:
            sub_by_roll[r_num] = s

    # 4. Fetch live sessions
    db.execute("SELECT * FROM test_candidate_sessions WHERE test_id = %s;", (test_id,))
    sessions = [dict(ss) for ss in (db.fetchall() or [])]
    sess_by_roll = {str(ss.get("roll_number", "")).strip().upper(): ss for ss in sessions}

    # 5. Classify candidates
    completed_list = []
    in_progress_list = []
    not_started_list = []

    for r in roster_rows:
        roll = str(r.get("roll_number", "")).strip().upper()
        sub = sub_by_roll.get(roll)
        sess = sess_by_roll.get(roll)

        if sub:
            completed_list.append({
                "full_name": r.get("full_name"),
                "roll_number": roll,
                "branch": r.get("branch", "CSE"),
                "email": r.get("email"),
                "status": "COMPLETED",
                "total_marks": sub.get("total_marks", 0),
                "max_marks": sub.get("max_marks", 70),
                "percentage": sub.get("percentage", 0),
                "violations": sub.get("violations_count", 0),
                "submitted_at": str(sub.get("submitted_at", ""))
            })
        elif sess and sess.get("status") == "in_progress":
            in_progress_list.append({
                "full_name": r.get("full_name"),
                "roll_number": roll,
                "branch": r.get("branch", "CSE"),
                "email": r.get("email"),
                "status": "IN_PROGRESS",
                "started_at": str(sess.get("started_at")),
                "last_heartbeat": str(sess.get("last_heartbeat")),
                "violations": sess.get("violations_count", 0),
                "current_question": sess.get("current_question_index", 1)
            })
        else:
            not_started_list.append({
                "full_name": r.get("full_name"),
                "roll_number": roll,
                "branch": r.get("branch", "CSE"),
                "email": r.get("email"),
                "status": "NOT_STARTED"
            })

    return {
        "status": "success",
        "test": dict(t_info),
        "metrics": {
            "total_registered": len(roster_rows),
            "completed": len(completed_list),
            "in_progress": len(in_progress_list),
            "not_started": len(not_started_list)
        },
        "completed": completed_list,
        "in_progress": in_progress_list,
        "not_started": not_started_list
    }


def create_assessment_test(db, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Creates a new assessment drive for a startup, registers roster candidates, and sets question pool."""
    init_multi_tenant_tables(db)

    company_name = str(payload.get("company_name", "Partner Startup")).strip()
    company_slug = re.sub(r'[^a-z0-9]', '', company_name.lower()) or "startup"
    company_logo = str(payload.get("company_logo", "")).strip()

    # Find or create company
    db.execute("SELECT id FROM startup_companies WHERE slug = %s;", (company_slug,))
    existing_c = db.fetchone()
    if existing_c:
        company_id = existing_c["id"]
    else:
        company_id = f"comp_{company_slug}_{str(uuid.uuid4())[:6]}"
        db.execute("""
            INSERT INTO startup_companies (id, name, slug, logo_url, description)
            VALUES (%s, %s, %s, %s, %s);
        """, (company_id, company_name, company_slug, company_logo, f"{company_name} hiring drive"))

    test_id = f"test_{company_slug}_{str(uuid.uuid4())[:8]}"
    test_name = str(payload.get("test_name") or f"{company_name} Technical Screening").strip()
    role_track = str(payload.get("role_track", "Full Stack Developer")).strip()
    start_time = payload.get("start_time") or datetime.now(timezone.utc).isoformat()
    end_time = payload.get("end_time") or (datetime.now(timezone.utc) + timedelta(days=2)).isoformat()
    duration_minutes = int(payload.get("duration_minutes") or 60)
    total_marks = float(payload.get("total_marks") or 70.0)
    pass_percentage = float(payload.get("pass_percentage") or 50.0)

    db.execute("""
        INSERT INTO assessment_tests (id, company_id, test_name, role_track, start_time, end_time, duration_minutes, total_marks, pass_percentage, status, is_active)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'ongoing', 1);
    """, (test_id, company_id, test_name, role_track, start_time, end_time, duration_minutes, total_marks, pass_percentage))

    # Insert roster
    roster_list = payload.get("roster") or []
    inserted_candidates = 0
    for cand in roster_list:
        name = str(cand.get("full_name") or cand.get("name") or "Candidate").strip()
        roll = str(cand.get("roll_number") or cand.get("roll") or "").strip().upper()
        if not roll:
            continue
        email = str(cand.get("email") or "").strip().lower()
        branch = str(cand.get("branch") or "CSE").strip().upper()
        phone = str(cand.get("phone") or "").strip()
        r_id = f"rost_{str(uuid.uuid4())[:8]}"
        db.execute("""
            INSERT INTO test_rosters (id, test_id, full_name, roll_number, email, branch, phone, attempt_status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'NOT_ATTEMPTED');
        """, (r_id, test_id, name, roll, email, branch, phone))
        inserted_candidates += 1

    # Insert questions if provided
    questions_list = payload.get("questions") or []
    inserted_questions = 0
    for q in questions_list:
        q_id = str(q.get("id") or str(uuid.uuid4())[:8])
        cat = str(q.get("category") or "Domain")
        topic = str(q.get("topic") or "General")
        q_type = str(q.get("type") or "mcq")
        marks = float(q.get("marks") or 1.0)
        q_json = json.dumps(q, ensure_ascii=False)
        tq_id = f"tq_{str(uuid.uuid4())[:8]}"
        db.execute("""
            INSERT INTO test_questions (id, test_id, question_id, category, topic, question_type, question_data, marks)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
        """, (tq_id, test_id, q_id, cat, topic, q_type, q_json, marks))
        inserted_questions += 1

    return {
        "status": "success",
        "message": f"Successfully created test '{test_name}' with {inserted_candidates} candidates and {inserted_questions} questions.",
        "test_id": test_id,
        "company_id": company_id,
        "candidates_count": inserted_candidates,
        "questions_count": inserted_questions
    }


def reset_candidate_session(db, test_id: str, roll_number: str) -> Dict[str, Any]:
    """Allows admin to reset a candidate's session for an unexpected freeze/disconnection."""
    roll = roll_number.strip().upper()
    # 1. Clear session
    db.execute("""
        DELETE FROM test_candidate_sessions
        WHERE roll_number = %s;
    """, (roll,))

    # 2. Reset roster status
    db.execute("""
        UPDATE test_rosters
        SET attempt_status = 'NOT_ATTEMPTED'
        WHERE roll_number = %s;
    """, (roll,))

    # 3. If there was a submission, also delete or invalidate it so candidate can start afresh
    db.execute("""
        DELETE FROM fixly_test_submissions
        WHERE roll_number = %s;
    """, (roll,))

    return {
        "status": "success",
        "message": f"Session and attempt state for candidate {roll} have been successfully reset."
    }


def heartbeat_candidate_session(db, test_id: str, roll_number: str, student_name: str, session_id: str, current_question: int = 1, violations: int = 0) -> Dict[str, Any]:
    """Updates candidate live heartbeat and proctor status in real-time."""
    init_multi_tenant_tables(db)
    roll = roll_number.strip().upper()
    now_utc = datetime.now(timezone.utc)
    expires_at = now_utc + timedelta(hours=2)

    db.execute("""
        SELECT id FROM test_candidate_sessions
        WHERE roll_number = %s;
    """, (roll,))
    existing = db.fetchone()

    if existing:
        db.execute("""
            UPDATE test_candidate_sessions
            SET last_heartbeat = %s, current_question_index = %s, violations_count = %s, status = 'in_progress'
            WHERE roll_number = %s;
        """, (now_utc, current_question, violations, roll))
    else:
        db.execute("""
            INSERT INTO test_candidate_sessions (id, test_id, session_id, roll_number, student_name, started_at, expires_at, last_heartbeat, current_question_index, violations_count, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'in_progress');
        """, (str(uuid.uuid4()), test_id or "default", session_id or str(uuid.uuid4()), roll, student_name, now_utc, expires_at, now_utc, current_question, violations))

    # Also mark roster in progress
    db.execute("""
        UPDATE test_rosters
        SET attempt_status = 'IN_PROGRESS'
        WHERE roll_number = %s;
    """, (roll,))

    return {"status": "ok"}

