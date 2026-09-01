import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    appTitle: 'KisanProcure',
    appSubtitle: 'National Smart Agri-Procurement & Queue System',
    farmerPortal: 'Farmer Portal',
    officerPortal: 'Officer Desk',
    adminPortal: 'Govt Analytics',
    bookSlot: 'Book Slot',
    liveQueue: 'Live Queue',
    myBookings: 'My Bookings',
    payments: 'Payments',
    token: 'Token',
    crop: 'Crop',
    quantity: 'Quantity',
    quintals: 'Quintals',
    mandi: 'Procurement Centre',
    date: 'Date',
    slotTime: 'Time Slot',
    farmersAhead: 'farmers ahead of you',
    estimatedWait: 'Estimated Wait',
    callNext: 'Call Next Farmer',
    verifyCrop: 'Verify & Weigh Crop',
    status: 'Status',
    msp: 'MSP Rate',
    totalPayout: 'Total Payout',
    welcome: 'Welcome',
    switchRole: 'Quick Role Switch',
  },
  hi: {
    appTitle: 'किसान प्रोक्योर',
    appSubtitle: 'राष्ट्रीय स्मार्ट कृषि खरीद एवं कतार प्रबंधन प्रणाली',
    farmerPortal: 'किसान पोर्टल',
    officerPortal: 'अधिकारी डेस्क',
    adminPortal: 'सरकारी एनालिटिक्स',
    bookSlot: 'स्लॉट बुक करें',
    liveQueue: 'लाइव कतार',
    myBookings: 'मेरी बुकिंग',
    payments: 'भुगतान स्थिति',
    token: 'टोकन',
    crop: 'फसल',
    quantity: 'मात्रा',
    quintals: 'क्विंटल',
    mandi: 'खरीद केंद्र',
    date: 'तारीख',
    slotTime: 'समय स्लॉट',
    farmersAhead: 'किसान आपके आगे हैं',
    estimatedWait: 'अनुमानित प्रतीक्षा समय',
    callNext: 'अगले किसान को बुलाएं',
    verifyCrop: 'फसल वजन एवं गुणवत्ता जांच',
    status: 'स्थिति',
    msp: 'न्यूनतम समर्थन मूल्य (MSP)',
    totalPayout: 'कुल भुगतान',
    welcome: 'स्वागत है',
    switchRole: 'त्वरित रोल बदलें',
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
