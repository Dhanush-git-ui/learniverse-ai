# ============================================================
# File: backend/db_schema_integration.py
# Purpose: Helper functions to use new schema features
# Usage: from db_schema_integration import record_integrity_event, save_browser_info
# ============================================================

import os
import logging
from typing import Optional, Dict, Any
from datetime import datetime, timezone
import psycopg2
from psycopg2 import sql

logger = logging.getLogger("learniverse.db_schema")

# Feature flags - enable after migration verified
ENABLE_INTEGRITY_EVENTS = os.environ.get("ENABLE_INTEGRITY_EVENTS", "true").lower() == "true"
ENABLE_BROWSER_INFO = os.environ.get("ENABLE_BROWSER_INFO", "true").lower() == "true"
TRACK_SESSION_UPDATES = os.environ.get("TRACK_SESSION_UPDATES", "true").lower() == "true"

def record_integrity_event(
    session_id: str,
    event_type: str,
    event_count: int = 1,
    details: Optional[str] = None,
    severity: str = "warning"
) -> bool:
    \"\"\"
    Record session integrity event to normalized table.
    
    Args:
        session_id: UUID of test session
        event_type: Type of event ('tab_switch', 'fullscreen_exit', 'copy_attempt', etc.)
        event_count: Number of times event occurred
        details: Additional JSON details about event
        severity: 'info', 'warning', or 'critical'
    
    Returns:
        True if successful, False otherwise
    \"\"\"
    if not ENABLE_INTEGRITY_EVENTS:
        return False
    
    try:
        # Import app.py's db connection pool
        from app import get_db_conn, release_db_conn
        
        conn = get_db_conn()
        if not conn:
            logger.warning(f"Could not acquire DB connection for integrity event")
            return False
        
        try:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO session_integrity_events 
                (session_id, event_type, event_count, details, severity, timestamp)
                VALUES (%s, %s, %s, %s, %s, CURRENT_TIMESTAMP)
            ''', (session_id, event_type, event_count, details, severity))
            
            conn.commit()
            cursor.close()
            logger.info(f"Recorded integrity event: {event_type} for session {session_id}")
            return True
        finally:
            release_db_conn(conn)
            
    except Exception as e:
        logger.error(f"Failed to record integrity event: {e}")
        return False


def save_browser_info(session_id: str, browser_data: Dict[str, Any]) -> bool:
    \"\"\"
    Save normalized browser information for session.
    
    Args:
        session_id: UUID of test session
        browser_data: Dict with keys:
            - browserName: str
            - browserVersion: str
            - osName: str
            - osVersion: str
            - userAgent: str
            - screenWidth: int
            - screenHeight: int
            - timezone: str
            - locale: str
    
    Returns:
        True if successful, False otherwise
    \"\"\"
    if not ENABLE_BROWSER_INFO:
        return False
    
    try:
        from app import get_db_conn, release_db_conn
        
        conn = get_db_conn()
        if not conn:
            logger.warning(f"Could not acquire DB connection for browser info")
            return False
        
        try:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO session_browser_info 
                (session_id, browser_name, browser_version, os_name, os_version,
                 user_agent, screen_width, screen_height, timezone, locale, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                ON CONFLICT (session_id) DO UPDATE SET
                    browser_name = EXCLUDED.browser_name,
                    browser_version = EXCLUDED.browser_version,
                    os_name = EXCLUDED.os_name,
                    os_version = EXCLUDED.os_version,
                    user_agent = EXCLUDED.user_agent,
                    screen_width = EXCLUDED.screen_width,
                    screen_height = EXCLUDED.screen_height,
                    timezone = EXCLUDED.timezone,
                    locale = EXCLUDED.locale,
                    updated_at = CURRENT_TIMESTAMP
            ''', (
                session_id,
                browser_data.get('browserName'),
                browser_data.get('browserVersion'),
                browser_data.get('osName'),
                browser_data.get('osVersion'),
                browser_data.get('userAgent'),
                browser_data.get('screenWidth'),
                browser_data.get('screenHeight'),
                browser_data.get('timezone'),
                browser_data.get('locale')
            ))
            
            conn.commit()
            cursor.close()
            logger.info(f"Saved browser info for session {session_id}")
            return True
        finally:
            release_db_conn(conn)
            
    except Exception as e:
        logger.error(f"Failed to save browser info: {e}")
        return False


