import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { socket, joinCentreRoom } from '../../services/socket';
import WeighmentModal from '../../components/WeighmentModal';
import { 
  Activity, 
  Users, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Radio, 
  MapPin, 
  ShieldCheck, 
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const centreId = user?.centreId || 1;
  const [queueData, setQueueData] = useState(null);
  const [callingNext, setCallingNext] = useState(false);
  const [showWeighModal, setShowWeighModal] = useState(false);
  const [selectedBookingForWeigh, setSelectedBookingForWeigh] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const fetchQueue = async () => {
    try {
      const res = await api.get(`/queue/${centreId}`);
      if (res.data.success) {
        setQueueData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQueue();
    joinCentreRoom(centreId);
  }, [centreId]);

  // Listen to live queue updates
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      fetchQueue();
    };

    socket.on('queue_updated', handleUpdate);
    socket.on('booking_added', handleUpdate);
    socket.on('procurement_updated', handleUpdate);

    return () => {
      socket.off('queue_updated', handleUpdate);
      socket.off('booking_added', handleUpdate);
      socket.off('procurement_updated', handleUpdate);
    };
  }, [centreId]);

  const handleCallNext = async (specificToken = null) => {
    setCallingNext(true);
    try {
      const res = await api.post(`/queue/${centreId}/next`, {
        tokenNumber: specificToken
      });
      if (res.data.success) {
        setToastMessage(`📢 Now Serving Token #${res.data.calledToken} (${res.data.activeBooking?.farmer_name})`);
        fetchQueue();
        setTimeout(() => setToastMessage(''), 4000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'No more waiting farmers in the queue.');
    } finally {
      setCallingNext(false);
    }
  };

  const currentToken = queueData?.currentToken || 0;
  const activeBooking = queueData?.activeBooking;
  const waitingList = queueData?.waitingQueue || [];
  const stats = queueData?.stats || { servedFarmers: 45, totalQuintals: 1250, pendingCount: 14 };

  const filteredWaiting = waitingList.filter(
    (item) =>
      item.farmer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.farmer_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.token_number?.toString().includes(searchQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Procurement Centre Live Control Desk</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {queueData?.centre?.name || 'Muzaffarpur Central Mandi (PC-MUZ-01)'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Officer on Duty: <strong className="text-slate-800">{user?.name || 'Rajesh Sharma (Inspector)'}</strong> • Desk #1 Active
          </p>
        </div>

        <button
          onClick={fetchQueue}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-2 self-start sm:self-center transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Desk</span>
        </button>
      </div>

      {/* Success Toast Notification */}
      {toastMessage && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-md animate-bounce-subtle flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-amber-600 animate-ping" />
            <span>{toastMessage}</span>
          </div>
          <span className="text-[10px] text-amber-700 font-mono">Broadcasted via Socket.IO</span>
        </div>
      )}

      {/* Main Grid: Control Desk & Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Real-Time Desk Controller */}
        <div className="lg:col-span-2 space-y-6">
          {/* Big Live Control Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                ACTIVE WEIGHBRIDGE DESK
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
                LIVE QUEUE ENGINE
              </span>
            </div>

            {/* Current Serving & Next in Line */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Current Token Card */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border-2 border-amber-500/40 text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400 block">
                  CURRENT SERVING TOKEN
                </span>
                <div className="text-6xl font-black font-mono text-amber-400 tracking-tight my-2 animate-pulse-fast">
                  #{currentToken}
                </div>
                {activeBooking ? (
                  <div className="text-left bg-slate-900 rounded-xl p-3 border border-slate-700/80 text-xs space-y-1">
                    <div className="font-bold text-white text-sm">{activeBooking.farmerName}</div>
                    <div className="text-slate-400 text-[11px]">
                      ID: <span className="font-mono text-slate-300">{activeBooking.farmerCode}</span> • {activeBooking.village}
                    </div>
                    <div className="text-emerald-400 font-semibold text-xs">
                      {activeBooking.cropName} • {activeBooking.expectedQuantity} Qtl
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-3">Desk Ready for Next Token</div>
                )}
              </div>

              {/* Next Farmer in Queue */}
              <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700 text-center flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 block">
                    NEXT FARMER IN LINE
                  </span>
                  <div className="text-5xl font-black font-mono text-emerald-400 tracking-tight my-2">
                    {waitingList.length > 0 ? `#${waitingList[0].token_number}` : 'None'}
                  </div>
                </div>

                {waitingList.length > 0 ? (
                  <div className="text-left bg-slate-900 rounded-xl p-3 border border-slate-700/80 text-xs space-y-1">
                    <div className="font-bold text-white">{waitingList[0].farmer_name}</div>
                    <div className="text-slate-400 text-[11px]">
                      {waitingList[0].crop_name} • {waitingList[0].expected_quantity} Qtl
                    </div>
                    <div className="text-amber-300 font-semibold text-[10px]">
                      Token scheduled for current slot
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 py-2">No pending farmers</div>
                )}
              </div>
            </div>

            {/* Officer Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                disabled={callingNext || waitingList.length === 0}
                onClick={() => handleCallNext()}
                className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg shadow-amber-500/25 flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                <span>{callingNext ? 'Calling Next...' : '⚡ CALL NEXT FARMER'}</span>
              </button>

              <button
                type="button"
                disabled={!activeBooking}
                onClick={() => {
                  setSelectedBookingForWeigh(activeBooking);
                  setShowWeighModal(true);
                }}
                className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition shadow-lg shadow-emerald-600/25 flex items-center justify-center space-x-2 disabled:opacity-40"
              >
                <Scale className="w-5 h-5" />
                <span>⚖️ WEIGH & VERIFY CROP</span>
              </button>
            </div>
          </div>

          {/* Live Waiting Queue Table */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-bold text-slate-900 text-base">
                Waiting Farmers List ({waitingList.length})
              </h3>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search token or farmer name..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 outline-none focus:border-amber-500 w-full sm:w-60"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3">Token #</th>
                    <th className="pb-3">Farmer</th>
                    <th className="pb-3">Crop</th>
                    <th className="pb-3">Declared Qty</th>
                    <th className="pb-3">Slot Time</th>
                    <th className="pb-3 text-right">Quick Call</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredWaiting.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-slate-400">
                        No farmers waiting in queue for today.
                      </td>
                    </tr>
                  ) : (
                    filteredWaiting.map((item) => {
                      const isRamesh = item.token_number === 23;
                      return (
                        <tr key={item.id} className={isRamesh ? 'bg-amber-50/70 font-bold' : 'hover:bg-slate-50'}>
                          <td className="py-3 font-mono font-bold text-amber-900">
                            #{item.token_number} {isRamesh && <span className="text-[10px] text-amber-700">(Ramesh Kumar)</span>}
                          </td>
                          <td className="py-3 text-slate-900">{item.farmer_name} ({item.farmer_code})</td>
                          <td className="py-3 text-slate-800">{item.crop_name}</td>
                          <td className="py-3 text-slate-800 font-mono">{item.expected_quantity} Qtl</td>
                          <td className="py-3 text-slate-500 font-mono">
                            {item.start_time?.slice(0,5)} - {item.end_time?.slice(0,5)}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => handleCallNext(item.token_number)}
                              className="px-3 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition"
                            >
                              Call Token #{item.token_number}
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Daily Stats Summary */}
        <div className="space-y-6">
          {/* Today's Procurement Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">
              Today's Mandi Summary
            </span>
            <h3 className="font-extrabold text-slate-900 text-lg">Operational Throughput</h3>

            <div className="space-y-3 pt-2">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-xs block">Farmers Served Today</span>
                  <span className="text-2xl font-black text-slate-900 font-mono mt-0.5 block">
                    {stats.servedFarmers}
                  </span>
                </div>
                <Users className="w-7 h-7 text-emerald-600" />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-xs block">Wheat / Grain Procured</span>
                  <span className="text-2xl font-black text-emerald-700 font-mono mt-0.5 block">
                    {stats.totalQuintals} Qtl
                  </span>
                </div>
                <Scale className="w-7 h-7 text-amber-600" />
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 text-xs block">Waiting in Queue</span>
                  <span className="text-2xl font-black text-amber-700 font-mono mt-0.5 block">
                    {waitingList.length}
                  </span>
                </div>
                <Activity className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Quality Standards Reference */}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 rounded-3xl p-6 border border-amber-200 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Inspection Guidelines</span>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Moisture standard: &le; 12.0% (Rejection threshold &gt; 14%)</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Foreign matter: &le; 0.75% max</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Weighbridge tare weight calibration mandatory</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Weighment Modal */}
      {showWeighModal && selectedBookingForWeigh && (
        <WeighmentModal
          booking={selectedBookingForWeigh}
          onClose={() => {
            setShowWeighModal(false);
            setSelectedBookingForWeigh(null);
          }}
          onSuccess={(procResult) => {
            fetchQueue();
            setToastMessage(`✓ Verification complete! ${procResult.actualQuantity} Qtl recorded.`);
            setTimeout(() => setToastMessage(''), 4000);
          }}
        />
      )}
    </div>
  );
}
