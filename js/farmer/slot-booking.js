/**
 * =========================================================
 * FARMER: SLOT BOOKING WIZARD (js/farmer/slot-booking.js)
 * AI Smart Recommendation Heuristic, Capacity Checks & Confetti
 * =========================================================
 */

import { supabase } from '../supabase/client.js';
import { triggerConfetti } from '../utils/helpers.js';
import { openModal, closeModal } from '../components/modal.js';

let bookingState = {
  crop: null,
  qty: 40,
  centre: null,
  date: new Date().toISOString().split('T')[0],
  slotTime: '10:00 - 11:00 AM'
};

export function initSlotBookingWizard() {
  const db = supabase.getLocalDb();
  if (!bookingState.crop) bookingState.crop = db.crops[0];
  if (!bookingState.centre) bookingState.centre = db.centres[0];
}

export function renderBookSlotWizard() {
  initSlotBookingWizard();
  const db = supabase.getLocalDb();

  // 1. Crops Selector
  const cropCont = document.getElementById('booking-crops-container');
  if (cropCont) {
    cropCont.innerHTML = '';
    db.crops.forEach(c => {
      const isSelected = bookingState.crop?.id === c.id;
      const div = document.createElement('div');
      div.className = `p-3 rounded-2xl border text-left transition cursor-pointer relative ${
        isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`;
      div.onclick = () => {
        bookingState.crop = c;
        renderBookSlotWizard();
      };
      div.innerHTML = `
        <div class="font-bold text-slate-800 text-xs">${c.name}</div>
        <div class="text-[10px] text-emerald-700 font-semibold mt-1">MSP: ₹${c.msp}/Qtl</div>
      `;
      cropCont.appendChild(div);
    });
  }

  // 2. Centres Selector
  const centreCont = document.getElementById('booking-centres-container');
  if (centreCont) {
    centreCont.innerHTML = '';
    db.centres.forEach(centre => {
      const isSelected = bookingState.centre?.id === centre.id;
      const div = document.createElement('div');
      div.className = `p-3.5 rounded-2xl border text-left transition cursor-pointer ${
        isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`;
      div.onclick = () => {
        bookingState.centre = centre;
        renderBookSlotWizard();
      };
      div.innerHTML = `
        <div class="font-bold text-slate-900 text-xs">${centre.name}</div>
        <div class="text-[10px] text-slate-500 mt-0.5">${centre.district} • Active Token #${db.currentServingToken}</div>
      `;
      centreCont.appendChild(div);
    });
  }

  // 3. Slots Selector
  const slotCont = document.getElementById('booking-slots-container');
  if (slotCont) {
    slotCont.innerHTML = '';
    const slotsList = [
      { time: '09:00 - 10:00 AM', available: 3, full: false },
      { time: '10:00 - 11:00 AM', available: 6, full: false },
      { time: '11:00 - 12:00 PM', available: 14, full: false, rec: true },
      { time: '12:00 - 01:00 PM', available: 11, full: false },
      { time: '02:00 - 03:00 PM', available: 18, full: false }
    ];

    slotsList.forEach(s => {
      const isSelected = bookingState.slotTime === s.time;
      const div = document.createElement('div');
      div.className = `p-3 rounded-2xl border text-left transition cursor-pointer relative ${
        isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`;
      div.onclick = () => {
        bookingState.slotTime = s.time;
        renderBookSlotWizard();
      };
      div.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-bold text-slate-900 text-xs">${s.time}</span>
          <span class="text-[10px] text-emerald-700 font-semibold">${s.available} left</span>
        </div>
        ${s.rec ? '<span class="inline-block mt-1 text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold">Fastest Turnaround</span>' : ''}
      `;
      slotCont.appendChild(div);
    });
  }

  // Summary box
  const summaryCrop = document.getElementById('summary-crop');
  const summaryQty = document.getElementById('summary-qty');
  const summaryMsp = document.getElementById('summary-msp');
  const summaryPayout = document.getElementById('summary-payout');

  if (summaryCrop) summaryCrop.textContent = bookingState.crop.name;
  if (summaryQty) summaryQty.textContent = `${bookingState.qty} Quintals`;
  if (summaryMsp) summaryMsp.textContent = `₹${bookingState.crop.msp}/Qtl`;
  if (summaryPayout) {
    const payout = bookingState.qty * bookingState.crop.msp;
    summaryPayout.textContent = `₹${payout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }
}

export function updateBookingQuantity(val) {
  bookingState.qty = parseFloat(val);
  const display = document.getElementById('book-qty-display');
  if (display) display.textContent = `${val} Qtl`;
  renderBookSlotWizard();
}

export function confirmSlotBooking(recommendedSlot) {
  if (recommendedSlot) bookingState.slotTime = recommendedSlot;
  const db = supabase.getLocalDb();

  const maxToken = db.bookings.reduce((max, b) => Math.max(max, b.tokenNumber), 24);
  const nextToken = maxToken + 1;
  const bookingNum = `BK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  const newBooking = {
    id: Date.now(),
    bookingNumber: bookingNum,
    tokenNumber: nextToken,
    farmerName: 'Ramesh Kumar',
    farmerId: 'FARM1001',
    phone: '9876543210',
    village: 'Minapur',
    crop: bookingState.crop.name,
    msp: bookingState.crop.msp,
    expectedQty: bookingState.qty,
    status: 'booked',
    date: 'Today',
    slotTime: bookingState.slotTime,
    centreId: bookingState.centre.id
  };

  db.bookings.push(newBooking);
  db.notifications.unshift({
    id: Date.now(),
    title: 'Slot Confirmed!',
    message: `Your booking (${bookingNum}) for ${bookingState.qty} Qtl of ${bookingState.crop.name} is confirmed. Token #${nextToken}.`,
    time: 'Just now',
    type: 'success',
    read: false
  });
  supabase.saveLocalDb(db);

  triggerConfetti();
  openPassModal(bookingNum);
}

export function openPassModal(bookingNumber) {
  const db = supabase.getLocalDb();
  const booking = db.bookings.find(b => b.bookingNumber === bookingNumber) || db.bookings[db.bookings.length - 2];
  if (!booking) return;

  const tNum = document.getElementById('pass-token-num');
  const bId = document.getElementById('pass-booking-id');
  const fName = document.getElementById('pass-farmer-name');
  const cName = document.getElementById('pass-crop-name');
  const msp = document.getElementById('pass-msp-rate');

  if (tNum) tNum.textContent = `#${booking.tokenNumber}`;
  if (bId) bId.textContent = booking.bookingNumber;
  if (fName) fName.textContent = `${booking.farmerName} (${booking.farmerId})`;
  if (cName) cName.textContent = `${booking.crop} (${booking.expectedQty} Quintals)`;
  if (msp) msp.textContent = `₹${booking.msp} / Quintal`;

  openModal('modal-digital-pass');
}

export function closePassModal() {
  closeModal('modal-digital-pass');
}
