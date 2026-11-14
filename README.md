# Smart Helmet Detection and Rider Safety Alert System for Traffic Police

A full-stack, deep learning-powered web application designed for traffic police surveillance units to detect motorcycle helmet compliance (`helmet` vs `no_helmet`), log infractions to an SQLite audit trail, and export official PDF and CSV police enforcement reports.

---

## 🚔 Key Highlights

- **Primary Selected Architecture:** **YOLOv5** (Evaluated across 8 generations YOLOv5 through YOLOv12; achieved highest mAP@0.5: **75.40%** and high recall: **74.20%**).
- **Class Schema:**
  - `0: helmet` (Compliant rider headgear — annotated in **Emerald Green**)
  - `1: no_helmet` (Traffic law violation — annotated in **Crimson Red**)
- **Target Audience:** Traffic Police Officers, Surveillance Control Rooms, Enforcement Teams.
- **Image-Only Architecture:** Engineered strictly for static traffic camera snapshots (JPG, JPEG, PNG).

---

## 🏛 System Architecture & Technology Stack

```
[Traffic Snapshot (JPG/PNG)]
             │
             ▼
 [React.js Frontend (Vite)]
  ├── Tailwind CSS Dark Navy Police Theme
  ├── React Router & Auth Context
  ├── Recharts Data Visualizations
  └── Axios API Client
             │
             │ (Proxy: /api, /outputs, /reports)
             ▼
     [FastAPI Backend]
  ├── PyTorch / Ultralytics YOLOv5 Engine
  ├── OpenCV Bounding Box Annotator
  ├── SQLite Surveillance Database
  └── ReportLab PDF & CSV Generator
```

---

## 📁 Project Directory Structure

```text
DL PROJECT/
├── dataset/                        # Traffic surveillance dataset
│   └── obj/
├── backend/                        # FastAPI REST API & YOLOv5 Engine
│   ├── database/
│   │   ├── db.py                   # SQLite tables, queries, & statistics
│   │   └── police_traffic.db       # Persistent audit database
│   ├── models/
│   │   └── best.pt                 # Target location for trained YOLOv5 weights
│   ├── outputs/                    # Annotated traffic images
│   ├── reports/                    # Generated PDF dossiers & CSV exports
│   ├── uploads/                    # Original uploaded images
│   ├── detector.py                 # YOLOv5 inference & OpenCV rendering
│   ├── report_generator.py         # ReportLab PDF & CSV generation
│   ├── main.py                     # FastAPI server & route handlers
│   └── requirements.txt            # Python dependencies
├── frontend/                       # React + Vite web dashboard
│   ├── src/
│   │   ├── components/             # Navbar, Sidebar, StatCards
│   │   ├── context/                # AuthContext (Officer session)
│   │   ├── pages/
│   │   │   ├── Login.jsx           # Officer Login & Quick Demo Bypass
│   │   │   ├── Dashboard.jsx       # Operational metrics, charts, & logs
│   │   │   ├── Detect.jsx          # Drag-and-drop detection HUD
│   │   │   ├── History.jsx         # Searchable audit table with modals
│   │   │   ├── Reports.jsx         # PDF & CSV download console
│   │   │   ├── ModelInfo.jsx       # 8-Model comparison & benchmark table
│   │   │   └── About.jsx           # System specifications & architecture
│   │   ├── services/api.js         # Centralized Axios client
│   │   ├── App.jsx                 # Route manager
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Place Your Trained YOLOv5 Weights
Copy your trained checkpoint from Google Colab into:
```
backend/models/best.pt
```
*The detector automatically detects `best.pt`, verifies the class schema (`0: helmet`, `1: no_helmet`), and activates neural inference.*

### 2. Start the FastAPI Backend
```powershell
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8001 --reload
```
API Documentation will be live at: `http://127.0.0.1:8001/docs`

### 3. Start the React Frontend
In a second terminal window:
```powershell
cd frontend
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## 👮 Police Credentials (Demo Bypass)
- **Badge ID:** `POL-4092`
- **Default Password:** `police123`
- *Alternatively, click **"One-Click Inspector Demo Login"** on the login screen.*

---

## 📊 8-Model Benchmark Summary

| Model | Precision (%) | Recall (%) | mAP@0.5 (%) | mAP@0.5:0.95 (%) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **YOLOv5** | **71.10%** | **74.20%** | **75.40%** | **32.70%** | 🏆 **PRIMARY SELECTED** |
| YOLOv6 | 63.20% | 60.00% | 61.20% | 27.20% | Evaluated |
| YOLOv7 | 66.90% | 69.40% | 68.60% | 27.80% | Evaluated |
| YOLOv8s | 75.94% | 63.48% | 73.44% | 34.51% | Evaluated |
| YOLOv9 | 67.90% | 64.20% | 67.10% | 30.70% | Evaluated |
| YOLOv10 | 71.47% | 70.26% | 73.88% | 32.36% | Evaluated |
| YOLOv11 | 71.71% | 71.38% | 73.19% | 32.49% | Evaluated |
| YOLOv12 | 73.69% | 68.28% | 74.61% | 34.15% | Evaluated |

