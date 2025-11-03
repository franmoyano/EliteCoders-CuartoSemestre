import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1', // backend URL
  withCredentials: true, // si usás cookies o sesiones
});

export default api;








// --- Interceptor para adjuntar el token JWT en cada request ---
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('authToken');
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
}, (error) => Promise.reject(error));
