import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Layers, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Code2
} from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-police-card via-slate-900 to-police-card border border-police-border rounded-2xl p-8 relative overflow-hidden shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <ShieldCheck size={14} />
              Intelligent Traffic Police Safety Enforcement System
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Smart Helmet Detection & Rider Safety System
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              An intelligent computer vision platform engineered specifically for traffic police departments to automate motorcycle helmet compliance verification, detect safety violations from roadway surveillance images, and issue audit-grade enforcement reports.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span className="px-4 py-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 font-mono text-xs font-semibold text-center">
              Primary Model: YOLOv5s
            </span>
          </div>
        </div>
      </div>

      {/* Core Objectives */}
      <div className="bg-police-card border border-police-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle2 size={20} className="text-emerald-400" />
          Key Project Objectives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-police-border">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold mb-3">
              1
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Automated Violation Detection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instantly identify two-wheeler riders traveling without mandatory protective headgear from uploaded traffic snapshots (JPG/PNG).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-police-border">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold mb-3">
              2
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">High-Recall YOLOv5 Inference</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Leverage custom-trained YOLOv5 weights achieving 75.40% mAP@0.5 and 74.20% recall to minimize missed non-compliance events.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-police-border">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold mb-3">
              3
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mb-1">Enforcement & Audit Reports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export downloadable PDF dossiers and CSV logs with complete timestamps, latency, and counts for traffic challan generation.
            </p>
          </div>
        </div>
      </div>

      {/* System Architecture Flow */}
      <div className="bg-police-card border border-police-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Layers size={20} className="text-blue-400" />
          End-to-End System Architecture
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Architected with strict separation of concerns, asynchronous inference handling, and an immutable SQLite audit trail.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-police-border">
            <span className="text-xs font-mono text-blue-400 font-bold block mb-1">PHASE 1</span>
            <h4 className="text-sm font-semibold text-slate-200">Traffic Image Ingestion</h4>
            <p className="text-[11px] text-slate-400 mt-1">High-res camera snapshots (JPG/JPEG/PNG) uploaded via React UI</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-police-border">
            <span className="text-xs font-mono text-blue-400 font-bold block mb-1">PHASE 2</span>
            <h4 className="text-sm font-semibold text-slate-200">FastAPI Asynchronous Gateway</h4>
            <p className="text-[11px] text-slate-400 mt-1">Validation, multipart parsing, and pre-processing pipeline</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-blue-500/30 bg-blue-950/20">
            <span className="text-xs font-mono text-emerald-400 font-bold block mb-1">PHASE 3</span>
            <h4 className="text-sm font-semibold text-white">YOLOv5 Neural Inference</h4>
            <p className="text-[11px] text-slate-300 mt-1">Bounding box prediction (0: helmet, 1: no_helmet) with OpenCV annotation</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-police-border">
            <span className="text-xs font-mono text-blue-400 font-bold block mb-1">PHASE 4</span>
            <h4 className="text-sm font-semibold text-slate-200">Audit & Police Reports</h4>
            <p className="text-[11px] text-slate-400 mt-1">SQLite incident logging, analytics calculation, and PDF/CSV export</p>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-police-card border border-police-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Code2 size={20} className="text-blue-400" />
          Full-Stack Technology Ecosystem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-police-border">
            <span className="font-semibold text-blue-400 block mb-1">Frontend Layer</span>
            <p className="text-slate-300 font-medium">React 18 + Vite</p>
            <p className="text-slate-400 mt-0.5">High-speed SPA with Tailwind CSS, Lucide Icons & Recharts analytics</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-police-border">
            <span className="font-semibold text-blue-400 block mb-1">Backend Server</span>
            <p className="text-slate-300 font-medium">FastAPI + Uvicorn</p>
            <p className="text-slate-400 mt-0.5">Asynchronous Python REST API with CORS and multipart image endpoints</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-police-border">
            <span className="font-semibold text-blue-400 block mb-1">Deep Learning Engine</span>
            <p className="text-slate-300 font-medium">YOLOv5 + PyTorch</p>
            <p className="text-slate-400 mt-0.5">Custom-trained weights (<code className="text-blue-300">best.pt</code>) with 75.40% mAP@0.5</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-police-border">
            <span className="font-semibold text-blue-400 block mb-1">Computer Vision</span>
            <p className="text-slate-300 font-medium">OpenCV (cv2) + Pillow</p>
            <p className="text-slate-400 mt-0.5">Bounding box rendering: Green (Helmet) & Red (No Helmet) with confidence badges</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-police-border">
            <span className="font-semibold text-blue-400 block mb-1">Database Store</span>
            <p className="text-slate-300 font-medium">SQLite 3</p>
            <p className="text-slate-400 mt-0.5">Lightweight ACID-compliant storage for surveillance logs, officer accounts & counts</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-900/60 border border-police-border">
            <span className="font-semibold text-blue-400 block mb-1">Reporting Engine</span>
            <p className="text-slate-300 font-medium">ReportLab & Pandas</p>
            <p className="text-slate-400 mt-0.5">Automated generation of official PDF dossiers and RFC 4180 CSV tables</p>
          </div>
        </div>
      </div>

      {/* Legal & Regulatory Compliance */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/30 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck size={20} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block font-semibold mb-0.5">Traffic Police Operational Standards</strong>
          This system is configured for static image verification from traffic camera checkpoints. All detections maintain full chain-of-custody metadata including source image hash, timestamp, bounding box coordinates, and model inference latency.
        </div>
      </div>
    </div>
  );
};

export default About;
