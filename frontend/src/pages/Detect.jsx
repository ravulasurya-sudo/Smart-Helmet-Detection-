import React, { useState, useRef } from 'react';
import { 
  Scan, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Cpu, 
  Download, 
  RotateCcw, 
  Sliders, 
  Eye, 
  FileText, 
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Layers,
  Zap,
  Info
} from 'lucide-react';
import { detectHelmet, downloadReport } from '../services/api';

const SAMPLES = [
  {
    id: 'sample1',
    name: 'Sample 1: Compliant Helmet',
    tag: 'Class 0: helmet',
    desc: 'Motorcycle rider wearing certified safety helmet',
    path: '/samples/sample_helmet.jpg',
    expected: 'Compliant'
  },
  {
    id: 'sample2',
    name: 'Sample 2: Helmet Violation',
    tag: 'Class 1: no_helmet',
    desc: 'Motorcycle rider operating without safety helmet',
    path: '/samples/sample_violation.jpg',
    expected: 'Violation'
  },
  {
    id: 'sample3',
    name: 'Sample 3: Roadway Traffic',
    tag: 'Traffic Snapshot',
    desc: 'Intersection roadway surveillance frame',
    path: '/samples/sample_traffic.jpg',
    expected: 'Roadway'
  }
];

export default function Detect() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [confidence, setConfidence] = useState(0.35);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('annotated'); // 'annotated' or 'original'
  const [activeSample, setActiveSample] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Please upload a valid JPG, JPEG, or PNG image.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setActiveSample(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setError('Please upload a valid JPG, JPEG, or PNG image.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
      setActiveSample(null);
    }
  };

  const handleLoadSample = async (sample) => {
    setActiveSample(sample.id);
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      // Fetch sample blob from public path
      const res = await fetch(sample.path);
      const blob = await res.blob();
      const file = new File([blob], sample.path.split('/').pop(), { type: 'image/jpeg' });
      
      setSelectedFile(file);
      setPreviewUrl(sample.path);
      
      // Auto run detection on sample for instant feedback
      const data = await detectHelmet(file, confidence);
      setResult(data);
    } catch (err) {
      console.error('Failed to analyze sample', err);
      setError('Could not run detection on sample. Please check that backend server is active.');
    } finally {
      setLoading(false);
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
    try {
      const data = await detectHelmet(selectedFile, confidence);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Detection failed. Ensure the FastAPI backend server is active on port 8001.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setActiveSample(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Tactical Police HUD Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-400">
                AI Vision Surveillance Radar • Live Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Helmet Compliance & Safety Detection
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              High-precision computer vision powered by your custom-trained <strong className="text-blue-400">YOLOv5s</strong> model. Identifies riders wearing helmets and riders without helmets with instant violation flagging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => downloadReport('pdf')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold shadow-sm transition hover:scale-105 active:scale-95"
            >
              <FileText size={15} className="text-blue-400" />
              Police PDF Report
            </button>
          </div>
        </div>
      </div>

      {/* 1-Click Quick Test Presets */}
      <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              1-Click Quick Test Samples
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Click any preset below to test instantly</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            YOLOv5s Weights Active (best.pt)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              disabled={loading}
              className={`p-3.5 rounded-xl border text-left transition relative overflow-hidden group ${
                activeSample === sample.id
                  ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-xs text-white group-hover:text-blue-300 transition">
                  {sample.name}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    sample.expected === 'Compliant'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : sample.expected === 'Violation'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}
                >
                  {sample.tag}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed truncate">
                {sample.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Upload & Controls on Left, Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload & Configuration (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <Upload size={16} className="text-blue-400" />
              Traffic Snapshot Upload
            </h2>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px] ${
                previewUrl
                  ? 'border-blue-500/50 bg-blue-950/10'
                  : 'border-slate-700 hover:border-blue-400 bg-slate-950/40 hover:bg-slate-900/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                className="hidden"
                onChange={handleFileChange}
              />

              {previewUrl ? (
                <div className="space-y-3 w-full">
                  <div className="relative rounded-xl overflow-hidden max-h-48 bg-black/60 mx-auto border border-slate-800">
                    <img
                      src={previewUrl}
                      alt="Selected Traffic Frame"
                      className="w-full h-44 object-contain mx-auto"
                    />
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300">
                      {selectedFile?.name || 'snapshot.jpg'}
                    </div>
                  </div>
                  <span className="text-[11px] text-blue-400 font-medium hover:underline inline-block">
                    Click or drag new image to replace
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto shadow-inner">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-200">
                      Drag & Drop Traffic Photo
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      or click to browse from your device
                    </p>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-full bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">
                    Supported: JPG, JPEG, PNG
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Detection Threshold Slider */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sliders size={14} className="text-blue-400" />
                  Confidence Threshold
                </span>
                <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {Math.round(confidence * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10% (High Recall)</span>
                <span>50% (Balanced)</span>
                <span>90% (Strict)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleDetect}
                disabled={!selectedFile || loading}
                className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition ${
                  !selectedFile || loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Analyzing with YOLOv5...</span>
                  </>
                ) : (
                  <>
                    <Scan size={16} />
                    <span>Run Helmet Detection</span>
                  </>
                )}
              </button>

              {selectedFile && (
                <button
                  onClick={handleReset}
                  disabled={loading}
                  className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
                  title="Clear Snapshot"
                >
                  <RotateCcw size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Tactical Detection HUD Results (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {result ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 animate-fade-in">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${
                    result.violations_count > 0 
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {result.violations_count > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {result.violations_count > 0 
                        ? 'Traffic Safety Infraction Detected' 
                        : 'Safety Helmet Compliant Frame'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Surveillance Record #{result.id} • {result.filename}
                    </p>
                  </div>
                </div>

                {/* View Switcher Toggle */}
                <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                  <button
                    onClick={() => setActiveView('annotated')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeView === 'annotated'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    AI Annotated
                  </button>
                  <button
                    onClick={() => setActiveView('original')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      activeView === 'original'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Original Feed
                  </button>
                </div>
              </div>

              {/* Main Visual Display */}
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 shadow-inner group">
                <img
                  src={activeView === 'annotated' ? result.annotated_path : result.original_path}
                  alt="Detection View"
                  className="w-full max-h-[380px] object-contain mx-auto"
                />

                {/* Tactical HUD Overlay pill */}
                <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-200 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{result.model_name}</span>
                  <span className="text-slate-500">|</span>
                  <span className="text-blue-400">{Math.round(result.inference_time_ms)}ms</span>
                </div>
              </div>

              {/* Metric Counter Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-emerald-500/30">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block mb-0.5">
                    Helmets (Compliant)
                  </span>
                  <p className="text-2xl font-black text-emerald-400">
                    {result.helmets_count}
                  </p>
                  <span className="text-[10px] text-slate-500">Class ID 0 (Green Box)</span>
                </div>

                <div className={`p-3.5 rounded-xl bg-slate-950/80 border ${
                  result.violations_count > 0 ? 'border-red-500/50 bg-red-950/20' : 'border-slate-800'
                }`}>
                  <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold block mb-0.5">
                    Violations (No Helmet)
                  </span>
                  <p className={`text-2xl font-black ${result.violations_count > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                    {result.violations_count}
                  </p>
                  <span className="text-[10px] text-slate-500">Class ID 1 (Red Box)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-blue-500/30">
                  <span className="text-[10px] uppercase tracking-wider text-blue-400 font-bold block mb-0.5">
                    Compliance Rate
                  </span>
                  <p className="text-2xl font-black text-blue-400">
                    {result.total_riders > 0 ? `${result.compliance_rate}%` : 'N/A'}
                  </p>
                  <span className="text-[10px] text-slate-500">{result.total_riders} Total Riders</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-0.5">
                    Inference Speed
                  </span>
                  <p className="text-2xl font-black text-slate-200 font-mono">
                    {Math.round(result.inference_time_ms)}<span className="text-xs font-normal text-slate-400">ms</span>
                  </p>
                  <span className="text-[10px] text-slate-500">GPU Accelerated</span>
                </div>
              </div>

              {/* Bounding Box Inspection Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/50">
                <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers size={14} className="text-blue-400" />
                    Detected Objects Coordinate Table ({result.detections.length})
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Confidence Threshold: {Math.round(confidence * 100)}%</span>
                </div>

                <div className="max-h-36 overflow-y-auto">
                  {result.detections.length > 0 ? (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/40 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="py-2 px-3">Class</th>
                          <th className="py-2 px-3">Confidence</th>
                          <th className="py-2 px-3">Bounding Box [X1, Y1, X2, Y2]</th>
                          <th className="py-2 px-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {result.detections.map((det, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 font-mono text-[11px]">
                            <td className="py-2 px-3">
                              <span className={`px-2 py-0.5 rounded font-bold ${
                                det.is_violation ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                              }`}>
                                {det.class_name.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2 px-3 font-semibold text-white">{det.confidence}%</td>
                            <td className="py-2 px-3 text-slate-400">
                              [{det.x1}, {det.y1}, {det.x2}, {det.y2}]
                            </td>
                            <td className="py-2 px-3 text-right font-sans font-bold">
                              {det.is_violation ? (
                                <span className="text-red-400">CHALLAN REQUIRED</span>
                              ) : (
                                <span className="text-emerald-400">COMPLIANT</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No helmet or rider objects detected at current confidence threshold ({Math.round(confidence * 100)}%). Try lowering threshold slider to 25%.
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <a
                  href={result.annotated_path}
                  download={`annotated_${result.filename}`}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Download size={14} />
                  Save Evidence Image
                </a>
                <button
                  onClick={() => downloadReport('pdf')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95"
                >
                  <FileText size={14} />
                  Export Official Police PDF
                </button>
              </div>
            </div>
          ) : (
            /* Standby Placeholder */
            <div className="h-full min-h-[460px] rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mb-4 shadow-inner">
                <Scan size={32} className="animate-pulse" />
              </div>
              <h3 className="text-base font-bold text-slate-200">
                Surveillance HUD Awaiting Input
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Select one of the <strong className="text-blue-400">Quick Test Samples</strong> above or upload any traffic snapshot to view YOLOv5 object bounding boxes, counts, and compliance ratings.
              </p>
              <div className="flex items-center gap-4 mt-6 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                  Green = Helmet
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                  Red = Violation
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
