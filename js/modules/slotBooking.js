/**
 * =========================================================
 * MODULE: SMART SLOT BOOKING & TOKEN ISSUANCE (js/modules/slotBooking.js)
 * Implements AI slot recommendation, capacity allocation & confetti
 * =========================================================
 */

import { store } from '../config/state.js';
import { renderNotifications } from './notifications.js';

let bookingFormState = {
  crop: null,
  qty: 40,
  centre: null,
  date: new Date().toISOString().split('T')[0],
  slotTime: '10:00 - 11:00 AM'
};

export function initSlotBookingWizard() {
  const state = store.getState();
  if (!bookingFormState.crop) bookingFormState.crop = state.crops[0];
  if (!bookingFormState.centre) bookingFormState.centre = state.centres[0];
}

export function renderBookSlotWizard() {
  initSlotBookingWizard();
  const state = store.getState();

  // 1. Render Crops
  const cropCont = document.getElementById('booking-crops-container');
  if (cropCont) {
    cropCont.innerHTML = '';
    state.crops.forEach(c => {
      const isSelected = bookingFormState.crop?.id === c.id;
      const div = document.createElement('div');
      div.className = `p-3 rounded-2xl border text-left transition cursor-pointer relative ${
        isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`;
      div.onclick = () => {
        bookingFormState.crop = c;
        renderBookSlotWizard();
      };
      div.innerHTML = `
        <div class="font-bold text-slate-800 text-xs">${c.name}</div>
        <div class="text-[10px] text-emerald-700 font-semibold mt-1">MSP: ₹${c.msp}/Qtl</div>
      `;
      cropCont.appendChild(div);
    });
  }

  // 2. Render Centres
  const centreCont = document.getElementById('booking-centres-container');
  if (centreCont) {
    centreCont.innerHTML = '';
    state.centres.forEach(centre => {
      const isSelected = bookingFormState.centre?.id === centre.id;
      const div = document.createElement('div');
      div.className = `p-3.5 rounded-2xl border text-left transition cursor-pointer ${
        isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`;
      div.onclick = () => {
        bookingFormState.centre = centre;
        renderBookSlotWizard();
      };
      div.innerHTML = `
        <div class="font-bold text-slate-900 text-xs">${centre.name}</div>
        <div class="text-[10px] text-slate-500 mt-0.5">${centre.district} • Serving Token #${state.currentServingToken}</div>
      `;
      centreCont.appendChild(div);
    });
  }

  // 3. Render Slots
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
      const isSelected = bookingFormState.slotTime === s.time;
      const div = document.createElement('div');
      div.className = `p-3 rounded-2xl border text-left transition cursor-pointer relative ${
        isSelected ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300 bg-white'
      }`;
      div.onclick = () => {
        bookingFormState.slotTime = s.time;
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

  // 4. Update Summary Sidebar
  const summaryCropEl = document.getElementById('summary-crop');
  const summaryQtyEl = document.getElementById('summary-qty');
  const summaryMspEl = document.getElementById('summary-msp');
  const summaryPayoutEl = document.getElementById('summary-payout');

  if (summaryCropEl) summaryCropEl.textContent = bookingFormState.crop.name;
  if (summaryQtyEl) summaryQtyEl.textContent = `${bookingFormState.qty} Quintals`;
  if (summaryMspEl) summaryMspEl.textContent = `₹${bookingFormState.crop.msp}/Qtl`;
  if (summaryPayoutEl) {
    const payout = bookingFormState.qty * bookingFormState.crop.msp;
    summaryPayoutEl.textContent = `₹${payout.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  }
}

export function updateBookingQuantity(val) {
  bookingFormState.qty = parseFloat(val);
  const qtyDisplay = document.getElementById('book-qty-display');
  if (qtyDisplay) qtyDisplay.textContent = `${val} Qtl`;
  renderBookSlotWizard();
}

export function confirmSlotBooking(recommendedSlot) {
  if (recommendedSlot) bookingFormState.slotTime = recommendedSlot;
  const state = store.getState();

  const maxToken = state.bookings.reduce((max, b) => Math.max(max, b.tokenNumber), 24);
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
    crop: bookingFormState.crop.name,
    msp: bookingFormState.crop.msp,
    expectedQty: bookingFormState.qty,
    status: 'booked',
    date: 'Today',
    slotTime: bookingFormState.slotTime,
    centreId: bookingFormState.centre.id
  };

  store.update(st => {
    st.bookings.push(newBooking);
    st.notifications.unshift({
      id: Date.now(),
      title: 'Slot Confirmed!',
      message: `Your booking (${bookingNum}) for ${bookingFormState.qty} Qtl of ${bookingFormState.crop.name} is confirmed. Token #${nextToken}.`,
      time: 'Just now',
      type: 'success',
      read: false
    });
  });

  renderNotifications();

  // Launch confetti
  if (window.confetti) {
    window.confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  openPassModal(bookingNum);
}

export function openPassModal(bookingNumber) {
  const state = store.getState();
  const booking = state.bookings.find(b => b.bookingNumber === bookingNumber) || state.bookings[state.bookings.length - 2];
  if (!booking) return;

  document.getElementById('pass-token-num').textContent = `#${booking.tokenNumber}`;
  document.getElementById('pass-booking-id').textContent = booking.bookingNumber;
  document.getElementById('pass-farmer-name').textContent = `${booking.farmerName} (${booking.farmerId})`;
  document.getElementById('pass-crop-name').textContent = `${booking.crop} (${booking.expectedQty} Quintals)`;
  document.getElementById('pass-msp-rate').textContent = `₹${booking.msp} / Quintal`;

  document.getElementById('modal-digital-pass')?.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

export function closePassModal() {
  document.getElementById('modal-digital-pass')?.classList.add('hidden');
}
