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
  
  // Supabase Credentials (Can be configured with live keys)
  SUPABASE_URL: 'https://xyzcompany.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_key',
  
  // Feature Flags
  ENABLE_REALTIME: true,
  ENABLE_OFFLINE_CACHE: true,
  DEFAULT_LANGUAGE: 'en',
  
  // Business Logic Benchmarks
  AVG_TURNAROUND_MINUTES_PER_FARMER: 5.5,
  PROXIMITY_ALERT_THRESHOLD: 3, // Alert farmer when 3 or fewer tokens remain
  PERMISSIBLE_MOISTURE_LIMIT: 12.0 // Standard FAQ %
};
