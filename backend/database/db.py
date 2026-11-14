import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "police_traffic.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH, timeout=20)
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create detections table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS detections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            image_path TEXT NOT NULL,
            annotated_path TEXT NOT NULL,
            helmets_count INTEGER DEFAULT 0,
            violations_count INTEGER DEFAULT 0,
            compliance_rate REAL DEFAULT 0.0,
            inference_time_ms REAL DEFAULT 0.0,
            model_name TEXT DEFAULT 'YOLOv5s',
            detections_json TEXT DEFAULT '[]',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create officers table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS officers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            badge_number TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            rank TEXT DEFAULT 'Traffic Police Inspector',
            station TEXT DEFAULT 'Central Traffic Command HQ',
            password_hash TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Seed default inspector if not present
    cursor.execute("SELECT id FROM officers WHERE badge_number = ?", ("POL-4092",))
    if not cursor.fetchone():
        cursor.execute("""
            INSERT INTO officers (badge_number, name, rank, station, password_hash)
            VALUES (?, ?, ?, ?, ?)
        """, (
            "POL-4092", 
            "Inspector R. Sharma", 
            "Senior Traffic Inspector", 
            "Central Surveillance Command HQ", 
            "police123"
        ))
        
    conn.commit()
    conn.close()

def save_detection(filename, image_path, annotated_path, helmets_count, violations_count, compliance_rate, inference_time_ms, model_name, detections):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        INSERT INTO detections (
            filename, image_path, annotated_path, helmets_count, violations_count, 
            compliance_rate, inference_time_ms, model_name, detections_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        filename,
        image_path,
        annotated_path,
        int(helmets_count),
        int(violations_count),
        float(compliance_rate),
        float(inference_time_ms),
        model_name,
        json.dumps(detections)
    ))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_history(limit=50, offset=0):
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT id, filename, image_path, annotated_path, helmets_count, violations_count,
               compliance_rate, inference_time_ms, model_name, detections_json, timestamp
        FROM detections
        ORDER BY id DESC
        LIMIT ? OFFSET ?
    """, (limit, offset))
    
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for r in rows:
        try:
            boxes = json.loads(r["detections_json"]) if r["detections_json"] else []
        except:
            boxes = []
        result.append({
            "id": r["id"],
            "filename": r["filename"],
            "image_path": r["image_path"],
            "annotated_path": r["annotated_path"],
            "helmets_count": r["helmets_count"],
            "violations_count": r["violations_count"],
            "compliance_rate": r["compliance_rate"],
            "inference_time_ms": r["inference_time_ms"],
            "model_name": r["model_name"],
            "detections": boxes,
            "timestamp": r["timestamp"]
        })
    return result

def get_statistics():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT 
            COUNT(*) as total_processed,
            COALESCE(SUM(helmets_count), 0) as total_helmets,
            COALESCE(SUM(violations_count), 0) as total_violations,
            COALESCE(AVG(inference_time_ms), 38.0) as avg_latency
        FROM detections
    """)
    stats_row = cursor.fetchone()
    
    total_processed = stats_row["total_processed"] if stats_row else 0
    total_helmets = stats_row["total_helmets"] if stats_row else 0
    total_violations = stats_row["total_violations"] if stats_row else 0
    avg_latency = stats_row["avg_latency"] if stats_row else 38.0
    
    total_riders = total_helmets + total_violations
    compliance_rate = round((total_helmets / total_riders * 100), 1) if total_riders > 0 else 0.0
    
    # Recent activity
    cursor.execute("""
        SELECT id, filename, image_path, annotated_path, helmets_count, violations_count,
               compliance_rate, inference_time_ms, model_name, timestamp
        FROM detections
        ORDER BY id DESC
        LIMIT 10
    """)
    recent_rows = cursor.fetchall()
    recent = []
    for r in recent_rows:
        recent.append({
            "id": r["id"],
            "filename": r["filename"],
            "image_path": r["image_path"],
            "annotated_path": r["annotated_path"],
            "helmets_count": r["helmets_count"],
            "violations_count": r["violations_count"],
            "compliance_rate": r["compliance_rate"],
            "inference_time_ms": r["inference_time_ms"],
            "model_name": r["model_name"],
            "timestamp": r["timestamp"]
        })
        
    conn.close()
    
    return {
        "total_processed": total_processed,
        "total_helmets": total_helmets,
        "total_violations": total_violations,
        "total_riders": total_riders,
        "compliance_rate": compliance_rate,
        "avg_latency": round(avg_latency, 1),
        "recent_activity": recent
    }

# Initialize on import
init_db()

