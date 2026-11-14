import os
import sys
import shutil
from pathlib import Path
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

# Local modules
from database.db import save_detection, get_history, get_statistics, init_db
from detector import detector
from report_generator import generate_pdf_report, generate_csv_report

# Paths
BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
OUTPUTS_DIR = BASE_DIR / "outputs"
REPORTS_DIR = BASE_DIR / "reports"
DIST_DIR = BASE_DIR.parent / "frontend" / "dist"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
OUTPUTS_DIR.mkdir(parents=True, exist_ok=True)
REPORTS_DIR.mkdir(parents=True, exist_ok=True)

# Initialize database
init_db()

app = FastAPI(
    title="Smart Helmet Detection & Traffic Police Alert System",
    description="Automated AI surveillance REST API powered by custom YOLOv5s weights",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/outputs", StaticFiles(directory=str(OUTPUTS_DIR)), name="outputs")
app.mount("/reports", StaticFiles(directory=str(REPORTS_DIR)), name="reports")

# 1. Health check endpoint
@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "system": "Smart Helmet Safety Alert System",
        "model": detector.model_name,
        "is_checkpoint_active": detector.is_loaded,
        "classes": detector.class_names,
        "primary_model": "YOLOv5s (mAP50: 75.40%, Recall: 74.20%)",
        "message": "Traffic Police Command Server Operational"
    }

# 2. Image Detection Endpoint
@app.post("/api/detect")
async def detect_image(
    file: UploadFile = File(...),
    confidence: Optional[float] = Form(0.35)
):
    # Validate extension
    allowed_exts = {".jpg", ".jpeg", ".png"}
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in allowed_exts:
        raise HTTPException(
            status_code=400, 
            detail="Unsupported format. Only JPG, JPEG, and PNG images are permitted."
        )

    # Save original image to uploads folder
    safe_name = Path(file.filename).name.replace(" ", "_")
    orig_path = UPLOADS_DIR / safe_name
    
    with open(orig_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Run inference using YOLOv5 detector
        results = detector.detect(orig_path, conf_threshold=confidence)

        # Log into SQLite database
        record_id = save_detection(
            filename=safe_name,
            image_path=f"/uploads/{safe_name}",
            annotated_path=results["annotated_path"],
            helmets_count=results["helmets_count"],
            violations_count=results["violations_count"],
            compliance_rate=results["compliance_rate"],
            inference_time_ms=results["inference_time_ms"],
            model_name=results["model_name"],
            detections=results["detections"]
        )

        return {
            "success": True,
            "id": record_id,
            "filename": safe_name,
            "original_path": f"/uploads/{safe_name}",
            "annotated_path": results["annotated_path"],
            "helmets_count": results["helmets_count"],
            "violations_count": results["violations_count"],
            "total_riders": results["total_riders"],
            "compliance_rate": results["compliance_rate"],
            "inference_time_ms": results["inference_time_ms"],
            "model_name": results["model_name"],
            "detections": results["detections"],
            "is_checkpoint_active": results["is_checkpoint_active"]
        }
    except Exception as e:
        print(f"[API Error] Detection failed: {e}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

# 3. Detection History Endpoint
@app.get("/api/history")
async def get_detection_history(limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    records = get_history(limit=limit, offset=offset)
    return {
        "success": True,
        "count": len(records),
        "history": records
    }

# 4. Statistics Dashboard Endpoint
@app.get("/api/statistics")
async def get_dashboard_statistics():
    stats = get_statistics()
    return stats

# 5. Reports Summary Endpoint
@app.get("/api/reports")
async def get_reports_summary():
    stats = get_statistics()
    return {
        "success": True,
        "available_formats": ["pdf", "csv"],
        "statistics": stats
    }

# 6. Report Download Endpoint
@app.get("/api/reports/download")
async def download_report_file(format: str = Query("pdf", pattern="^(pdf|csv)$")):
    try:
        if format.lower() == "pdf":
            filepath, filename = generate_pdf_report()
            media_type = "application/pdf"
        else:
            filepath, filename = generate_csv_report()
            media_type = "text/csv"
            
        return FileResponse(
            path=str(filepath),
            filename=filename,
            media_type=media_type
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation failed: {str(e)}")

# 7. Model Performance Information Endpoint
@app.get("/api/models")
async def get_model_benchmarks():
    return {
        "selected_model": "YOLOv5",
        "benchmark_dataset": "Smart Helmet Traffic Surveillance Test Set (159 Images)",
        "models": [
            {
                "name": "YOLOv5",
                "precision": 71.10,
                "recall": 74.20,
                "map50": 75.40,
                "map50_95": 32.70,
                "selected": True,
                "notes": "Selected as primary web application engine. Highest mAP@0.5 (75.40%) and top recall (74.20%)."
            },
            {
                "name": "YOLOv6",
                "precision": 63.20,
                "recall": 60.00,
                "map50": 61.20,
                "map50_95": 27.20,
                "selected": False,
                "notes": "Lowest mAP@0.5 among tested architectures."
            },
            {
                "name": "YOLOv7",
                "precision": 66.90,
                "recall": 69.40,
                "map50": 68.60,
                "map50_95": 27.80,
                "selected": False,
                "notes": "Moderate precision with extended anchor refinement."
            },
            {
                "name": "YOLOv8s",
                "precision": 75.94,
                "recall": 63.48,
                "map50": 73.44,
                "map50_95": 34.51,
                "selected": False,
                "notes": "High precision but lower recall (63.48%), resulting in higher missed violations."
            },
            {
                "name": "YOLOv9",
                "precision": 67.90,
                "recall": 64.20,
                "map50": 67.10,
                "map50_95": 30.70,
                "selected": False,
                "notes": "GELAN architecture with programmable gradient information."
            },
            {
                "name": "YOLOv10",
                "precision": 71.47,
                "recall": 70.26,
                "map50": 73.88,
                "map50_95": 32.36,
                "selected": False,
                "notes": "NMS-free dual label assignments."
            },
            {
                "name": "YOLOv11",
                "precision": 71.71,
                "recall": 71.38,
                "map50": 73.19,
                "map50_95": 32.49,
                "selected": False,
                "notes": "Balanced C3k2 architecture."
            },
            {
                "name": "YOLOv12",
                "precision": 73.69,
                "recall": 68.28,
                "map50": 74.61,
                "map50_95": 34.15,
                "selected": False,
                "notes": "Area-attention mechanism with competitive mAP@0.5."
            }
        ]
    }

# Mount static frontend production build if available
if DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(DIST_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Allow static files in dist root (e.g. shield.svg, favicon, etc.)
        target = DIST_DIR / full_path
        if full_path and target.exists() and target.is_file():
            return FileResponse(target)
        # Fallback to index.html for React Router client routes
        index_file = DIST_DIR / "index.html"
        if index_file.exists():
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend build index.html not found.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8001, reload=True)
