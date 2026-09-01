import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { socket, joinCentreRoom } from '../../services/socket';
import DigitalPassModal from '../../components/DigitalPassModal';
import { 
  Sprout, 
  Calendar, 
  Clock, 
  Activity, 
  ArrowRight, 
  FileText, 
  CreditCard, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  QrCode, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

export default function FarmerDashboard({ setActiveTab }) {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [liveToken, setLiveToken] = useState(18);
  const [loading, setLoading] = useState(true);
  const [showPassModal, setShowPassModal] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
        // Find active upcoming booking
        const active = res.data.bookings.find(b => b.status === 'booked' || b.status === 'in_progress' || b.status === 'arrived');
        if (active) {
          setActiveBooking(active);
          setLiveToken(active.live_centre_token || 18);
          joinCentreRoom(active.centre_id);
        } else if (res.data.bookings.length > 0) {
          setActiveBooking(res.data.bookings[0]);
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

  // Listen to live queue updates
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      setLiveToken(data.currentToken);
      fetchBookings();
    };

    socket.on('queue_updated', handleQueueUpdate);
    return () => {
      socket.off('queue_updated', handleQueueUpdate);
    };
  }, []);

  const farmersAhead = activeBooking ? Math.max(0, activeBooking.token_number - liveToken) : 0;
  const estimatedWait = Math.round(farmersAhead * 5.5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sprout className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'en' ? 'Farmer Self-Service Dashboard' : 'किसान स्वयं-सेवा डैशबोर्ड'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t('welcome')}, {user?.name || 'Ramesh Kumar'}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 mt-1">
              Farmer ID: <span className="font-mono font-bold text-white">{user?.farmerId || 'FARM1001'}</span> • {user?.village || 'Minapur'}, {user?.district || 'Muzaffarpur'}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('book-slot')}
              className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('bookSlot')}</span>
            </button>

            <button
              onClick={() => setActiveTab('live-queue')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white font-semibold text-xs border border-emerald-400/40 transition flex items-center space-x-2 backdrop-blur-sm"
            >
              <Activity className="w-4 h-4" />
              <span>{t('liveQueue')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Spotlight Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1 & 2: Active Slot & Live Queue */}
        <div className="lg:col-span-2 space-y-6">
          {activeBooking ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Upcoming Procurement Slot</span>
                  <h2 className="text-lg font-bold text-slate-900 mt-0.5">{activeBooking.centre_name}</h2>
                  <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{activeBooking.centre_address || 'Muzaffarpur Bypass'}</span>
                  </p>
                </div>

                <button
                  onClick={() => setShowPassModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Digital Pass</span>
                </button>
              </div>

              {/* Slot & Token Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Date</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">{activeBooking.booking_date}</span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Time Slot</span>
                  <span className="text-sm font-bold text-slate-800 mt-0.5 block">
                    {activeBooking.start_time ? `${activeBooking.start_time.slice(0,5)} - ${activeBooking.end_time.slice(0,5)}` : '10:00 - 11:00 AM'}
                  </span>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Crop & Qty</span>
                  <span className="text-sm font-bold text-emerald-700 mt-0.5 block">
                    {activeBooking.expected_quantity} Qtl ({activeBooking.crop_name?.split(' ')[0]})
                  </span>
                </div>

                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase block">Your Token</span>
                  <span className="text-2xl font-extrabold text-emerald-900 font-mono mt-0.5 block">
                    #{activeBooking.token_number}
                  </span>
                </div>
              </div>

              {/* Live Queue Tracker Section */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Live Mandi Queue</span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">Desk 1 • Active</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                    <span className="text-xs text-slate-300 block">Current Serving Token</span>
                    <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block">
                      #{liveToken}
                    </span>
                  </div>

                  <div className="bg-white/10 rounded-xl p-3.5 border border-white/10">
                    <span className="text-xs text-slate-300 block">Your Token Number</span>
                    <span className="text-3xl font-extrabold text-emerald-400 font-mono mt-1 block">
                      #{activeBooking.token_number}
                    </span>
                  </div>

                  <div className="col-span-2 sm:col-span-1 bg-emerald-500/20 rounded-xl p-3.5 border border-emerald-400/30 flex flex-col justify-center">
                    <span className="text-xs text-emerald-200 font-semibold block">
                      {farmersAhead === 0 ? 'Your Turn Now!' : `${farmersAhead} Farmers Ahead`}
                    </span>
                    <span className="text-xs text-slate-300 mt-1 block">
                      Est. Wait: <span className="font-bold text-white">~{estimatedWait} mins</span>
                    </span>
                  </div>
                </div>

                {/* Turn Approaching Alert Banner */}
                {farmersAhead > 0 && farmersAhead <= 3 && (
                  <div className="mt-4 p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl flex items-center space-x-2 text-amber-200 text-xs animate-pulse">
                    <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span><strong>Your turn is approaching!</strong> Please proceed to the inspection weighbridge.</span>
                  </div>
                )}

                <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-slate-400">Updates in real-time via WebSockets</span>
                  <button
                    onClick={() => setActiveTab('live-queue')}
                    className="text-xs font-bold text-emerald-300 hover:text-emerald-200 flex items-center space-x-1"
                  >
                    <span>Full Queue Visualizer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Active Slot Bookings</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You do not have any upcoming procurement slots. Book your slot now to secure an organized token.
              </p>
              <button
                onClick={() => setActiveTab('book-slot')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition"
              >
                Book Procurement Slot
              </button>
            </div>
          )}
        </div>

        {/* Right Side Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Menu Cards */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Quick Access Portal</h3>

            <button
              onClick={() => setActiveTab('book-slot')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-xs">Book Slot</div>
                  <div className="text-[10px] text-slate-500">AI recommended low-wait slots</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => setActiveTab('live-queue')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-xs">Live Queue Status</div>
                  <div className="text-[10px] text-slate-500">Real-time token advancement</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => setActiveTab('my-procurements')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-xs">Procurement Status</div>
                  <div className="text-[10px] text-slate-500">Weighment slips & quality logs</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-left transition flex items-center justify-between group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 text-xs">Payment & DBT Status</div>
                  <div className="text-[10px] text-slate-500">Bank credit ledger & transaction IDs</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
            </button>
          </div>

          {/* MSP Rates Widget */}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-3xl p-6 border border-emerald-200">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">Govt. Official Rates (2026)</span>
            <h4 className="font-bold text-slate-900 text-sm mt-0.5">Active MSP Benchmark</h4>

            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
                <span className="text-slate-700 font-medium">Wheat (PBW-343)</span>
                <span className="font-bold text-emerald-900 font-mono">₹2,425 / Qtl</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-emerald-200/60">
                <span className="text-slate-700 font-medium">Paddy (Grade A)</span>
                <span className="font-bold text-emerald-900 font-mono">₹2,320 / Qtl</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-700 font-medium">Mustard / Rapeseed</span>
                <span className="font-bold text-emerald-900 font-mono">₹5,650 / Qtl</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Digital Pass Modal */}
      {showPassModal && activeBooking && (
        <DigitalPassModal
          booking={activeBooking}
          onClose={() => setShowPassModal(false)}
        />
      )}
    </div>
  );
}
