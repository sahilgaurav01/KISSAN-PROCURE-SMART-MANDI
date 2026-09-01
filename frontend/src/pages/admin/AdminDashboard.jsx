import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { 
  Building2, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Scale, 
  IndianRupee, 
  TrendingUp, 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  RefreshCw,
  Zap
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [overview, setOverview] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disbursingId, setDisbursingId] = useState(null);
  const [successToast, setSuccessToast] = useState('');

  const fetchAdminData = async () => {
    try {
      const [overviewRes, paymentsRes] = await Promise.all([
        api.get('/admin/analytics/overview'),
        api.get('/payments/all?status=processing')
      ]);

      if (overviewRes.data.success) {
        setOverview(overviewRes.data);
      }
      if (paymentsRes.data.success) {
        setPayments(paymentsRes.data.payments);
      }
    } catch (err) {
      console.error('Failed to load admin analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDisburse = async (paymentId, amount) => {
    setDisbursingId(paymentId);
    try {
      const res = await api.patch(`/payments/${paymentId}/disburse`);
      if (res.data.success) {
        setSuccessToast(`✓ ₹${amount.toLocaleString('en-IN')} disbursed successfully via DBT.`);
        fetchAdminData();
        setTimeout(() => setSuccessToast(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to disburse payment.');
    } finally {
      setDisbursingId(null);
    }
  };

  const kpis = overview?.kpis || {
    totalFarmers: 12450,
    todayBookings: 840,
    servedToday: 710,
    waitingFarmers: 130,
    totalProcuredQuintals: 8420.5,
    totalPaidFormatted: '₹2.04 Cr',
  };

  const dailyTrends = overview?.dailyTrends || [];
  const cropDistribution = overview?.cropDistribution || [
    { name: 'Wheat', value: 62, color: '#16a34a' },
    { name: 'Paddy', value: 24, color: '#eab308' },
    { name: 'Mustard', value: 8, color: '#f97316' },
    { name: 'Gram', value: 6, color: '#8b5cf6' }
  ];
  const centrePerformance = overview?.centrePerformance || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>State Directorate of Agricultural Procurement & Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Government Oversight & DBT Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time state monitoring of mandi queues, procurement volumes, and MSP disbursements.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-2 self-start sm:self-center transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync State Data</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold text-xs shadow-md animate-bounce-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono">Direct Benefit Transfer (DBT)</span>
        </div>
      )}

      {/* 6 Specification Macro KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Farmers</span>
          <div className="text-2xl font-black font-mono text-slate-900 mt-2">
            {kpis.totalFarmers.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Registered in State</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Today's Bookings</span>
          <div className="text-2xl font-black font-mono text-blue-700 mt-2">
            {kpis.todayBookings}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Scheduled across centres</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Farmers Served</span>
          <div className="text-2xl font-black font-mono text-emerald-700 mt-2">
            {kpis.servedToday}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Weighed & Verified</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Waiting in Queue</span>
          <div className="text-2xl font-black font-mono text-amber-600 mt-2">
            {kpis.waitingFarmers}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">In live queue</span>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Procurement</span>
          <div className="text-2xl font-black font-mono text-emerald-800 mt-2">
            {kpis.totalProcuredQuintals}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Total Quintals</span>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-4 shadow-sm border border-slate-800">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">MSP Payments</span>
          <div className="text-2xl font-black font-mono text-white mt-2">
            {kpis.totalPaidFormatted}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">Disbursed via DBT</span>
        </div>
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Daily Procurement Trend (Area Chart) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Throughput Analysis</span>
              <h3 className="font-bold text-slate-900 text-base">Daily Procurement Trend (Last 7 Days)</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Quintals Procured
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyTrends}>
                <defs>
                  <linearGradient id="procureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  formatter={(value) => [`${value} Quintals`, 'Procured Volume']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="quintals" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#procureGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution Donut Chart */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Crop Share</span>
            <h3 className="font-bold text-slate-900 text-base">Procurement by Commodity</h3>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Volume Share']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
            {cropDistribution.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Procurement Centres Live Status Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Regional Procurement Centres Performance</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Centre Name</th>
                <th className="pb-3">District</th>
                <th className="pb-3">Active Serving Token</th>
                <th className="pb-3">Farmers Served</th>
                <th className="pb-3">Waiting in Queue</th>
                <th className="pb-3">Procured Volume</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {centrePerformance.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{c.name} ({c.code})</td>
                  <td className="py-3 text-slate-600">{c.district}</td>
                  <td className="py-3 font-mono font-bold text-amber-600">#{c.current_token}</td>
                  <td className="py-3 text-slate-800 font-mono">{c.served_today} Farmers</td>
                  <td className="py-3 text-amber-700 font-mono">{c.waiting_today} Pending</td>
                  <td className="py-3 font-bold text-emerald-800 font-mono">{c.total_quintals} Qtl</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ● OPERATIONAL
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Benefit Transfer (DBT) Payment Approval Desk */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Treasury Action Desk</span>
            <h3 className="font-bold text-slate-900 text-base">Direct Benefit Transfer (DBT) Disbursements ({payments.length} Pending)</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Txn Ref #</th>
                <th className="pb-3">Farmer Name</th>
                <th className="pb-3">Bank Account</th>
                <th className="pb-3">Crop & Weighed Qty</th>
                <th className="pb-3">MSP Amount</th>
                <th className="pb-3 text-right">Disburse Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-6 text-center text-slate-400">
                    All verified procurements have been disbursed. No pending clearance.
                  </td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-slate-900">{p.transaction_id}</td>
                    <td className="py-3 text-slate-900 font-bold">{p.farmer_name} ({p.farmer_code})</td>
                    <td className="py-3 text-slate-600 font-mono">{p.bank_account_masked} ({p.ifsc_code})</td>
                    <td className="py-3 text-slate-800">{p.crop_name} • {p.actual_quantity} Qtl</td>
                    <td className="py-3 font-mono font-black text-emerald-700 text-sm">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDisburse(p.id, p.amount)}
                        disabled={disbursingId === p.id}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50 inline-flex items-center space-x-1.5"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>{disbursingId === p.id ? 'Disbursing...' : 'Disburse (DBT)'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
