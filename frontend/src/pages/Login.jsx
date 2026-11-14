import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, BadgeAlert, UserCheck, KeyRound, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [badge, setBadge] = useState('TP-8492');
  const [name, setName] = useState('Inspector R. Sharma');
  const [password, setPassword] = useState('traffic2026');
  const [isRegistering, setIsRegistering] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(badge, name);
    navigate('/');
  };

  const handleQuickDemoLogin = () => {
    login('TP-8492', 'Inspector R. Sharma');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#080D1A] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Police Grid Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Police Badge Emblem */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-sky-500 p-0.5 shadow-xl shadow-blue-600/20 mb-4">
            <div className="w-full h-full bg-[#0B132B] rounded-2xl flex items-center justify-center text-blue-400">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-wide uppercase">
            Traffic Police Department
          </h1>
          <p className="text-xs text-blue-400 mt-1 font-medium">
            Smart Helmet Compliance & Safety Alert Enforcement Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="p-8 rounded-3xl bg-[#0F172A] border border-[#1E293B] shadow-2xl backdrop-blur-xl">
          <div className="flex border-b border-[#1E293B] mb-6">
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className={`pb-3 text-sm font-semibold flex-1 border-b-2 transition-all ${
                !isRegistering
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Officer Login
            </button>
            <button
              type="button"
              onClick={() => setIsRegistering(true)}
              className={`pb-3 text-sm font-semibold flex-1 border-b-2 transition-all ${
                isRegistering
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Register Officer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Officer Full Name
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sub-Inspector R. Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111A33] border border-[#1E293B] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Badge / Service Number
              </label>
              <div className="relative">
                <BadgeAlert className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="e.g. TP-8492"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111A33] border border-[#1E293B] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Department Access Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#111A33] border border-[#1E293B] text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all active:scale-[0.99]"
            >
              <span>{isRegistering ? 'Register & Enter Dashboard' : 'Authenticate & Enter'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Access for evaluation / viva */}
          <div className="mt-6 pt-5 border-t border-[#1E293B] text-center">
            <p className="text-xs text-slate-400 mb-2.5">Academic Project Viva & Demo Mode</p>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-200 transition-all flex items-center justify-center space-x-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-400" />
              <span>One-Click Inspector Demo Login</span>
            </button>
          </div>
        </div>

        {/* Security Note */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          Official Law Enforcement System • Restricted Access Only
        </p>
      </div>
    </div>
  );
}

