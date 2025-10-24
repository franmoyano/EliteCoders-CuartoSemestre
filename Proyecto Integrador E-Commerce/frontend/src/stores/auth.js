import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
import api from "@/api/axiosInstance";

export const useAuthStore = defineStore("auth", () => {
  const token = ref(localStorage.getItem("authToken") || null);
  const user = ref(JSON.parse(localStorage.getItem("authUser")) || null);
  const isLoading = ref(false);

  async function login(username, password) {
    isLoading.value = true;
    try {
      const response = await api.post("auth/jwt/create/", {
        username: username,
        password: password,
      });

      const accessToken = response.data.access;
      token.value = accessToken;

      localStorage.setItem("authToken", accessToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      await fetchUser();
    } catch (error) {
      logout();
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Registra un nuevo usuario usando Djoser (POST /auth/users/)
   * Si el registro es exitoso, retorna la respuesta. No hace login automático.
   */
  async function register(email, username, password) {
    isLoading.value = true;
    try {
      const payload = { email, username, password };
      const response = await api.post("auth/users/", payload);
      return response;
    } catch (error) {
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Obtiene los datos del usuario (endpoint /me/ de Djoser)
   */
  async function fetchUser() {
    if (!token.value) return;

    try {
      const response = await api.get("auth/users/me/");
      user.value = response.data;
      localStorage.setItem("authUser", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      logout();
    }
  }

  /**
   * Cierra la sesión
   */
  function logout() {
    token.value = null;
    user.value = null;

    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    delete axios.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Authorization"];
  }

  return {
    token,
    user,
    isLoading,
    login,
    register,
    fetchUser,
    logout,
  };
});
