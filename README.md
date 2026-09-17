# 🌾 KISSAN-PROCURE-SMART-MANDI
### *Smart Mandi Slot Booking, Real-Time Queue Streaming & Transparent MSP Disbursement Platform*
#### *Smart India Hackathon • Problem Statement 26032*

---

## 🏛️ Complete Production Directory Structure

```
KISSAN-PROCURE-SMART-MANDI/
│
├── index.html                   # Master Single-Page Application & Landing Hub
├── README.md                    # Project Documentation & Architecture Walkthrough
│
├── assets/
│   ├── images/
│   │   ├── logo.svg             # KisanProcure Brand Emblem
│   │   ├── farmer.svg           # Farmer Persona Avatar
│   │   └── mandi.svg            # Mandi Yard Illustration
│   └── icons/
│
├── css/
│   ├── style.css                # Master CSS orchestrator
│   ├── variables.css            # Design tokens, palette (kisan green, mandi amber)
│   ├── responsive.css           # Mobile & tablet media queries
│   │
│   ├── components/
│   │   ├── navbar.css           # Top bar and persona switcher styling
│   │   ├── sidebar.css          # Navigation sidebar styles
│   │   ├── cards.css            # Glassmorphic and spotlight cards
│   │   ├── buttons.css          # Action buttons & call-to-actions
│   │   ├── modal.css            # Accessible modal overlay styles
│   │   ├── tables.css           # Roster and ledger tables
│   │   └── timeline.css         # 6-step lifecycle timeline
│   │
│   └── pages/
│       ├── landing.css          # Hero banner and workflow showcase
│       ├── farmer.css           # Farmer dashboard & token cards
│       ├── officer.css          # Officer control desk
│       └── government.css       # State analytics and KPI grids
│
├── js/
│   ├── app.js                   # Master Application Bootstrapper & Router
│   ├── config.js                # Supabase & Application Configuration
│   │
│   ├── supabase/
│   │   ├── client.js            # Supabase Client Initializer with offline cache
│   │   ├── auth.js              # Persona login & session persistence
│   │   ├── farmers.js           # Farmer identity & profile queries
│   │   ├── bookings.js          # Slot bookings & token allocation
│   │   ├── queue.js             # Live token queue streaming
│   │   ├── procurement.js       # Weighment & quality inspection insertion
│   │   └── payments.js          # DBT payment ledger & status updates
│   │
│   ├── farmer/
│   │   ├── farmer-dashboard.js  # Upcoming slot & Token #23 spotlight
│   │   ├── slot-booking.js      # 4-step wizard & AI slot recommendation
│   │   ├── queue-tracker.js     # Horizontal queue sequence & countdown ETA
│   │   ├── procurement-status.js# 6-step lifecycle timeline & certificate
│   │   └── payment-ledger.js    # Bank payout ledger & transaction receipts
│   │
│   ├── officer/
│   │   ├── officer-dashboard.js # Mandi desk throughput counters
│   │   ├── queue-control.js     # "⚡ Call Next Farmer" & proximity alerts
│   │   ├── weighment.js         # Physical weighbridge & MSP calculator
│   │   └── farmer-verification.js# Biometric & token verification gate
│   │
│   ├── government/
│   │   ├── government-dashboard.js# State macro KPI counters
│   │   ├── analytics.js         # Chart.js volume trends & crop distribution
│   │   └── dbt.js               # Treasury DBT Clearance & 1-click disbursement
│   │
│   ├── components/
│   │   ├── navbar.js            # Dynamic header navigation & profile pill
│   │   ├── sidebar.js           # Dashboard sidebar links
│   │   ├── modal.js             # Accessible modal manager
│   │   ├── toast.js             # Floating real-time alert toasts
│   │   ├── loader.js            # Async operation spinners
│   │   └── language.js          # English / हिन्दी (Hindi) switcher
│   │
│   └── utils/
│       ├── formatters.js        # Currency (₹ INR), Quintals, Date & Token formatters
│       ├── validators.js        # Phone, Aadhar & Moisture % validators
│       ├── constants.js         # Mandi codes, MSP benchmark rates, enums
│       └── helpers.js           # Confetti triggers, ID generators & LocalStorage
│
├── pages/
│   ├── login.html               # Standalone persona login page
│   ├── farmer.html              # Standalone farmer portal page
│   ├── officer.html             # Standalone officer inspection page
│   ├── government.html          # Standalone government analytics page
│   ├── booking.html             # Standalone slot reservation page
│   ├── queue.html               # Standalone full-screen live queue visualizer
│   ├── procurement.html         # Standalone procurement records page
│   └── payment.html             # Standalone DBT payout ledger page
│
└── supabase/
    ├── schema.sql               # PostgreSQL Relational DDL (10 tables, indexes, triggers)
    ├── seed.sql                 # Seed datasets (Muzaffarpur Mandi, Ramesh Kumar #23)
    └── policies.sql             # Row-Level Security (RLS) fine-grained authorization
```

---

## 🚀 How to Run

1. **Direct Execution**: Simply double-click **`index.html`** in your browser.
2. **Zero Setup**: Zero node_modules or build dependencies needed.
3. **Multi-Page Links**: Explore individual subpages in `pages/` or use the full interactive single-page app in `index.html`.
