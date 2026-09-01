import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  Bell, 
  User, 
  LogOut, 
  Globe, 
  Layers, 
  Calendar, 
  Activity, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout, demoLogin, unreadCount, notifications, markNotificationRead } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Govt Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">
            {lang === 'en' 
              ? 'Govt. of India • Smart India Hackathon 2024-26 • Problem 26032' 
              : 'भारत सरकार • स्मार्ट इंडिया हैकाथॉन • समस्या विवरण 26032'}
          </span>
        </div>

        {/* Demo Quick Switcher */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center space-x-1.5 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 px-2.5 py-0.5 rounded text-xs transition"
            >
              <Layers className="w-3 h-3 text-emerald-300" />
              <span>⚡ {t('switchRole')}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-1 w-64 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-1.5 z-50">
                <div className="px-3 py-1 text-[11px] text-slate-400 border-b border-slate-700 font-semibold uppercase tracking-wider">
                  Select Demo Persona
                </div>
                <button
                  onClick={() => { demoLogin('farmer'); setShowDemoMenu(false); setActiveTab('dashboard'); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-emerald-300">👨‍🌾 Ramesh Kumar (Farmer)</div>
                    <div className="text-[10px] text-slate-400">Token 23 • 40 Qtl Wheat</div>
                  </div>
                  {user?.role === 'farmer' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
                <button
                  onClick={() => { demoLogin('officer'); setShowDemoMenu(false); setActiveTab('officer-desk'); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-amber-300">👮 Rajesh Sharma (Officer)</div>
                    <div className="text-[10px] text-slate-400">Muzaffarpur Mandi Desk</div>
                  </div>
                  {user?.role === 'officer' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                </button>
                <button
                  onClick={() => { demoLogin('admin'); setShowDemoMenu(false); setActiveTab('admin-analytics'); }}
                  className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-700 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-blue-300">🏛️ Dr. Sanjay Meena (Director)</div>
                    <div className="text-[10px] text-slate-400">State Analytics & Payments</div>
                  </div>
                  {user?.role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 hover:text-white transition bg-slate-800 px-2 py-0.5 rounded text-xs"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab(user ? (user.role === 'farmer' ? 'dashboard' : user.role === 'officer' ? 'officer-desk' : 'admin-analytics') : 'landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">Kisan<span className="text-emerald-600">Procure</span></span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  SIH 26032
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-none">
                {lang === 'en' ? 'Smart Mandi Queue & MSP Payout System' : 'स्मार्ट मंडी कतार एवं प्रत्यक्ष भुगतान'}
              </p>
            </div>
          </div>

          {/* Navigation Items (Role Dependent) */}
          {user && (
            <nav className="hidden md:flex items-center space-x-1">
              {user.role === 'farmer' && (
                <>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('book-slot')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'book-slot' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{t('bookSlot')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('live-queue')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'live-queue' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{t('liveQueue')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('my-procurements')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'my-procurements' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>{t('myBookings')}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'payments' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t('payments')}</span>
                  </button>
                </>
              )}

              {user.role === 'officer' && (
                <>
                  <button
                    onClick={() => setActiveTab('officer-desk')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'officer-desk' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-amber-600" />
                    <span>Mandi Desk Control</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('live-queue')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'live-queue' ? 'bg-amber-50 text-amber-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span>Waiting Queue</span>
                  </button>
                </>
              )}

              {user.role === 'admin' && (
                <>
                  <button
                    onClick={() => setActiveTab('admin-analytics')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'admin-analytics' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>State Analytics</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('admin-payments')}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${
                      activeTab === 'admin-payments' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>DBT Disbursements</span>
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Action Icons & Profile */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifs(!showNotifs)}
                    className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition relative"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown Panel */}
                  {showNotifs && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <div className="font-semibold text-slate-800 text-sm">Notifications & Alerts</div>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markNotificationRead('all')}
                            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              className={`p-3 text-xs hover:bg-slate-50 transition ${n.is_read ? 'opacity-70' : 'bg-emerald-50/40'}`}
                            >
                              <div className="flex items-start space-x-2">
                                <span className={`mt-0.5 inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                                  n.type === 'alert' ? 'bg-rose-500 animate-ping' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                                }`}></span>
                                <div className="flex-1">
                                  <div className="font-semibold text-slate-800">{n.title}</div>
                                  <div className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</div>
                                  <div className="text-[10px] text-slate-400 mt-1">{new Date(n.created_at).toLocaleTimeString()}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Pill */}
                <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-200">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    user.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' : user.role === 'officer' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">{user.name}</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">
                      {user.role === 'farmer' ? `ID: ${user.farmerId || 'FARM'}` : user.role === 'officer' ? 'Procurement Officer' : 'State Director'}
                    </div>
                  </div>
                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { demoLogin('farmer'); setActiveTab('dashboard'); }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
                >
                  Quick Demo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
