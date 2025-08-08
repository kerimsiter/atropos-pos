// packages/atropos-desktop/src/renderer/src/api/index.ts
import axios from 'axios';

// Resolve API base URL from Vite env, fallback to localhost:3000 for dev
const resolvedBaseURL = (import.meta as any)?.env?.VITE_API_URL || 'http://localhost:3000';
// Log once to help diagnose environment mismatches
if (typeof window !== 'undefined' && !(window as any).__API_BASE_LOGGED__) {
  // eslint-disable-next-line no-console
  console.info('[API] baseURL =', resolvedBaseURL);
  (window as any).__API_BASE_LOGGED__ = true;
}

const api = axios.create({
  baseURL: resolvedBaseURL, // Backend API adresimiz
});

// Axios Interceptor: Her istek gönderilmeden önce araya girer
api.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      const token = state.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

