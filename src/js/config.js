/* ============================================
   BUILDORA — API Configuration
   ============================================
   Single source of truth for the backend API URL.
   In production (Vite build), uses the Render URL.
   In development, uses localhost.
   ============================================ */

// Detect if running in production build or local dev
const isProd = window.location.hostname !== 'localhost' 
            && window.location.hostname !== '127.0.0.1'
            && window.location.protocol !== 'file:';

export const API_BASE = isProd
  ? 'https://buildora-api.onrender.com'  // ← Update this after Render deploy
  : 'http://127.0.0.1:8001';
