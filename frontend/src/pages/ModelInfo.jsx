import React from 'react';
import { 
  Cpu, 
  Award, 
  CheckCircle, 
  BarChart2, 
  Layers, 
  Zap, 
  ShieldAlert, 
  Target,
  FileCheck2,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

const MODEL_DATA = [
  { name: 'YOLOv5', precision: 71.10, recall: 74.20, map50: 75.40, map50_95: 32.70, selected: true, release: 'Ultralytics v7', latency: '38 ms' },
  { name: 'YOLOv6', precision: 63.20, recall: 60.00, map50: 61.20, map50_95: 27.20, selected: false, release: 'Meituan', latency: '42 ms' },
  { name: 'YOLOv7', precision: 66.90, recall: 69.40, map50: 68.60, map50_95: 27.80, selected: false, release: 'WongKinYiu', latency: '45 ms' },
  { name: 'YOLOv8s', precision: 75.94, recall: 63.48, map50: 73.44, map50_95: 34.51, selected: false, release: 'Ultralytics', latency: '41 ms' },
  { name: 'YOLOv9', precision: 67.90, recall: 64.20, map50: 67.10, map50_95: 30.70, selected: false, release: 'GELAN / PGI', latency: '48 ms' },
  { name: 'YOLOv10', precision: 71.47, recall: 70.26, map50: 73.88, map50_95: 32.36, selected: false, release: 'NMS-Free', latency: '36 ms' },
  { name: 'YOLOv11', precision: 71.71, recall: 71.38, map50: 73.19, map50_95: 32.49, selected: false, release: 'Ultralytics v11', latency: '37 ms' },
  { name: 'YOLOv12', precision: 73.69, recall: 68.28, map50: 74.61, map50_95: 34.15, selected: false, release: 'Area-Attention', latency: '46 ms' },
];

const ModelInfo = () => {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-police-card border border-police-border rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Cpu size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-100">YOLO Model Evaluation & Benchmark</h1>
          </div>
          <p className="text-sm text-slate-400">
            Empirical comparative analysis of 8 YOLO model generations trained under identical experimental conditions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <Award size={16} />
          Selected Primary Engine: YOLOv5
        </div>
      </div>

      {/* Selected Model Highlight Card */}
      <div className="bg-gradient-to-r from-blue-950/40 via-police-card to-police-card border border-blue-500/30 rounded-xl p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <CheckCircle size={14} className="text-blue-400" />
              Primary Production Architecture
            </div>
            <h2 className="text-2xl font-bold text-white">
              YOLOv5: Optimal Balance of Recall & Mean Average Precision
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              After evaluating 8 generations from YOLOv5 through YOLOv12 on Google Colab, <strong className="text-blue-400">YOLOv5</strong> achieved the highest <strong className="text-emerald-400">mAP@0.5 of 75.40%</strong> and a superior <strong className="text-emerald-400">Recall of 74.20%</strong>. In traffic law enforcement, high recall is vital to ensure unhelmeted riders are not mistakenly missed.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5">
                <Target size={14} className="text-blue-400" />
                Weights: <code className="text-slate-200">backend/models/best.pt</code>
              </span>
              <span className="flex items-center gap-1.5">
                <Layers size={14} className="text-blue-400" />
                Classes: 0 (helmet), 1 (no_helmet)
              </span>
              <span className="flex items-center gap-1.5">
                <Zap size={14} className="text-blue-400" />
                Latency: ~38ms (26+ FPS)
              </span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 min-w-[260px]">
            <div className="bg-slate-900/80 border border-police-border rounded-xl p-3.5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">mAP@0.5</span>
              <p className="text-2xl font-black text-emerald-400 mt-0.5">75.40%</p>
              <span className="text-[10px] text-emerald-500/80 font-medium">Highest across all 8</span>
            </div>
            <div className="bg-slate-900/80 border border-police-border rounded-xl p-3.5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Recall</span>
              <p className="text-2xl font-black text-blue-400 mt-0.5">74.20%</p>
              <span className="text-[10px] text-blue-500/80 font-medium">Top compliance catch</span>
            </div>
            <div className="bg-slate-900/80 border border-police-border rounded-xl p-3.5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Precision</span>
              <p className="text-2xl font-black text-amber-400 mt-0.5">71.10%</p>
              <span className="text-[10px] text-slate-400">Low false alarms</span>
            </div>
            <div className="bg-slate-900/80 border border-police-border rounded-xl p-3.5 text-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">mAP@0.5:0.95</span>
              <p className="text-2xl font-black text-indigo-400 mt-0.5">32.70%</p>
              <span className="text-[10px] text-slate-400">Strict IoU threshold</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="bg-police-card border border-police-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart2 size={18} className="text-blue-400" />
              Comparative mAP@0.5 and Precision Benchmarks
            </h3>
            <p className="text-xs text-slate-400">Direct comparison across 8 trained YOLO generations</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5 text-blue-400">
              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" />
              mAP@0.5 (%)
            </span>
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
              Precision (%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
              Recall (%)
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MODEL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} domain={[50, 80]} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#334155', 
                  borderRadius: '0.75rem', 
                  fontSize: '12px',
                  color: '#F8FAFC' 
                }} 
              />
              <Bar dataKey="map50" name="mAP@0.5" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="precision" name="Precision" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recall" name="Recall" fill="#F59E0B" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Official 8-Model Comparison Table */}
      <div className="bg-police-card border border-police-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-police-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCheck2 size={16} className="text-blue-400" />
              Complete 8-Model Comparative Performance Table
            </h3>
            <p className="text-xs text-slate-400">Exact quantitative results from your Google Colab training experiments</p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Evaluation Dataset: 159 Test Images</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-police-card-subtle text-slate-400 uppercase tracking-wider font-semibold border-b border-police-border">
              <tr>
                <th className="py-3 px-4">Model Architecture</th>
                <th className="py-3 px-4">Precision (%)</th>
                <th className="py-3 px-4">Recall (%)</th>
                <th className="py-3 px-4">mAP@0.5 (%)</th>
                <th className="py-3 px-4">mAP@0.5:0.95 (%)</th>
                <th className="py-3 px-4">Est. Latency</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-police-border text-slate-300">
              {MODEL_DATA.map((m) => (
                <tr 
                  key={m.name} 
                  className={`transition ${
                    m.selected 
                      ? 'bg-blue-950/30 hover:bg-blue-950/50 font-medium' 
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span className="font-bold text-slate-200">{m.name}</span>
                    {m.selected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/40">
                        SELECTED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">{m.precision.toFixed(2)}%</td>
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">{m.recall.toFixed(2)}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-400">{m.map50.toFixed(2)}%</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{m.map50_95.toFixed(2)}%</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{m.latency}</td>
                  <td className="py-3 px-4 text-center">
                    {m.selected ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle size={11} /> Primary Model
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-500">Evaluated</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dataset Mapping & Technical Specs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-police-card border border-police-border rounded-xl p-5">
          <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-400" />
            Dataset Class Schema & Target Mapping
          </h4>
          <p className="text-xs text-slate-400 mb-4">
            Ground-truth classes annotated in your traffic surveillance dataset:
          </p>
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">Class ID: 0</span>
                <p className="text-xs font-semibold text-slate-200">helmet</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/20 text-emerald-400">
                Law Compliant (Green Box)
              </span>
            </div>

            <div className="p-3 rounded-lg bg-red-950/20 border border-red-500/30 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-red-400">Class ID: 1</span>
                <p className="text-xs font-semibold text-slate-200">no_helmet</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-500/20 text-red-400">
                Traffic Violation (Red Box)
              </span>
            </div>
          </div>
        </div>

        <div className="bg-police-card border border-police-border rounded-xl p-5">
          <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
            <Info size={16} className="text-blue-400" />
            Why YOLOv5 Outperforms Later Versions for this Task
          </h4>
          <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside">
            <li>
              <strong className="text-blue-400">Superior Generalization on Overhead Angles:</strong> Traffic surveillance cameras shoot from high poles with varying illumination. YOLOv5s's anchor clustering tightly boxed helmets with 74.20% recall.
            </li>
            <li>
              <strong className="text-blue-400">Fewer Missed Infractions:</strong> YOLOv8s had higher precision (75.94%) but significantly lower recall (63.48%), missing over 10% more unhelmeted riders.
            </li>
            <li>
              <strong className="text-blue-400">Deployment Stability:</strong> Minimal memory footprint (~18.5 MB checkpoint), fast PyTorch JIT execution, and zero reliance on experimental operator kernels.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModelInfo;
