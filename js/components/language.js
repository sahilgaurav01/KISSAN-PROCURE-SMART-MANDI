/**
 * =========================================================
 * COMPONENT: LANGUAGE MANAGER (js/components/language.js)
 * Dual-language English / Hindi switcher
 * =========================================================
 */

import { I18N_DICTIONARY } from '../config/i18n.js';

let currentLang = 'en';

export function getLanguage() {
  return currentLang;
}

export function setLanguage(lang) {
  currentLang = lang;
  applyTranslations();
}

export function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'hi' : 'en';
  applyTranslations();
  return currentLang;
}

export function applyTranslations() {
  const dict = I18N_DICTIONARY[currentLang] || I18N_DICTIONARY.en;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.textContent = dict[key];
  });

  const langBtnText = document.getElementById('lang-btn-text');
  if (langBtnText) {
    langBtnText.textContent = currentLang === 'en' ? 'हिन्दी' : 'English';
  }
}
