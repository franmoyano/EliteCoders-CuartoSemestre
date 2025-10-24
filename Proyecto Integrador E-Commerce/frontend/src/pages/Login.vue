<template>
  <section class="center">
    <div class="card" style="max-width: 450px; width: 100%">
      <div class="card-content">
        <div style="text-align: center; margin-bottom: 2rem">
          <h1 class="h1">Iniciar Sesión</h1>
          <p style="color: var(--muted); margin-top: 0.5rem">
            Accede a tus cursos y continúa aprendiendo
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="form-grid" style="grid-template-columns: 1fr; gap: 1.5rem">
          <div class="field">
            <label for="username" class="label">Usuario</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="input"
              :class="{ 'input-error': usernameError }"
              placeholder="Ingresa tu usuario"
              required
              @blur="validateUsername"
              @input="clearUsernameError"
            />
            <span v-if="usernameError" class="error-text">{{ usernameError }}</span>
          </div>

          <div class="field">
            <label for="password" class="label">Contraseña</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                class="input"
                :class="{ 'input-error': passwordError }"
                placeholder="Ingresa tu contraseña"
                required
                @blur="validatePassword"
                @input="clearPasswordError"
              />
              <button
                type="button"
                class="input-addon"
                @click="togglePassword"
                :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
            <span v-if="passwordError" class="error-text">{{ passwordError }}</span>
          </div>

          <div v-if="error" class="alert alert-error">
            <span>⚠️</span>
            <span>{{ error }}</span>
          </div>

          <button 
            type="submit" 
            class="btn block"
            :disabled="authStore.isLoading || !isFormValid"
            :class="{ 'btn-loading': authStore.isLoading }"
          >
            <span v-if="authStore.isLoading">⏳ Iniciando sesión...</span>
            <span v-else>🔑 Iniciar Sesión</span>
          </button>
        </form>
      </div>

      <div class="card-footer">
        <div class="hr"></div>
        <div style="text-align: center">
          <p style="color: var(--muted); margin: 0">
            ¿No tienes cuenta? 
            <RouterLink to="/register" class="link">Crear una cuenta</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// --- Estado Reactivo ---
const username = ref('');
const password = ref('');
const error = ref(null);
const showPassword = ref(false);
const usernameError = ref('');
const passwordError = ref('');

// --- Instancias ---
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// --- Computed ---
const isFormValid = computed(() => {
  return username.value.trim().length > 0 && 
         password.value.length > 0 && 
         !usernameError.value && 
         !passwordError.value;
});

// --- Métodos de Validación ---
const validateUsername = () => {
  if (!username.value.trim()) {
    usernameError.value = 'El usuario es requerido';
  } else if (username.value.trim().length < 3) {
    usernameError.value = 'El usuario debe tener al menos 3 caracteres';
  } else {
    usernameError.value = '';
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'La contraseña es requerida';
  } else if (password.value.length < 4) {
    passwordError.value = 'La contraseña debe tener al menos 4 caracteres';
  } else {
    passwordError.value = '';
  }
};

const clearUsernameError = () => {
  if (usernameError.value) usernameError.value = '';
};

const clearPasswordError = () => {
  if (passwordError.value) passwordError.value = '';
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// --- Método de Login ---
const handleLogin = async () => {
  // Validar campos antes de enviar
  validateUsername();
  validatePassword();
  
  if (!isFormValid.value) {
    return;
  }

  error.value = null;

  try {
    await authStore.login(username.value.trim(), password.value);
    
    // Redirigir al destino solicitado o a mis-cursos
    const next = route.query.next || '/mis-cursos';
    router.push(next);
    
  } catch (err) {
    console.error('Error en login:', err);
    error.value = 'Usuario o contraseña incorrectos. Verifica tus datos e inténtalo de nuevo.';
  }
};
</script>