import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Scan, 
  History, 
  FileText, 
  Cpu, 
  Info, 
  LogOut, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { officer, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Helmet Detection', path: '/detect', icon: Scan, highlight: true, badge: 'YOLOv5' },
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Surveillance History', path: '/history', icon: History },
    { name: 'Police Reports', path: '/reports', icon: FileText },
    { name: 'YOLO Benchmarks', path: '/models', icon: Cpu },
    { name: 'About System', path: '/about', icon: Info },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0 shadow-2xl z-40">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-950">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
            <ShieldCheck size={22} className="text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-wider text-white uppercase flex items-center gap-1.5">
              Traffic Police
            </h1>
            <p className="text-[11px] text-blue-400 font-medium">Smart Helmet Unit</p>
          </div>
        </div>

        {/* Live Engine Status Card */}
        <div className="mx-3 my-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium text-[11px]">Neural Engine</span>
          </div>
          <span className="text-emerald-400 font-mono text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            YOLOv5s
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                } ${item.highlight && !isActive ? 'border border-blue-500/20 text-blue-400' : ''}`}
              >
                <Icon size={16} className="shrink-0" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className={`ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Officer Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/50">
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between mb-2">
          <div className="truncate">
            <p className="text-xs font-bold text-slate-200 truncate">{officer?.name || 'Insp. R. Sharma'}</p>
            <p className="text-[10px] text-slate-400 font-mono">{officer?.badge || 'POL-4092'} • HQ Command</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition"
            title="Sign Out"
          >
            <LogOut size={15} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-600 font-mono">
          Smart Helmet System v2.0
        </p>
      </div>
    </aside>
  );
}
