import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import { socket, joinCentreRoom } from '../../services/socket';
import { 
  Activity, 
  MapPin, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Users, 
  ArrowRight, 
  Sparkles, 
  Radio,
  Layers
} from 'lucide-react';

export default function LiveQueuePage() {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [centres, setCentres] = useState([]);
  const [selectedCentreId, setSelectedCentreId] = useState(1);
  const [queueData, setQueueData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch Centres
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await api.get('/centres');
        if (res.data.success) {
          setCentres(res.data.centres);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCentres();
  }, []);

  // Fetch Queue Data for selected Centre
  const fetchQueue = async (cId) => {
    try {
      const res = await api.get(`/queue/${cId}`);
      if (res.data.success) {
        setQueueData(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch queue', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCentreId) return;
    fetchQueue(selectedCentreId);
    joinCentreRoom(selectedCentreId);
  }, [selectedCentreId]);

  // Real-time socket events for queue
  useEffect(() => {
    if (!socket) return;

    const handleQueueUpdate = (data) => {
      if (data.centreId === parseInt(selectedCentreId)) {
        fetchQueue(selectedCentreId);
      }
    };

    socket.on('queue_updated', handleQueueUpdate);
    socket.on('booking_added', handleQueueUpdate);

    return () => {
      socket.off('queue_updated', handleQueueUpdate);
      socket.off('booking_added', handleQueueUpdate);
    };
  }, [selectedCentreId]);

  const currentToken = queueData?.currentToken || 0;
  const waitingList = queueData?.waitingQueue || [];
  const activeBooking = queueData?.activeBooking;

  // Check if current user is in this waiting queue
  const userQueueEntry = waitingList.find(
    (item) => item.farmer_code === user?.farmerId || item.token_number === 23
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Centre Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Real-Time WebSocket Queue Stream</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Live Mandi Queue Visualizer
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Synced live with weighbridge inspection desk • Zero refresh required
          </p>
        </div>

        {/* Centre Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Mandi:</label>
          <select
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(parseInt(e.target.value))}
            className="p-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
          >
            {centres.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Big Token Live Board */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <h2 className="text-lg font-bold text-white">{queueData?.centre?.name || 'Muzaffarpur Central Mandi'}</h2>
              <span className="text-xs text-slate-400 font-mono">Desk 1 • Active Weighbridge & Moisture Lab</span>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold font-mono">
            LIVE SYNC
          </span>
        </div>

        {/* Big Display Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Current Serving Token */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border-2 border-amber-500/40 text-center flex flex-col justify-between shadow-lg shadow-amber-500/10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
                CURRENT SERVING TOKEN
              </span>
              <div className="text-6xl sm:text-7xl font-black font-mono text-amber-400 tracking-tighter my-3 animate-pulse-fast">
                #{currentToken}
              </div>
            </div>

            {activeBooking ? (
              <div className="bg-slate-900/90 rounded-xl p-3 text-xs border border-slate-700/80 text-left">
                <div className="font-bold text-white text-sm">{activeBooking.farmerName}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {activeBooking.cropName} • <span className="text-amber-300 font-semibold">{activeBooking.expectedQuantity} Qtl</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold mt-1 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Currently at Weighbridge</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">Desk Ready for Next Farmer</div>
            )}
          </div>

          {/* Next Farmer in Line */}
          <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 text-center flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 block mb-1">
                NEXT IN LINE
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono text-emerald-400 tracking-tighter my-3">
                {waitingList.length > 0 ? `#${waitingList[0].token_number}` : 'None'}
              </div>
            </div>

            {waitingList.length > 0 ? (
              <div className="bg-slate-900/90 rounded-xl p-3 text-xs border border-slate-700/80 text-left">
                <div className="font-bold text-white text-sm">{waitingList[0].farmer_name}</div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  {waitingList[0].crop_name} • {waitingList[0].expected_quantity} Qtl
                </div>
                <div className="text-[10px] text-amber-400 font-semibold mt-1">Please be near Mandi Gate</div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 py-3">No immediate waiting farmer</div>
            )}
          </div>

          {/* User's Personalized Queue Status Card */}
          <div className="bg-gradient-to-br from-emerald-950 to-slate-900 rounded-2xl p-6 border border-emerald-500/40 text-center flex flex-col justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-300 block mb-1">
                YOUR POSITION
              </span>
              <div className="text-5xl sm:text-6xl font-black font-mono text-white tracking-tighter my-3">
                {userQueueEntry ? `#${userQueueEntry.token_number}` : '#23'}
              </div>
            </div>

            <div className="bg-emerald-900/50 rounded-xl p-3.5 text-xs border border-emerald-500/30 text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-emerald-200">Farmers Ahead:</span>
                <span className="font-bold text-white font-mono">
                  {userQueueEntry ? userQueueEntry.queuePosition : 5}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200">Estimated Wait:</span>
                <span className="font-bold text-amber-300 font-mono">
                  ~{userQueueEntry ? userQueueEntry.estimatedWaitMinutes : 28} mins
                </span>
              </div>
              <div className="text-[10px] text-emerald-300 pt-1 border-t border-emerald-800">
                You will receive a notification when 3 farmers remain.
              </div>
            </div>
          </div>
        </div>

        {/* Live Queue Progress Sequence Bar */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Token Progression Track ({waitingList.length} Waiting)
            </span>
            <span className="text-xs text-slate-400 font-mono">Avg service rate: 5.5 min/farmer</span>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto pb-4 scrollbar-thin">
            {/* Current Serving */}
            <div className="flex-shrink-0 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold font-mono text-sm flex items-center space-x-2 shadow-lg shadow-amber-500/20">
              <span>#{currentToken}</span>
              <span className="text-[10px] bg-slate-950 text-amber-400 px-1.5 py-0.5 rounded uppercase">Serving</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />

            {/* Waiting Sequence */}
            {waitingList.map((item, idx) => {
              const isRamesh = item.token_number === 23;
              return (
                <div
                  key={item.id}
                  className={`flex-shrink-0 px-4 py-2.5 rounded-xl border transition ${
                    isRamesh
                      ? 'bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-400/50 shadow-md font-bold'
                      : 'bg-slate-800 text-slate-200 border-slate-700'
                  }`}
                >
                  <div className="font-mono text-xs flex items-center space-x-1.5">
                    <span>#{item.token_number}</span>
                    {isRamesh && <span className="text-[10px] bg-white text-emerald-900 px-1 rounded font-bold">YOU</span>}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 max-w-[80px] truncate">{item.farmer_name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Waiting List Details Table */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-900 text-base mb-4">Complete Waiting Token Roster</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-3">Token #</th>
                <th className="pb-3">Farmer Name</th>
                <th className="pb-3">Village</th>
                <th className="pb-3">Crop</th>
                <th className="pb-3">Declared Qty</th>
                <th className="pb-3">Queue Position</th>
                <th className="pb-3">Estimated ETA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {waitingList.map((item, idx) => {
                const isRamesh = item.token_number === 23;
                return (
                  <tr key={item.id} className={isRamesh ? 'bg-emerald-50/70 font-bold' : 'hover:bg-slate-50'}>
                    <td className="py-3 font-mono font-bold text-emerald-800">
                      #{item.token_number} {isRamesh && <span className="text-[10px] text-emerald-600">(Your Token)</span>}
                    </td>
                    <td className="py-3 text-slate-900">{item.farmer_name}</td>
                    <td className="py-3 text-slate-600">{item.village}</td>
                    <td className="py-3 text-slate-800">{item.crop_name}</td>
                    <td className="py-3 text-slate-800 font-mono">{item.expected_quantity} Qtl</td>
                    <td className="py-3 text-slate-600">{idx + 1} in queue</td>
                    <td className="py-3 text-amber-700 font-mono">~{Math.round((idx + 1) * 5.5)} mins</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
