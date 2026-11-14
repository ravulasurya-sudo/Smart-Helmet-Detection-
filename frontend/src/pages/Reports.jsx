import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Printer, 
  CheckCircle2, 
  RefreshCw,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';
import { getReports, getStatistics, downloadReport } from '../services/api';

const Reports = () => {
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activePeriod, setActivePeriod] = useState('all');

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, reportsData] = await Promise.all([
        getStatistics(),
        getReports()
      ]);
      setStats(statsData);
      setReports(reportsData.reports || []);
    } catch (err) {
      console.error('Failed to load report data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownload = (format) => {
    setGenerating(true);
    downloadReport(format);
    setTimeout(() => {
      setGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-police-card border border-police-border rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <FileText size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Police Safety Compliance Reports</h1>
          </div>
          <p className="text-sm text-slate-400">
            Generate and export official traffic department compliance audits, violation records, and deep learning metrics in PDF and CSV format.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload('csv')}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            <FileSpreadsheet size={15} className="text-emerald-400" />
            Download CSV Report
          </button>
          <button
            onClick={() => handleDownload('pdf')}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
          >
            <FileText size={15} className="text-white" />
            {generating ? 'Generating PDF...' : 'Download PDF Report'}
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-police-card border border-police-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">Audit Images Processed</p>
          <p className="text-2xl font-bold text-slate-100">{stats?.total_processed ?? 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Surveillance snapshots analyzed</span>
        </div>

        <div className="bg-police-card border border-police-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">Compliant Helmets</p>
          <p className="text-2xl font-bold text-emerald-400">{stats?.total_helmets ?? 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Riders wearing protective gear</span>
        </div>

        <div className="bg-police-card border border-police-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-red-400 font-semibold mb-1">Safety Violations</p>
          <p className="text-2xl font-bold text-red-400">{stats?.total_violations ?? 0}</p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Challan / citation candidates</span>
        </div>

        <div className="bg-police-card border border-police-border rounded-xl p-4">
          <p className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1">Compliance Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {stats && (stats.total_helmets + stats.total_violations > 0)
              ? `${Math.round((stats.total_helmets / (stats.total_helmets + stats.total_violations)) * 100)}%`
              : 'N/A'}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 inline-block">Overall fleet compliance</span>
        </div>
      </div>

      {/* Report Generator Specifications */}
      <div className="bg-police-card border border-police-border rounded-xl p-6">
        <h2 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
          <FileCheck size={18} className="text-blue-400" />
          Report Specifications & Contents
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Official reports are generated directly from the backend SQLite database and comply with traffic enforcement documentation guidelines.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-police-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={18} className="text-red-400" />
              <h3 className="text-sm font-semibold text-slate-200">Formal PDF Department Dossier</h3>
            </div>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Header with Police Department seal and official date/time</li>
              <li>Executive Summary of processed roadway frames and compliance rate</li>
              <li>Breakdown of helmet compliance vs safety violation totals</li>
              <li>Granular incident table with Image Filename, Counts, Inference Time, and Timestamp</li>
              <li>Model attribution: YOLOv5s (mAP50: 75.40%, Precision: 71.10%)</li>
            </ul>
            <button
              onClick={() => handleDownload('pdf')}
              className="mt-4 w-full py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold transition"
            >
              Export PDF Now
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-police-border">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet size={18} className="text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">Enforcement CSV Data Ledger</h3>
            </div>
            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>Machine-readable RFC 4180 CSV format compatible with Excel and GIS</li>
              <li>Columns: <code className="text-blue-400">Incident_ID</code>, <code className="text-blue-400">Timestamp</code>, <code className="text-blue-400">Filename</code></li>
              <li>Metrics: <code className="text-emerald-400">Helmets_Detected</code>, <code className="text-red-400">Violations_Detected</code>, <code className="text-blue-400">Compliance_%</code></li>
              <li>Performance: <code className="text-slate-400">Inference_Time_ms</code>, <code className="text-slate-400">Model_Name</code></li>
              <li>Immediate import for automated challan billing software</li>
            </ul>
            <button
              onClick={() => handleDownload('csv')}
              className="mt-4 w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white text-xs font-semibold transition"
            >
              Export CSV Now
            </button>
          </div>
        </div>
      </div>

      {/* Generated Reports Table */}
      <div className="bg-police-card border border-police-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-police-border flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Calendar size={16} className="text-blue-400" />
            Recent Enforcement Logs Ready for Export
          </h3>
          <button
            onClick={loadData}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-police-card-subtle text-slate-400 uppercase tracking-wider border-b border-police-border">
              <tr>
                <th className="py-3 px-4">Incident</th>
                <th className="py-3 px-4">Filename</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Helmets</th>
                <th className="py-3 px-4 text-center">Violations</th>
                <th className="py-3 px-4 text-center">Action Required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-police-border text-slate-300">
              {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-blue-400 font-semibold">#{item.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200 max-w-[200px] truncate">{item.filename}</td>
                    <td className="py-3 px-4 text-slate-400">{item.timestamp}</td>
                    <td className="py-3 px-4 text-center text-emerald-400 font-semibold">{item.helmets_count || 0}</td>
                    <td className="py-3 px-4 text-center text-red-400 font-semibold">{item.violations_count || 0}</td>
                    <td className="py-3 px-4 text-center">
                      {(item.violations_count || 0) > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/40 text-red-400 border border-red-800/30">
                          <AlertTriangle size={10} />
                          Issue Challan
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/30">
                          <CheckCircle2 size={10} />
                          Approved
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No surveillance incidents logged yet. Upload an image in the Detect tab to generate records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
