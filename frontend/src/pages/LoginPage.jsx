import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, Phone, Lock, ArrowRight, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

export default function LoginPage({ setActiveTab }) {
  const { login, demoLogin, loading } = useAuth();
  const { lang, t } = useLanguage();

  const [phone, setPhone] = useState('9876543210');
  const [password, setPassword] = useState('farmer123');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(phone, password);
    if (res.success) {
      if (res.user.role === 'farmer') setActiveTab('dashboard');
      else if (res.user.role === 'officer') setActiveTab('officer-desk');
      else setActiveTab('admin-analytics');
    } else {
      setError(res.message);
    }
  };

  const handleQuickDemo = async (role) => {
    setError('');
    const res = await demoLogin(role);
    if (res.success) {
      if (res.user.role === 'farmer') setActiveTab('dashboard');
      else if (res.user.role === 'officer') setActiveTab('officer-desk');
      else setActiveTab('admin-analytics');
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">KisanProcure Sign In</h2>
          <p className="text-xs text-slate-500 mt-1">Access Farmer, Officer Desk, or Admin Portal</p>
        </div>

        {/* Quick Demo Accounts Banner */}
        <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 mb-2.5 flex items-center space-x-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            <span>1-Click Demo Logins for Evaluation</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => handleQuickDemo('farmer')}
              className="p-2 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-300 text-emerald-900 text-xs font-semibold shadow-xs transition"
            >
              <span className="block text-sm mb-0.5">👨‍🌾</span>
              Farmer Ramesh
            </button>
            <button
              onClick={() => handleQuickDemo('officer')}
              className="p-2 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-300 text-amber-900 text-xs font-semibold shadow-xs transition"
            >
              <span className="block text-sm mb-0.5">👮</span>
              Officer Rajesh
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-2 rounded-xl bg-white hover:bg-blue-100/60 border border-blue-300 text-blue-900 text-xs font-semibold shadow-xs transition"
            >
              <span className="block text-sm mb-0.5">🏛️</span>
              Admin Director
            </button>
          </div>
        </div>

        {/* Manual Login Form */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Registered Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-900 outline-none"
                  placeholder="e.g. 9876543210"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password / Security PIN
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 text-xs font-medium text-slate-900 outline-none"
                  placeholder="••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('register')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              New Farmer? Register for Kisan Procurement
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
