import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Calendar, 
  Eye, 
  Download, 
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { getHistory, downloadReport } from '../services/api';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all'); // all | violations | compliant
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const data = await getHistory(100, 0);
      setHistory(data.history || []);
    } catch (err) {
      console.error('Failed to load history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const filteredHistory = history.filter((item) => {
    const matchesSearch = 
      (item.filename && item.filename.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.id && item.id.toString().includes(searchTerm));

    if (filterType === 'violations') {
      return matchesSearch && item.violations_count > 0;
    }
    if (filterType === 'compliant') {
      return matchesSearch && item.violations_count === 0 && item.helmets_count > 0;
    }
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage) || 1;
  const paginatedData = filteredHistory.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatDate = (isoStr) => {
    if (!isoStr) return 'N/A';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-police-card border border-police-border rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <HistoryIcon size={20} />
            </span>
            <h1 className="text-xl font-bold text-slate-100">Traffic Surveillance Audit Log</h1>
          </div>
          <p className="text-sm text-slate-400">
            Immutable SQLite record of all processed traffic surveillance frames, compliance evaluations, and safety violations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchHistoryData}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => downloadReport('csv')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={17} />
          <input
            type="text"
            placeholder="Search by image filename or incident ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-police-card border border-police-border text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-2">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter size={14} /> Filter:
          </span>
          <button
            onClick={() => { setFilterType('all'); setPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              filterType === 'all'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-police-card border border-police-border text-slate-400 hover:text-slate-200'
            }`}
          >
            All Logs ({history.length})
          </button>
          <button
            onClick={() => { setFilterType('violations'); setPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              filterType === 'violations'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-police-card border border-police-border text-red-400 hover:bg-red-950/20'
            }`}
          >
            <AlertTriangle size={13} />
            Violations Only
          </button>
          <button
            onClick={() => { setFilterType('compliant'); setPage(1); }}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              filterType === 'compliant'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-police-card border border-police-border text-emerald-400 hover:bg-emerald-950/20'
            }`}
          >
            <ShieldCheck size={13} />
            Compliant Only
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-police-card border border-police-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-police-card-subtle/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-police-border font-semibold">
              <tr>
                <th className="py-3 px-4">Incident ID</th>
                <th className="py-3 px-4">Traffic Frame</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4 text-center">Helmets</th>
                <th className="py-3 px-4 text-center">Violations</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Inference</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-police-border text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-400" />
                    Fetching surveillance records from SQLite database...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <HistoryIcon size={32} className="mx-auto mb-2 text-slate-600" />
                    No detection logs match your query.
                  </td>
                </tr>
              ) : (
                paginatedData.map((record) => {
                  const hasViolation = (record.violations_count || 0) > 0;
                  return (
                    <tr key={record.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono text-xs text-blue-400 font-semibold">
                        #{record.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          {record.annotated_path ? (
                            <img
                              src={record.annotated_path}
                              alt="thumb"
                              className="w-10 h-10 object-cover rounded-lg border border-police-border bg-slate-900"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-police-border flex items-center justify-center text-slate-600">
                              📷
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-200 text-xs truncate max-w-[170px]" title={record.filename}>
                              {record.filename}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {record.model_name || 'YOLOv5s'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {formatDate(record.timestamp)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {record.helmets_count || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            hasViolation
                              ? 'bg-red-500/15 text-red-400 border-red-500/30 animate-pulse'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {record.violations_count || 0}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {hasViolation ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-red-950/50 text-red-400 border border-red-800/40">
                            <AlertTriangle size={11} />
                            VIOLATION
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-800/40">
                            <ShieldCheck size={11} />
                            COMPLIANT
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-400">
                        {record.inference_time_ms ? `${Math.round(record.inference_time_ms)}ms` : '38ms'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedRecord(record)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white transition"
                          title="Inspect Evidence"
                        >
                          <Eye size={15} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-police-card-subtle border-t border-police-border text-xs text-slate-400">
          <div>
            Showing <span className="font-semibold text-slate-200">{filteredHistory.length > 0 ? (page - 1) * itemsPerPage + 1 : 0}</span> to{' '}
            <span className="font-semibold text-slate-200">{Math.min(page * itemsPerPage, filteredHistory.length)}</span> of{' '}
            <span className="font-semibold text-slate-200">{filteredHistory.length}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200 transition"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="px-2 font-mono text-slate-300">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-slate-200 transition"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-police-card border border-police-border rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-police-border mb-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShieldCheck size={20} />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Surveillance Incident #{selectedRecord.id}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedRecord.filename}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Preview */}
            <div className="rounded-xl overflow-hidden bg-slate-950 border border-police-border mb-4">
              {selectedRecord.annotated_path ? (
                <img
                  src={selectedRecord.annotated_path}
                  alt="Annotated traffic inspection"
                  className="w-full max-h-[420px] object-contain mx-auto"
                />
              ) : (
                <div className="py-20 text-center text-slate-500">Preview not available</div>
              )}
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="p-3 rounded-xl bg-slate-900/70 border border-police-border">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">Compliant Helmets</p>
                <p className="text-xl font-bold text-emerald-400">{selectedRecord.helmets_count || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-police-border">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">Safety Violations</p>
                <p className="text-xl font-bold text-red-400">{selectedRecord.violations_count || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-police-border">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">Model Engine</p>
                <p className="text-sm font-semibold text-blue-400">{selectedRecord.model_name || 'YOLOv5s'}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/70 border border-police-border">
                <p className="text-[11px] uppercase tracking-wider text-slate-400 mb-0.5">Inference Latency</p>
                <p className="text-sm font-semibold font-mono text-slate-200">
                  {selectedRecord.inference_time_ms ? `${Math.round(selectedRecord.inference_time_ms)} ms` : '38 ms'}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-police-border">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Close
              </button>
              {selectedRecord.annotated_path && (
                <a
                  href={selectedRecord.annotated_path}
                  download={selectedRecord.filename || 'annotated_frame.jpg'}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download size={14} />
                  Download Annotated Frame
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
