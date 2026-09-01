import React, { useState } from 'react';
import { X, Scale, CheckCircle2, AlertTriangle, IndianRupee, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function WeighmentModal({ booking, onClose, onSuccess }) {
  if (!booking) return null;

  const [actualQuantity, setActualQuantity] = useState(booking.expected_quantity || booking.expectedQuantity || 40);
  const [qualityGrade, setQualityGrade] = useState('Grade A');
  const [moisture, setMoisture] = useState(11.8);
  const [procurementStatus, setProcurementStatus] = useState('accepted');
  const [rejectionReason, setRejectionReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const msp = booking.msp_per_quintal || booking.msp || 2425.00;
  const calculatedPayout = procurementStatus === 'accepted' ? (parseFloat(actualQuantity || 0) * msp) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/procurement/verify', {
        bookingId: booking.id || booking.bookingId,
        actualQuantity: parseFloat(actualQuantity),
        qualityGrade,
        moisturePercentage: parseFloat(moisture),
        procurementStatus,
        rejectionReason: procurementStatus === 'rejected' ? rejectionReason : ''
      });

      if (res.data.success) {
        onSuccess(res.data.procurement);
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit procurement record');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Inspection & Weighment Desk</span>
          </div>
          <h2 className="text-xl font-bold">Physical Crop Verification</h2>
          <p className="text-xs text-amber-100/90">
            Token #{booking.token_number || booking.tokenNumber} • {booking.farmer_name || booking.farmerName} ({booking.farmer_code || booking.farmerCode || 'FARM1001'})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Crop Info Summary Card */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500 block">Declared Crop:</span>
              <span className="font-bold text-slate-800 text-sm">{booking.crop_name || booking.cropName}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Official MSP Rate:</span>
              <span className="font-bold text-emerald-700 text-sm">₹{msp}/Quintal</span>
            </div>
          </div>

          {/* Actual Weight Input */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1 text-xs">
              Physical Weighbridge Reading (Quintals) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                required
                value={actualQuantity}
                onChange={(e) => setActualQuantity(e.target.value)}
                className="w-full pl-3.5 pr-16 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-sm font-semibold text-slate-900 outline-none"
                placeholder="e.g. 39.5"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-bold">QTL</span>
            </div>
          </div>

          {/* Quality Grade & Moisture Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-800 mb-1 text-xs">
                Quality Grade
              </label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs font-medium text-slate-800 outline-none bg-white"
              >
                <option value="Grade A">Grade A (Premium / Clean)</option>
                <option value="Grade B">Grade B (Standard Market)</option>
                <option value="Fair Average">FAQ (Fair Average Quality)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1 text-xs">
                Moisture Content (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="5"
                max="25"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs font-semibold text-slate-900 outline-none"
              />
              <span className={`text-[10px] block mt-0.5 ${moisture <= 12 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-bold'}`}>
                {moisture <= 12 ? '✓ Within permissible limit (≤12%)' : '⚠ Moisture high (>12%)'}
              </span>
            </div>
          </div>

          {/* Verification Decision */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1 text-xs">
              Inspection Decision
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProcurementStatus('accepted')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
                  procurementStatus === 'accepted'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept & Procure</span>
              </button>

              <button
                type="button"
                onClick={() => setProcurementStatus('rejected')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 border ${
                  procurementStatus === 'rejected'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Reject Consignment</span>
              </button>
            </div>
          </div>

          {/* Rejection Reason if Rejected */}
          {procurementStatus === 'rejected' && (
            <div>
              <label className="block font-semibold text-rose-700 mb-1 text-xs">
                Rejection Reason *
              </label>
              <textarea
                rows={2}
                required
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xs text-slate-900 outline-none"
                placeholder="e.g. Moisture level exceeded 14.5% or excessive foreign matter found."
              />
            </div>
          )}

          {/* Payout Calculation Card */}
          {procurementStatus === 'accepted' && (
            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100/80 rounded-xl p-4 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-emerald-800 text-[11px] font-semibold block">Calculated MSP Payout:</span>
                <span className="text-xs text-slate-600">
                  {actualQuantity || 0} Qtl × ₹{msp}/Qtl
                </span>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-900 font-mono">
                  ₹{calculatedPayout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <span className="block text-[10px] text-emerald-700 font-medium">Auto-initiates DBT</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs text-white transition shadow-sm flex items-center justify-center space-x-2 ${
                procurementStatus === 'accepted'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-rose-600 hover:bg-rose-700'
              } disabled:opacity-50`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{submitting ? 'Processing...' : procurementStatus === 'accepted' ? 'Confirm Procurement & Pay' : 'Confirm Rejection'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
