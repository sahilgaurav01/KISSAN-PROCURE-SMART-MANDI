import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  TrendingUp, 
  Smartphone, 
  Building2, 
  Award,
  Zap,
  Users,
  Layers
} from 'lucide-react';

export default function LandingPage({ setActiveTab }) {
  const { demoLogin } = useAuth();
  const { lang, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-16 pb-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/20 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <SparkleIcon className="w-3.5 h-3.5" />
              <span>Smart India Hackathon 2024-26 • PS ID: 26032</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Eliminating Mandi Queues, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-emerald-200">
                Empowering Indian Farmers
              </span>
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              {lang === 'en'
                ? 'KisanProcure is an end-to-end smart procurement slot booking & real-time queue management platform with automated weighment, quality grading, and transparent direct MSP payouts.'
                : 'किसान प्रोक्योर एक संपूर्ण स्मार्ट खरीद स्लॉट बुकिंग एवं रीयल-टाइम कतार प्रबंधन प्रणाली है जो कतार रहित मंडी, पारदर्शी वजन और त्वरित डीबीटी भुगतान सुनिश्चित करती है।'}
            </p>

            {/* Quick 1-Click Launch Persona Bar */}
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => { demoLogin('farmer'); setActiveTab('dashboard'); }}
                className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-lg shadow-emerald-500/25 hover:scale-105"
              >
                <span>👨‍🌾 Launch as Ramesh Kumar (Farmer)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { demoLogin('officer'); setActiveTab('officer-desk'); }}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition flex items-center space-x-2 shadow-lg shadow-amber-500/25 hover:scale-105"
              >
                <span>👮 Launch Officer Desk (Desk 1)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => { demoLogin('admin'); setActiveTab('admin-analytics'); }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs sm:text-sm transition flex items-center space-x-2 hover:scale-105"
              >
                <span>🏛️ State Analytics (Director)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars / Role Dashboards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Farmer */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:border-emerald-500 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Farmer Module</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Smart Booking & Live Queue</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Book preferred mandi slots with AI wait-time recommendation. Receive digital token passes, track live queues, and get proximity SMS/in-app alerts.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Demo: Token #23 Ready</span>
              <button
                onClick={() => { demoLogin('farmer'); setActiveTab('dashboard'); }}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
              >
                <span>Open Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Officer */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:border-amber-500 transition group">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Activity className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">Officer Desk</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">Inspection & Weighment</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Real-time Mandi Queue control desk. Call next token, record digital weighbridge inputs, assess moisture/grade, and trigger instant payout generation.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Muzaffarpur Central Mandi</span>
              <button
                onClick={() => { demoLogin('officer'); setActiveTab('officer-desk'); }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
              >
                <span>Open Desk</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Admin */}
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-200 hover:border-blue-500 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Government Portal</span>
            <h3 className="text-lg font-bold text-slate-900 mt-1">State Analytics & DBT</h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Macro governance dashboard with Recharts trends, center capacity utilization, bottleneck alerts, and 1-click Direct Benefit Transfer (DBT) disbursement.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">₹2.04 Cr Disbursed</span>
              <button
                onClick={() => { demoLogin('admin'); setActiveTab('admin-analytics'); }}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* End-to-End Workflow Steps */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Zero Bottlenecks • Zero Distress Selling</span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-1">How KisanProcure Works</h2>
          <p className="text-xs text-slate-500 mt-2">A seamless 6-step lifecycle transforming agricultural procurement</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { step: '01', title: 'Farmer Books Slot', desc: 'Select crop, quintals & get recommended least-crowded slot.' },
            { step: '02', title: 'Token Slip Issued', desc: 'Digital QR token pass with scheduled reporting window.' },
            { step: '03', title: 'Live Queue Sync', desc: 'Real-time WebSocket queue tracking with ETA counter.' },
            { step: '04', title: 'Proximity Alert', desc: 'In-app / SMS alert: "3 farmers ahead, proceed to gate".' },
            { step: '05', title: 'Weighed & Graded', desc: 'Officer records physical weight & moisture at weighbridge.' },
            { step: '06', title: 'Instant DBT Payout', desc: 'Payment automatically calculated at MSP & credited.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative">
              <div className="text-2xl font-black text-emerald-600/30 mb-2">{item.step}</div>
              <div className="font-bold text-slate-900 text-xs">{item.title}</div>
              <div className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SparkleIcon(props) {
  return (
    <svg {...props} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L14.39 8.26L21 9.27L16.27 13.87L17.82 20.34L12 16.77L6.18 20.34L7.73 13.87L3 9.27L9.61 8.26L12 2Z" />
    </svg>
  );
}
