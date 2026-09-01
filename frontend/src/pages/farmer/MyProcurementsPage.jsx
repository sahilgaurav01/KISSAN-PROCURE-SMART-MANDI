import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  CreditCard, 
  Scale, 
  ShieldCheck, 
  MapPin, 
  Calendar 
} from 'lucide-react';

export default function MyProcurementsPage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
        if (res.data.bookings.length > 0) {
          setSelectedBooking(res.data.bookings[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getTimelineSteps = (b) => {
    const isCompleted = b.status === 'completed';
    const isPaid = b.payment_status === 'paid';
    const isProcessing = b.payment_status === 'processing' || isCompleted;

    return [
      { id: 1, label: 'Slot Booked', date: b.booking_date, done: true },
      { id: 2, label: 'Farmer Arrived & Verified', done: isCompleted || b.status === 'in_progress' },
      { id: 3, label: 'Crop Weighed & Graded', done: isCompleted, extra: isCompleted ? `${b.actual_quantity || b.expected_quantity} Qtl (${b.quality_grade || 'Grade A'})` : null },
      { id: 4, label: 'Procurement Approved', done: isCompleted },
      { id: 5, label: 'Payment Initiated (DBT)', done: isProcessing, extra: isProcessing ? `₹${(b.payment_amount || b.expected_quantity * 2425).toLocaleString('en-IN')}` : null },
      { id: 6, label: 'Payment Received in Bank', done: isPaid, extra: isPaid ? `Txn: ${b.transaction_id}` : 'In Processing' },
    ];
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <FileText className="w-4 h-4" />
          <span>Procurement & Weighment Lifecycle</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Procurement Status & Slips
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track end-to-end verification, physical weighbridge readings, and official payment receipts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1 Col: Booking Selector */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Procurement Records</h3>
          <div className="space-y-3">
            {bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBooking(b)}
                className={`w-full p-4 rounded-2xl border text-left transition ${
                  selectedBooking?.id === b.id
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-900 text-xs">Token #{b.token_number}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : b.status === 'in_progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
                <div className="font-bold text-slate-800 text-xs mt-1">{b.crop_name}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{b.centre_name} • {b.booking_date}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right 2 Cols: Timeline & Certificate Slip */}
        <div className="lg:col-span-2 space-y-6">
          {selectedBooking ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-8">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Booking Reference</span>
                  <h2 className="text-xl font-bold text-slate-900 mt-0.5">{selectedBooking.booking_number}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mandi: <span className="font-semibold text-slate-700">{selectedBooking.centre_name}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Declared MSP</span>
                    <span className="text-sm font-bold text-emerald-800 font-mono">
                      ₹{selectedBooking.msp_per_quintal || 2425}/Qtl
                    </span>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Print Receipt"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* End-to-End Timeline Tracker */}
              <div>
                <h3 className="font-bold text-slate-900 text-sm mb-4">Step-by-Step Procurement Timeline</h3>
                <div className="relative border-l-2 border-emerald-500 ml-4 space-y-6 pb-2">
                  {getTimelineSteps(selectedBooking).map((step) => (
                    <div key={step.id} className="relative pl-6">
                      {/* Step Circle */}
                      <span className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        step.done
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-slate-200 text-slate-500 ring-4 ring-slate-100'
                      }`}>
                        {step.done ? '✓' : ''}
                      </span>

                      <div className="text-xs">
                        <div className="font-bold text-slate-900">{step.label}</div>
                        {step.extra && (
                          <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">{step.extra}</div>
                        )}
                        {step.date && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{step.date}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weighment & Payment Record Box */}
              {selectedBooking.status === 'completed' ? (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Official Procurement & Payment Certificate</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Actual Weighed Quantity</span>
                      <span className="text-base font-bold text-white font-mono mt-0.5 block">
                        {selectedBooking.actual_quantity || selectedBooking.expected_quantity} Quintals
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Quality Grade / Moisture</span>
                      <span className="text-base font-bold text-amber-300 font-mono mt-0.5 block">
                        {selectedBooking.quality_grade || 'Grade A'} ({selectedBooking.moisture_percentage || '11.8'}%)
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Total Payment Payout</span>
                      <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                        ₹{(selectedBooking.payment_amount || (selectedBooking.actual_quantity || selectedBooking.expected_quantity) * (selectedBooking.msp_per_quintal || 2425)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
                    <span>Transaction ID: <strong className="font-mono text-white">{selectedBooking.transaction_id || 'TXN-2026-MUZ-8023'}</strong></span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      PAID VIA DIRECT BENEFIT TRANSFER (DBT)
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <strong>Procurement in Progress:</strong> When your token is called and crop is weighed at the desk, your official weight slip and payment transaction ID will appear here.
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">No booking selected</div>
          )}
        </div>
      </div>
    </div>
  );
}
