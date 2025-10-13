import axios from 'axios'

// Apunta al backend de Django (ajusta el puerto si hace falta)
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  withCredentials: false,
})
