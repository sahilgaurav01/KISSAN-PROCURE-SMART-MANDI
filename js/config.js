/**
 * =========================================================
 * APP CONFIGURATION (js/config.js)
 * Supabase Connection & Application Settings
 * =========================================================
 */

export const CONFIG = {
  APP_NAME: 'KisanProcure',
  VERSION: '2.0.0',
  SIH_PROBLEM_STATEMENT: '26032',
  
  // Live Supabase Project Credentials
  SUPABASE_URL: 'https://oxkbtztfvrspfaeprxwh.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_nj21I276_f0aHb04VTmAsQ_plc6R9qt',
  
  // Feature Flags
  ENABLE_REALTIME: true,
  ENABLE_OFFLINE_CACHE: true,
  DEFAULT_LANGUAGE: 'en',
  
  // Business Logic Benchmarks
  AVG_TURNAROUND_MINUTES_PER_FARMER: 5.5,
  PROXIMITY_ALERT_THRESHOLD: 3, // Alert farmer when 3 or fewer tokens remain
  PERMISSIBLE_MOISTURE_LIMIT: 12.0 // Standard FAQ %
};
