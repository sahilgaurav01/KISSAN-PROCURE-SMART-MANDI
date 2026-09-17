# 🌾 KisanProcure (SIH Problem Statement 26032)
### *Smart Mandi Slot Booking, Real-Time Queue Management & Transparent MSP Disbursement System*
#### *Pure HTML5, CSS3, & Vanilla JavaScript Edition*

---

## 📌 Project Overview

**KisanProcure** is an end-to-end Smart Agricultural Procurement & Mandi Queue Management System built for Smart India Hackathon (Problem Statement 26032). It eliminates 6–18 hour physical mandi congestion, prevents distress selling to middlemen, and guarantees direct MSP payouts to farmers.

This lightweight edition runs completely on **HTML5, CSS3, and Vanilla JavaScript** with **zero build tools, zero dependencies, and instant one-click browser execution**.

---

## 🌟 Key Modules & Features

### 1. 👨‍🌾 Farmer Self-Service Portal
- **1-Click Demo Persona**: Instant access as protagonist **Ramesh Kumar (`FARM1001`)** with **Token #23** (40 Quintals of Wheat).
- **Upcoming Slot Spotlight**: Centre address, date, time window, declared crop, and token number.
- **Live Queue Bar**: Real-time display of current serving token (#18), farmers ahead (5), and dynamic ETA counter (~28 mins).
- **Smart Slot Booking Wizard**: 4-step wizard with Crop & Quintal picker, Mandi selector, AI Recommended low-wait slot badge, and instant Digital Pass generation with celebratory confetti!
- **Live Queue Visualizer**: Animated horizontal token progression sequence track, searchable waiting roster, and proximity alerts.
- **Procurement Status & Slips**: 6-step lifecycle timeline (Booked &rarr; Arrived &rarr; Weighed &rarr; Quality Approved &rarr; Payment Initiated &rarr; Paid) and official printable Certificate.
- **DBT Payment Ledger**: Direct Benefit Transfer records with transaction IDs and bank account masks.

### 2. 👮 Procurement Officer Desk
- **Mandi Live Control Desk**: Large glowing **Current Serving Token** and **Next in Line** displays.
- **⚡ Call Next Farmer**: Dynamically advances the queue sequence and triggers proximity alerts for upcoming farmers.
- **⚖️ Weigh & Verify Crop Modal**:
  - Input actual weighbridge reading (e.g. `39.5` Quintals).
  - Select Quality Grade (`Grade A`, `Grade B`, `FAQ`).
  - Enter Moisture Content % (Permissible limit &le; 12%).
  - Auto-calculates official MSP payout (`₹95,787.50` @ ₹2,425/Qtl).
  - Confirms procurement and initiates payment.
- **Waiting Roster**: Searchable list of today's queued farmers with 1-click quick-call buttons.

### 3. 🏛️ Government / State Directorate Portal
- **6 Macro KPI Cards**: 12,450+ Farmers, 840 Bookings, 710 Served, 130 Waiting, 8,420 Qtl Procured, ₹2.04 Cr Paid.
- **Interactive Chart.js Visualizations**: 7-Day Procurement Volume Trend line chart and Crop Distribution Donut chart.
- **Treasury DBT Action Desk**: 1-click **[Disburse (DBT)]** action button to approve payments and credit funds into farmer bank accounts.

### 4. 🌐 Dual-Language Support & Persistence
- Instant toggle between **English** and **हिन्दी (Hindi)**.
- Full **LocalStorage persistence**: Token advancements, weighments, bookings, and payments persist across page refreshes.

---

## 🚀 How to Run

Simply **double-click `index.html`** or open it in any web browser!

Or serve using any static server:
```bash
# Optional: Using Python
python -m http.server 8000

# Or using npx serve
npx serve .
```

---

## 📁 File Structure

```
d:/sihprojecct/
├── index.html       # Single-Page Application with all 3 Dashboards & Modals
├── style.css        # Custom styles, neon badges, ticket edge cutout, print styles
├── app.js           # Vanilla JavaScript state engine, LocalStorage & Chart.js logic
└── README.md        # Documentation
```
