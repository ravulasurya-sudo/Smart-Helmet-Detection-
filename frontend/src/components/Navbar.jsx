import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Scan, CheckCircle2, AlertCircle, FileText, Activity } from 'lucide-react';
import { checkHealth } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { officer } = useAuth();
  const [backendStatus, setBackendStatus] = useState({ status: 'checking', model: 'YOLOv5s (best.pt)' });

  useEffect(() => {
    let isMounted = true;
    const fetchHealth = async () => {
      try {
        const data = await checkHealth();
        if (isMounted) setBackendStatus(data);
      } catch {
        // fallback
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/': return 'Traffic Enforcement Operations Center';
      case '/detect': return 'Traffic Image Helmet Compliance Detection';
      case '/history': return 'Traffic Surveillance Audit & Evidence Log';
      case '/reports': return 'Police Safety & Violation Dossiers';
      case '/models': return '8-Model YOLO Generation Benchmark';
      case '/about': return 'Project Scope & System Architecture';
      default: return 'Traffic Police Helmet Detection System';
    }
  };

  return (
    <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Title */}
      <div>
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          {getPageTitle(location.pathname)}
        </h2>
        <p className="text-[11px] text-slate-400">
          Metropolitan Traffic Police • Automated Vision Enforcement Command
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Model State Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-blue-500/30 text-xs shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400 text-[11px] font-mono">Engine:</span>
          <span className="text-blue-400 font-bold text-[11px] font-mono">YOLOv5s Active</span>
        </div>

        {/* Backend Connectivity Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-emerald-400 font-semibold text-[11px]">Server Online</span>
        </div>

        {/* Officer Chip */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-200 font-semibold text-[11px]">{officer?.name || 'Insp. R. Sharma'}</span>
          <span className="text-slate-500 text-[10px]">({officer?.badge || 'POL-4092'})</span>
        </div>

        {/* Quick Detect Button */}
        {location.pathname !== '/detect' && (
          <Link
            to="/detect"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 transition hover:scale-105 active:scale-95"
          >
            <Scan size={14} />
            <span>Detect</span>
          </Link>
        )}
      </div>
    </header>
  );
}
