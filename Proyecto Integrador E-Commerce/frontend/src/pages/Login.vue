<template>
  <section class="login-container">
    <h1>Iniciar Sesión</h1>
    <p>Accede a tus cursos.</p>

    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">Usuario:</label>
        <input
          type="text"
          id="username"
          v-model="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
        />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Cargando...' : 'Entrar' }}
      </button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Importamos nuestro store

// --- Estado Reactivo ---
const username = ref('');
const password = ref('');
const error = ref(null);

// --- Instancias ---
const router = useRouter();
const authStore = useAuthStore();

// --- Métodos ---
const handleLogin = async () => {
  error.value = null; // Limpiamos errores previos

  try {
    // Llamamos a la acción de login definida en el store
    await authStore.login(username.value, password.value);

    // Si el login es exitoso, redirigimos
    router.push('/mis-cursos'); // O al dashboard, perfil, etc.

  } catch (err) {
    // Si el store lanza un error (ej. 401 Unauthorized)
    error.value = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.';
  }
};
</script>