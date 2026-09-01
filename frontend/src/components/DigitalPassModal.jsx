import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, QrCode, MapPin, Calendar, Clock, Sparkles } from 'lucide-react';

export default function DigitalPassModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        {/* Pass Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ministry of Agriculture & Farmers Welfare</span>
          </div>
          <h2 className="text-xl font-bold">Kisan Digital Entry Pass</h2>
          <p className="text-xs text-emerald-100/80">Authorized Procurement Token Slip</p>
        </div>

        {/* Token Big Badge */}
        <div className="px-6 pt-5 text-center">
          <div className="inline-block bg-emerald-50 border-2 border-emerald-500 rounded-2xl px-6 py-3 shadow-inner">
            <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider block">Token Number</span>
            <span className="text-4xl font-extrabold text-emerald-900 font-mono tracking-tight">#{booking.token_number || booking.tokenNumber}</span>
          </div>
          <div className="mt-2 text-xs font-mono text-slate-500">
            Booking ID: <span className="font-semibold text-slate-700">{booking.booking_number || booking.bookingNumber}</span>
          </div>
        </div>

        {/* Pass Details */}
        <div className="p-6 space-y-3.5 text-xs">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 space-y-2">
            <div className="flex items-start justify-between">
              <span className="text-slate-500">Procurement Centre:</span>
              <span className="font-semibold text-slate-800 text-right max-w-[200px]">
                {booking.centre_name || booking.centreName}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Scheduled Date:</span>
              <span className="font-semibold text-slate-800">
                {booking.booking_date || booking.bookingDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Time Slot:</span>
              <span className="font-semibold text-slate-800">
                {booking.start_time ? `${booking.start_time.slice(0,5)} - ${booking.end_time?.slice(0,5)}` : booking.slotTime || '10:00 - 11:00 AM'}
              </span>
            </div>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3.5 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">Declared Crop:</span>
              <span className="font-bold text-emerald-950">{booking.crop_name || booking.cropName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">Expected Quantity:</span>
              <span className="font-bold text-emerald-950">
                {booking.expected_quantity || booking.expectedQuantity} Quintals
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-emerald-800 font-medium">MSP Rate:</span>
              <span className="font-bold text-emerald-950">
                ₹{booking.msp_per_quintal || booking.msp || 2425}/Quintal
              </span>
            </div>
          </div>

          {/* QR Code Simulation */}
          <div className="border border-dashed border-slate-300 rounded-xl p-3 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div>
                <div className="font-bold text-slate-800 text-xs">Scan at Mandi Gate</div>
                <div className="text-[10px] text-slate-500">Instant digital verification & weighing desk check-in</div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex space-x-3">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Pass</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
