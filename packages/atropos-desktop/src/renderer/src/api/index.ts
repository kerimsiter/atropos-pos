// packages/atropos-desktop/src/renderer/src/api/index.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Backend API adresimiz
});

// Axios Interceptor: Her istek gönderilmeden önce araya girer
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Token'ı store'dan al
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

