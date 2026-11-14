import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Camera, 
  TrendingUp, 
  FileText, 
  Scan,
  Users,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, PieChart, Pie, Cell 
} from 'recharts';
import StatCard from '../components/StatCard';
import { getStatistics, getHistory } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_processed: 0,
    total_helmets: 0,
    total_violations: 0,
    total_riders: 0,
    compliance_rate: 0,
    daily_trend: [],
    hourly_distribution: []
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, historyData] = await Promise.all([
        getStatistics(),
        getHistory(6, 0)
      ]);
      setStats(statsData);
      setRecentLogs(historyData.history || []);
    } catch (err) {
      console.warn('Dashboard fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Default sample trend data for presentation if database is newly initialized
  const chartData = stats.daily_trend && stats.daily_trend.length > 0 ? stats.daily_trend : [
    { day: 'Mon', compliant: 45, violations: 18 },
    { day: 'Tue', compliant: 52, violations: 14 },
    { day: 'Wed', compliant: 61, violations: 19 },
    { day: 'Thu', compliant: 58, violations: 12 },
    { day: 'Fri', compliant: 74, violations: 22 },
    { day: 'Sat', compliant: 89, violations: 28 },
    { day: 'Sun', compliant: 82, violations: 24 }
  ];

  const pieData = [
    { name: 'Compliant Helmets', value: Math.max(stats.total_helmets, 1), color: '#10B981' },
    { name: 'Violations (No Helmet)', value: Math.max(stats.total_violations, 1), color: '#EF4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#162038] to-[#1E293B] border border-[#1E293B] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2 text-xs text-blue-400 font-semibold tracking-wider uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
            <span>Real-Time Enforcement Monitor</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Traffic Police Helmet Compliance HUD
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Automated image-based detection of compliant motorcycle helmets and non-compliant rider safety violations powered by YOLOv5.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-[#111A33] border border-[#1E293B] text-slate-300 hover:text-white hover:bg-[#1A2548] transition-all"
            title="Refresh Statistics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/detect"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-[0.99]"
          >
            <Scan className="w-4 h-4" />
            <span>Process New Image</span>
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Images Inspected"
          value={stats.total_processed}
          subtitle="Processed roadway snapshots"
          icon={Camera}
          color="blue"
          trend="YOLOv5 Engine"
        />
        <StatCard
          title="Compliant Helmets"
          value={stats.total_helmets}
          subtitle="Certified headgear detected"
          icon={CheckCircle}
          color="green"
          trend="Safety Observed"
        />
        <StatCard
          title="No-Helmet Violations"
          value={stats.total_violations}
          subtitle="Direct safety contraventions"
          icon={AlertTriangle}
          color="red"
          trend="Action Required"
        />
        <StatCard
          title="Compliance Rate"
          value={`${stats.compliance_rate}%`}
          subtitle="Compliant vs total riders"
          icon={ShieldCheck}
          color={stats.compliance_rate >= 70 ? 'green' : 'amber'}
          trend="Safety Index"
        />
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Weekly Traffic Compliance Volume</h3>
              <p className="text-[11px] text-slate-400">Compliant helmets vs violations detected across traffic snapshots</p>
            </div>
            <span className="text-[10px] px-2 py-1 rounded bg-[#111A33] border border-[#1E293B] text-slate-300 font-mono">
              7-Day Activity
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="compliantGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="violationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
                <Area type="monotone" dataKey="compliant" name="Helmets (Compliant)" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#compliantGrad)" />
                <Area type="monotone" dataKey="violations" name="No-Helmet (Violations)" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#violationGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Safety Ratio Pie */}
        <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Overall Compliance Distribution</h3>
            <p className="text-[11px] text-slate-400">Total verified helmet safety proportion</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B132B', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#1E293B] text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span>Compliant Helmets</span>
              </span>
              <span className="font-mono font-bold text-emerald-400">{stats.total_helmets}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span>No-Helmet Violations</span>
              </span>
              <span className="font-mono font-bold text-rose-400">{stats.total_violations}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Recent Incident Detections</h3>
            <p className="text-[11px] text-slate-400">Latest traffic roadway image scans and enforcement outputs</p>
          </div>
          <Link
            to="/history"
            className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-all"
          >
            <span>View Complete Log</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentLogs && recentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111A33] text-slate-400 uppercase text-[10px] font-mono border-y border-[#1E293B]">
                <tr>
                  <th className="py-2.5 px-4">Incident ID</th>
                  <th className="py-2.5 px-4">Image Source</th>
                  <th className="py-2.5 px-4">Helmets</th>
                  <th className="py-2.5 px-4">Violations</th>
                  <th className="py-2.5 px-4">Enforcement Status</th>
                  <th className="py-2.5 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {recentLogs.map((log, i) => (
                  <tr key={i} className="hover:bg-[#111C38]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-400">
                      #{log.id || (1000 + i)}
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">
                      {log.filename || 'traffic_snapshot.jpg'}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {log.helmets_count ?? 0}
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-400 font-bold">
                      {log.violations_count ?? 0}
                    </td>
                    <td className="py-3 px-4">
                      {log.violations_count > 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                          Violation Flagged
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Compliant
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {log.timestamp || 'Just now'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center border border-dashed border-[#1E293B] rounded-xl bg-[#111A33]/30">
            <Camera className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-medium">No Images Processed in Current Session</p>
            <p className="text-xs text-slate-500 mt-1">Upload a traffic snapshot to start detecting helmet compliance.</p>
            <Link
              to="/detect"
              className="inline-flex items-center space-x-2 mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Launch Image Detector</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

