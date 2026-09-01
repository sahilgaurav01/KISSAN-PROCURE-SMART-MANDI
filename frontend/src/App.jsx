import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import BookSlotPage from './pages/farmer/BookSlotPage';
import LiveQueuePage from './pages/farmer/LiveQueuePage';
import MyProcurementsPage from './pages/farmer/MyProcurementsPage';
import PaymentLedgerPage from './pages/farmer/PaymentLedgerPage';
import OfficerDashboard from './pages/officer/OfficerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Radio, X, CheckCircle2, AlertTriangle } from 'lucide-react';

function AppContent() {
  const { user, activeAlert, setActiveAlert } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    return user ? (user.role === 'farmer' ? 'dashboard' : user.role === 'officer' ? 'officer-desk' : 'admin-analytics') : 'landing';
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Global Alert Notification Toast */}
      {activeAlert && (
        <div className="fixed top-20 right-4 z-50 max-w-md w-full p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-bounce-subtle flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              {activeAlert.type === 'alert' ? (
                <Radio className="w-5 h-5 text-amber-400 animate-ping" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div>
              <div className="font-bold text-sm text-white">{activeAlert.title}</div>
              <div className="text-xs text-slate-300 mt-0.5 leading-relaxed">{activeAlert.message}</div>
            </div>
          </div>
          <button
            onClick={() => setActiveAlert(null)}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Dynamic Content Views */}
      <main className="flex-1">
        {activeTab === 'landing' && <LandingPage setActiveTab={setActiveTab} />}
        {activeTab === 'login' && <LoginPage setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <RegisterPage setActiveTab={setActiveTab} />}
        
        {/* Farmer Views */}
        {activeTab === 'dashboard' && <FarmerDashboard setActiveTab={setActiveTab} />}
        {activeTab === 'book-slot' && <BookSlotPage setActiveTab={setActiveTab} />}
        {activeTab === 'live-queue' && <LiveQueuePage />}
        {activeTab === 'my-procurements' && <MyProcurementsPage />}
        {activeTab === 'payments' && <PaymentLedgerPage />}

        {/* Officer View */}
        {activeTab === 'officer-desk' && <OfficerDashboard />}

        {/* Admin Views */}
        {(activeTab === 'admin-analytics' || activeTab === 'admin-payments') && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">KisanProcure</span>
            <span>• SIH Problem Statement 26032</span>
          </div>
          <div>
            Built with React, Express, PostgreSQL / SQLite & Socket.IO
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
