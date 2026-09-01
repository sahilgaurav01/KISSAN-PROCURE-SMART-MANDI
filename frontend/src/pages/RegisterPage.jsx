import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Sprout, User, Phone, MapPin, CreditCard, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegisterPage({ setActiveTab }) {
  const { register, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: '',
    district: 'Muzaffarpur',
    state: 'Bihar',
    landAcres: '5.0',
    aadhaar: '4589',
    bankAccount: '1234',
    ifsc: 'SBIN0001234',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await register(formData);
    if (res.success) {
      setActiveTab('dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-slate-50 py-10">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-500/20 mb-3">
            <Sprout className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Farmer Registration</h2>
          <p className="text-xs text-slate-500 mt-1">Enroll in Government Minimum Support Price (MSP) Procurement</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Village *</label>
                <input
                  type="text"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="e.g. Minapur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">District *</label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  placeholder="e.g. Muzaffarpur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Land Holding (Acres)</label>
                <input
                  type="number"
                  step="0.5"
                  name="landAcres"
                  value={formData.landAcres}
                  onChange={handleChange}
                  placeholder="e.g. 5.0"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aadhaar Last 4 Digits</label>
                <input
                  type="text"
                  maxLength="4"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleChange}
                  placeholder="e.g. 4589"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank Account Last 4 Digits</label>
                <input
                  type="text"
                  maxLength="4"
                  name="bankAccount"
                  value={formData.bankAccount}
                  onChange={handleChange}
                  placeholder="e.g. 1234"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bank IFSC Code</label>
                <input
                  type="text"
                  name="ifsc"
                  value={formData.ifsc}
                  onChange={handleChange}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs uppercase font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Create Password / Security PIN *</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 outline-none text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Profile...' : 'Complete Farmer Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('login')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Already registered? Sign In here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
