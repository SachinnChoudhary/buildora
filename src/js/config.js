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

export const API_BASE = import.meta.env.VITE_API_BASE_URL || (isProd
  ? 'https://buildora-api-lqlk.onrender.com'
  : 'http://127.0.0.1:8001');

export const config = {
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_mock',
  PHONEPE_MERCHANT_ID: import.meta.env.VITE_PHONEPE_MERCHANT_ID || 'PGMERCULT',
  PHONEPE_ENV: import.meta.env.VITE_PHONEPE_ENV || 'SANDBOX'
};

export default { API_BASE, ...config };
