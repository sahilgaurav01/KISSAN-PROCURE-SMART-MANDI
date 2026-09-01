import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { CreditCard, IndianRupee, CheckCircle2, Clock, ArrowUpRight, ShieldCheck, Printer } from 'lucide-react';

export default function PaymentLedgerPage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalReceived: 0, totalProcessing: 0, count: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments/my-payments');
        if (res.data.success) {
          setPayments(res.data.payments);
          setSummary(res.data.summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Direct Benefit Transfer (DBT) Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Procurement Payouts & DBT Status
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Official government transfer records credited directly to registered bank account.
          </p>
        </div>

        <div className="bg-slate-100 rounded-2xl px-4 py-2 text-xs border border-slate-200">
          <span className="text-slate-500 block text-[10px]">Registered Bank:</span>
          <span className="font-bold text-slate-800">{user?.bankAccount || 'SBI-XXXX-4589'} (IFSC: SBIN0001234)</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Total Received</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-3">
            ₹{summary.totalReceived.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-emerald-200/80 mt-1 block">Successfully credited via PFMS/DBT</span>
        </div>

        <div className="bg-gradient-to-br from-amber-700 to-amber-900 text-white rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-200 uppercase tracking-wider">In Processing</span>
            <Clock className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white mt-3">
            ₹{summary.totalProcessing.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[11px] text-amber-100/80 mt-1 block">Under government treasury clearance</span>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Consignments</span>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 mt-3">
            {summary.count} Consignments
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Procured at official MSP rates</span>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Transaction & Payout History</h3>
          <button
            onClick={() => window.print()}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statement</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Crop</th>
                <th className="pb-3">Actual Quantity</th>
                <th className="pb-3">MSP Rate</th>
                <th className="pb-3">Total Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Centre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-slate-400">No payment records found.</td>
                </tr>
              ) : (
                payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 font-mono font-bold text-slate-900">{p.transaction_id}</td>
                    <td className="py-3 text-slate-800">{p.crop_name}</td>
                    <td className="py-3 font-mono text-slate-800">{p.actual_quantity} Qtl</td>
                    <td className="py-3 font-mono text-slate-600">₹{p.msp_rate}/Qtl</td>
                    <td className="py-3 font-mono font-bold text-emerald-700">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {p.status === 'paid' ? '✓ PAID (DBT)' : '⏳ PROCESSING'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{p.centre_name}</td>
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
