// src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importar Pinia
import App from './App.vue'
import { router } from './router'
import axios from 'axios'
import api from '@/api/axiosInstance'
import { useAuthStore } from './stores/auth' // Importar el store
import '@/assets/styles.css' // Import global styles

// --- Configuración de Axios ---
// 1. Define tu URL base de la API (la de Django)
axios.defaults.baseURL = 'http://127.0.0.1:8000'; // O tu URL de producción
// --- Creación de la App ---
const app = createApp(App)

const pinia = createPinia();
app.use(pinia) // Usar Pinia
app.use(router)

// 2. Configura el interceptor para respuestas (opcional pero recomendado)
// Esto ahora se registra después de instalar Pinia y el router,
// así useAuthStore() funciona sin lanzar errores.
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si recibimos un 401 (token inválido o expirado),
      // usamos el store para desloguear al usuario.
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/login'); // Redirige al login
    }
    return Promise.reject(error);
  }
);


// --- Inicialización de la App ---
// Es importante intentar cargar el usuario ANTES de montar la app
// si ya existe un token en localStorage.
const authStore = useAuthStore();
const token = localStorage.getItem('authToken');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // make sure our custom api instance also carries the token
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // Intentamos cargar los datos del usuario al recargar la página
  authStore.fetchUser().finally(() => {
    app.mount('#app'); // Montamos la app *después* de verificar el usuario
  });
} else {
  app.mount('#app'); // Montamos la app directamente si no hay token
}

// Add interceptor for the api instance too so calls using `api` handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      router.push('/login');
    }
    return Promise.reject(error);
  }
);