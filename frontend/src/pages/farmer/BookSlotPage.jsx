import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';
import DigitalPassModal from '../../components/DigitalPassModal';
import { 
  Sprout, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  Scale, 
  Check 
} from 'lucide-react';

export default function BookSlotPage({ setActiveTab }) {
  const { user } = useAuth();
  const { lang, t } = useLanguage();

  const [crops, setCrops] = useState([]);
  const [centres, setCentres] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [expectedQuantity, setExpectedQuantity] = useState(40);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState([]);
  const [recommendedSlot, setRecommendedSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fetch initial master data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cropsRes, centresRes] = await Promise.all([
          api.get('/centres/crops'),
          api.get('/centres')
        ]);
        if (cropsRes.data.success) {
          setCrops(cropsRes.data.crops);
          setSelectedCrop(cropsRes.data.crops[0]);
        }
        if (centresRes.data.success) {
          setCentres(centresRes.data.centres);
          setSelectedCentre(centresRes.data.centres[0]);
        }
      } catch (err) {
        console.error('Failed to load initial booking data', err);
      }
    };
    fetchData();
  }, []);

  // Fetch slots and smart recommendation whenever centre or date changes
  useEffect(() => {
    if (!selectedCentre) return;

    const fetchSlotsAndRecommendation = async () => {
      setLoadingSlots(true);
      try {
        const [slotsRes, recRes] = await Promise.all([
          api.get(`/centres/${selectedCentre.id}/slots?date=${selectedDate}`),
          api.get(`/centres/recommend-slot?centreId=${selectedCentre.id}&date=${selectedDate}&quantity=${expectedQuantity}`)
        ]);

        if (slotsRes.data.success) {
          setSlots(slotsRes.data.slots);
          if (slotsRes.data.slots.length > 0) {
            setSelectedSlot(slotsRes.data.slots[0]);
          }
        }

        if (recRes.data.success && recRes.data.recommendedSlot) {
          setRecommendedSlot(recRes.data.recommendedSlot);
        }
      } catch (err) {
        console.error('Failed to fetch slot details', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlotsAndRecommendation();
  }, [selectedCentre, selectedDate, expectedQuantity]);

  const handleBookSlot = async (slotToBook) => {
    const targetSlot = slotToBook || selectedSlot;
    if (!targetSlot || !selectedCrop || !selectedCentre) {
      alert('Please fill all required booking parameters.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/bookings', {
        centreId: selectedCentre.id,
        slotId: targetSlot.id,
        cropId: selectedCrop.id,
        expectedQuantity: parseFloat(expectedQuantity),
        date: selectedDate
      });

      if (res.data.success) {
        setConfirmedBooking(res.data.booking);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete booking');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-4 h-4" />
          <span>Procurement Slot Reservation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Book Procurement Slot
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Select crop, quantity, preferred mandi centre, and receive your guaranteed token number.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Crop & Quantity */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-bold text-slate-900 text-sm">Select Crop & Quantity</h3>
            </div>

            {/* Crop Picker */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {crops.map((crop) => (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-3 rounded-2xl border text-left transition relative ${
                    selectedCrop?.id === crop.id
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {selectedCrop?.id === crop.id && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  )}
                  <div className="font-bold text-slate-800 text-xs">{crop.name}</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-1">MSP: ₹{crop.msp_per_quintal}/Qtl</div>
                </button>
              ))}
            </div>

            {/* Quantity Slider / Input */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Crop Quantity to Sell (Quintals) *
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={expectedQuantity}
                  onChange={(e) => setExpectedQuantity(e.target.value)}
                  className="flex-1 accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="w-24 px-3 py-2 rounded-xl bg-slate-100 border border-slate-300 font-mono font-bold text-sm text-center text-slate-800">
                  {expectedQuantity} Qtl
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Centre Selection */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-bold text-slate-900 text-sm">Select Procurement Centre</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {centres.map((centre) => (
                <button
                  key={centre.id}
                  type="button"
                  onClick={() => setSelectedCentre(centre)}
                  className={`p-3.5 rounded-2xl border text-left transition relative ${
                    selectedCentre?.id === centre.id
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{centre.name}</div>
                      <div className="text-[10px] text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{centre.district}, {centre.state}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {centre.code}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-slate-600 flex items-center justify-between">
                    <span>Active Token: #{centre.live_serving_token || 18}</span>
                    <span className="text-emerald-700 font-semibold">{centre.waiting_farmers_count || 5} waiting</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Date & Slots */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">3</span>
                <h3 className="font-bold text-slate-900 text-sm">Select Date & Time Slot</h3>
              </div>

              {/* Date Picker */}
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500"
              />
            </div>

            {/* Smart Recommendation Banner */}
            {recommendedSlot && (
              <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Smart Slot Recommendation</span>
                  </div>
                  <div className="text-base font-bold mt-1">
                    {recommendedSlot.start_time?.slice(0,5)} - {recommendedSlot.end_time?.slice(0,5)} Window
                  </div>
                  <div className="text-xs text-emerald-100/90 mt-0.5">
                    {recommendedSlot.reason} (~{recommendedSlot.expectedWaitMinutes} min wait)
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleBookSlot(recommendedSlot)}
                  disabled={bookingLoading}
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition shadow-sm self-start sm:self-center disabled:opacity-50 whitespace-nowrap"
                >
                  ⚡ Book Recommended
                </button>
              </div>
            )}

            {/* Slot Options Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.isFull}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 rounded-2xl border text-left transition relative ${
                      slot.isFull
                        ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {slot.start_time.slice(0,5)} - {slot.end_time.slice(0,5)}
                      </span>
                      {slot.isFull ? (
                        <span className="text-[10px] font-bold text-rose-600">FULL</span>
                      ) : (
                        <span className="text-[10px] text-emerald-700 font-semibold">{slot.availableCount} left</span>
                      )}
                    </div>
                    <div className="mt-2 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${slot.occupancyRate > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                        style={{ width: `${slot.occupancyRate}%` }}
                      ></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Summary & Confirm */}
        <div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5 sticky top-24">
            <h3 className="font-bold text-slate-900 text-base">Booking Summary</h3>

            <div className="space-y-3 text-xs border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Farmer:</span>
                <span className="font-semibold text-slate-800">{user?.name || 'Ramesh Kumar'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Crop:</span>
                <span className="font-semibold text-slate-800">{selectedCrop?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-semibold text-emerald-700 font-bold">{expectedQuantity} Quintals</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MSP Benchmark:</span>
                <span className="font-semibold text-slate-800">₹{selectedCrop?.msp_per_quintal}/Qtl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Centre:</span>
                <span className="font-semibold text-slate-800 text-right max-w-[150px]">{selectedCentre?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date & Slot:</span>
                <span className="font-semibold text-slate-800">
                  {selectedDate} ({selectedSlot?.start_time?.slice(0,5) || '10:00'})
                </span>
              </div>
            </div>

            {/* Estimated Total Value */}
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold uppercase block">Est. Payout Value</span>
                <span className="text-lg font-extrabold text-emerald-950 font-mono">
                  ₹{((parseFloat(expectedQuantity) || 0) * (selectedCrop?.msp_per_quintal || 2425)).toLocaleString('en-IN')}
                </span>
              </div>
              <Scale className="w-6 h-6 text-emerald-600" />
            </div>

            <button
              type="button"
              disabled={bookingLoading || !selectedSlot}
              onClick={() => handleBookSlot(selectedSlot)}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{bookingLoading ? 'Reserving Token...' : 'Confirm & Generate Token Pass'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmedBooking && (
        <DigitalPassModal
          booking={confirmedBooking}
          onClose={() => {
            setConfirmedBooking(null);
            setActiveTab('dashboard');
          }}
        />
      )}
    </div>
  );
}
