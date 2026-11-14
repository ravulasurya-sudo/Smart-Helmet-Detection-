import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      shadow: 'shadow-blue-500/5',
      indicator: 'bg-blue-500'
    },
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      shadow: 'shadow-emerald-500/5',
      indicator: 'bg-emerald-500'
    },
    red: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/30',
      text: 'text-rose-400',
      shadow: 'shadow-rose-500/5',
      indicator: 'bg-rose-500'
    },
    amber: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      shadow: 'shadow-amber-500/5',
      indicator: 'bg-amber-500'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      shadow: 'shadow-purple-500/5',
      indicator: 'bg-purple-500'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-5 rounded-2xl bg-[#0F172A] border ${scheme.border} ${scheme.shadow} shadow-lg relative overflow-hidden transition-all duration-200 hover:-translate-y-0.5`}>
      {/* Accent corner line */}
      <div className={`absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-20 bg-gradient-to-br from-transparent to-${color}-500`}></div>
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1 font-mono tracking-tight">{value}</h3>
          {subtitle && (
            <p className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
              <span>{subtitle}</span>
            </p>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl ${scheme.bg} ${scheme.border} border flex items-center justify-center ${scheme.text}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Benchmark Rate</span>
          <span className={`font-semibold ${scheme.text}`}>{trend}</span>
        </div>
      )}
    </div>
  );
}

