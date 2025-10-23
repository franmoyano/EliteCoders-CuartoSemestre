// src/stores/auth.js

import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios'; // Necesitarás axios
import api from '@/api/axiosInstance' // our api instance used across the app

export const useAuthStore = defineStore('auth', () => {
  // --- Estado ---
  // Intentamos cargar el token y usuario desde localStorage al iniciar
  const token = ref(localStorage.getItem('authToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('authUser')) || null);
  const isLoading = ref(false);

  // --- Acciones ---

  /**
   * Realiza el login, guarda el token y obtiene los datos del usuario.
   */
  async function login(username, password) {
    isLoading.value = true;
    try {
      // 1. Pedimos los tokens a Djoser usando el `api` instance
      const response = await api.post('auth/jwt/create/', {
        username: username,
        password: password
      });

      const accessToken = response.data.access;
      token.value = accessToken;

      // 2. Guardamos el token en localStorage
      localStorage.setItem('authToken', accessToken);

      // 3. Configuramos axios para que envíe este token en *todas* las peticiones futuras
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  // Also set the header for our api instance so modules using it send the token
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // 4. Obtenemos los datos del usuario
      await fetchUser();

    } catch (error) {
      // Si hay un error, limpiamos todo
      logout();
      throw error; // Lanzamos el error para que el componente (Login.vue) lo atrape
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Registra un nuevo usuario usando Djoser (POST /auth/users/)
   * Si el registro es exitoso, retorna la respuesta. No hace login automático.
   */
  async function register(email, username, password) {
    isLoading.value = true
    try {
      const payload = { email, username, password }
      const response = await api.post('auth/users/', payload)
      return response
    } catch (error) {
      throw error
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Obtiene los datos del usuario (endpoint /me/ de Djoser)
   */
  async function fetchUser() {
    if (!token.value) return; // No hacer nada si no hay token

    try {
  const response = await api.get('auth/users/me/');
      user.value = response.data;
      localStorage.setItem('authUser', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      // Si el token es inválido (ej. expiró), deslogueamos
      logout();
    }
  }

  /**
   * Cierra la sesión
   */
  function logout() {
    token.value = null;
    user.value = null;

    // Limpiamos localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    // Quitamos el header de autenticación de axios
  delete axios.defaults.headers.common['Authorization'];
  delete api.defaults.headers.common['Authorization'];
  }

  // Exponemos el estado y las acciones
  return {
    token,
    user,
    isLoading,
    login,
    register,
    fetchUser,
    logout
  };
});