def get_session_integrity_events(session_id: str, limit: int = 100) -> list:
    \"\"\"
    Retrieve integrity events for a session.
    
    Args:
        session_id: UUID of test session
        limit: Maximum number of events to return
    
    Returns:
        List of event dicts
    \"\"\"
    try:
        from app import get_db_conn, release_db_conn
        
        conn = get_db_conn()
        if not conn:
            return []
        
        try:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, event_type, event_count, timestamp, details, severity
                FROM session_integrity_events
                WHERE session_id = %s
                ORDER BY timestamp DESC
                LIMIT %s
            ''', (session_id, limit))
            
            rows = cursor.fetchall()
            cursor.close()
            
            events = []
            for row in rows:
                events.append({
                    'id': str(row[0]),
                    'event_type': row[1],
                    'event_count': row[2],
                    'timestamp': row[3].isoformat() if row[3] else None,
                    'details': row[4],
                    'severity': row[5]
                })
            
            return events
        finally:
            release_db_conn(conn)
            
    except Exception as e:
        logger.error(f"Failed to retrieve integrity events: {e}")
        return []


def get_browser_info(session_id: str) -> Optional[Dict[str, Any]]:
    \"\"\"
    Retrieve browser info for a session.
    
    Args:
        session_id: UUID of test session
    
    Returns:
        Dict with browser info or None if not found
    \"\"\"
    try:
        from app import get_db_conn, release_db_conn
        
        conn = get_db_conn()
        if not conn:
            return None
        
        try:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT browser_name, browser_version, os_name, os_version,
                       user_agent, screen_width, screen_height, timezone, locale,
                       created_at, updated_at
                FROM session_browser_info
                WHERE session_id = %s
            ''', (session_id,))
            
            row = cursor.fetchone()
            cursor.close()
            
            if not row:
                return None
            
            return {
                'browserName': row[0],
                'browserVersion': row[1],
                'osName': row[2],
                'osVersion': row[3],
                'userAgent': row[4],
                'screenWidth': row[5],
                'screenHeight': row[6],
                'timezone': row[7],
                'locale': row[8],
                'createdAt': row[9].isoformat() if row[9] else None,
                'updatedAt': row[10].isoformat() if row[10] else None
            }
        finally:
            release_db_conn(conn)
            
    except Exception as e:
        logger.error(f"Failed to retrieve browser info: {e}")
        return None


def migrate_jsonb_events_to_table(session_id: str) -> int:
    \"\"\"
    Migrate existing JSONB suspicious_events to session_integrity_events table.
    Call this periodically to migrate old data.
    
    Args:
        session_id: UUID of test session
    
    Returns:
        Number of events migrated
    \"\"\"
    try:
        from app import get_db_conn, release_db_conn
        import json
        
        conn = get_db_conn()
        if not conn:
            return 0
        
        try:
            cursor = conn.cursor()
            
            # Get JSONB events from test_sessions
            cursor.execute('''
                SELECT suspicious_events FROM test_sessions WHERE session_id = %s
            ''', (session_id,))
            
            row = cursor.fetchone()
            if not row or not row[0]:
                return 0
            
            events_json = row[0]
            if isinstance(events_json, str):
                events_json = json.loads(events_json)
            
            if not events_json:
                return 0
            
            migrated = 0
            for event in events_json:
                try:
                    cursor.execute('''
                        INSERT INTO session_integrity_events
                        (session_id, event_type, details, severity)
                        VALUES (%s, %s, %s, %s)
                    ''', (
                        session_id,
                        event.get('type', 'unknown'),
                        json.dumps(event),
                        'warning'
                    ))
                    migrated += 1
                except Exception as e:
                    logger.warning(f"Failed to migrate event: {e}")
            
            conn.commit()
            cursor.close()
            logger.info(f"Migrated {migrated} events for session {session_id}")
            return migrated
            
        finally:
            release_db_conn(conn)
            
    except Exception as e:
        logger.error(f"Failed to migrate JSONB events: {e}")
        return 0
