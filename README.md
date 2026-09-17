# 🌾 KisanProcure (SIH Problem Statement 26032)
### *Modular Architecture & Code Presentation Guide*
#### *Pure HTML5, CSS3, & Modular ES6 JavaScript*

---

## 🏛️ Project Directory Structure

```
d:/sihprojecct/
│
├── index.html                     # Semantic Single-Page Application Layout & View Containers
│
├── css/
│   ├── style.css                  # Base typography, neon indicators & responsive theme
│   └── ticket.css                 # Digital Token Pass cutout edges & print styles
│
└── js/
    ├── main.js                    # Central Application Orchestrator & View Switcher
    │
    ├── config/
    │   ├── state.js               # Central State Store with LocalStorage Persistence
    │   └── i18n.js                # English & Hindi (हिन्दी) Localization Dictionaries
    │
    ├── data/
    │   └── mockData.js            # Master Seed Datasets (Centres, Crops, MSPs, Bookings)
    │
    └── modules/
        ├── farmerDashboard.js     # Module 1: Upcoming Slot & Token #23 Spotlight
        ├── slotBooking.js         # Module 2: AI Smart Slot Recommender & Booking Wizard
        ├── liveQueue.js           # Module 3: Real-Time Mandi Queue Visualizer & Tracker
        ├── officerDesk.js         # Module 4: Officer Control Desk ("Call Next Farmer")
        ├── weighmentInspection.js # Module 5: Physical Weighbridge & Quality Grading Modal
        ├── procurementStatus.js   # Module 6: 6-Step Lifecycle Timeline & Weight Slip
        ├── paymentLedger.js       # Module 7: Direct Benefit Transfer (DBT) Ledger
        ├── adminAnalytics.js      # Module 8: State Oversight KPIs & Chart.js Trends
        └── notifications.js       # Module 9: Proximity Alert Toast & Notification Drawer
```

---

## 🎤 How to Explain Each File to Judges / Evaluators

| File Path | Functional Purpose | Key Technical Feature to Highlight |
| :--- | :--- | :--- |
| **[`index.html`](file:///d:/sihprojecct/index.html)** | Core SPA Shell | Houses all 8 view containers and modals without page reloading. |
| **[`js/config/state.js`](file:///d:/sihprojecct/js/config/state.js)** | Central State Store | Reactive state store with automatic `localStorage` synchronization. |
| **[`js/config/i18n.js`](file:///d:/sihprojecct/js/config/i18n.js)** | Localization Engine | Instant toggle between English and Hindi (`हिन्दी`). |
| **[`js/data/mockData.js`](file:///d:/sihprojecct/js/data/mockData.js)** | Master Datasets | Pre-loads Mandi centres, government MSP benchmarks, and active tokens. |
| **[`js/modules/farmerDashboard.js`](file:///d:/sihprojecct/js/modules/farmerDashboard.js)** | Farmer Portal | Highlights **Token #23** at Muzaffarpur Central Mandi with live ETA calculation. |
| **[`js/modules/slotBooking.js`](file:///d:/sihprojecct/js/modules/slotBooking.js)** | Smart Booking | AI heuristic that analyzes slot load and recommends the least congested time window. |
| **[`js/modules/liveQueue.js`](file:///d:/sihprojecct/js/modules/liveQueue.js)** | Live Queue Track | Animated horizontal sequence track showing real-time token progression. |
| **[`js/modules/officerDesk.js`](file:///d:/sihprojecct/js/modules/officerDesk.js)** | Officer Desk | "Call Next Farmer" controller that advances tokens and triggers turn proximity alerts. |
| **[`js/modules/weighmentInspection.js`](file:///d:/sihprojecct/js/modules/weighmentInspection.js)** | Inspection & Weighing | Weighbridge modal: records actual weight, checks moisture (&le;12%), and computes MSP payout. |
| **[`js/modules/procurementStatus.js`](file:///d:/sihprojecct/js/modules/procurementStatus.js)** | Lifecycle Tracker | 6-step lifecycle tracker (Booked &rarr; Weighed &rarr; Quality Checked &rarr; Paid). |
| **[`js/modules/paymentLedger.js`](file:///d:/sihprojecct/js/modules/paymentLedger.js)** | DBT Treasury | Direct Benefit Transfer payment records with transaction IDs and bank masks. |
| **[`js/modules/adminAnalytics.js`](file:///d:/sihprojecct/js/modules/adminAnalytics.js)** | State Analytics | Macro state KPIs, Chart.js trends, and 1-click DBT disbursement approval. |
| **[`js/modules/notifications.js`](file:///d:/sihprojecct/js/modules/notifications.js)** | Real-Time Alerts | Dispatches floating notification toasts when a farmer is within 3 tokens of their turn. |

---

## 🚀 How to Run

1. Simply double-click **`index.html`** to open it directly in any browser.
2. Zero build steps, zero npm dependencies, and 100% portable!
