<template>
  <section class="center">
    <div class="card" style="max-width: 450px; width: 100%">
      <div class="card-content">
        <div style="text-align: center; margin-bottom: 2rem">
          <h1 class="h1">Crear Cuenta</h1>
          <p style="color: var(--muted); margin-top: 0.5rem">
            Únete y comienza tu viaje de aprendizaje
          </p>
        </div>

        <form @submit.prevent="handleRegister" class="form-grid" style="grid-template-columns: 1fr; gap: 1.5rem">
          <div class="field">
            <label for="email" class="label">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="input"
              :class="{ 'input-error': emailError }"
              placeholder="tu@email.com"
              required
              @blur="validateEmail"
              @input="clearEmailError"
            />
            <span v-if="emailError" class="error-text">{{ emailError }}</span>
          </div>

          <div class="field">
            <label for="username" class="label">Nombre de Usuario</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="input"
              :class="{ 'input-error': usernameError }"
              placeholder="Elige un nombre de usuario"
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
                placeholder="Crea una contraseña segura"
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
            <div v-if="password.length > 0" class="password-strength">
              <div class="strength-bar">
                <div 
                  class="strength-fill" 
                  :class="passwordStrength.class"
                  :style="{ width: passwordStrength.width }"
                ></div>
              </div>
              <span class="strength-text" :class="passwordStrength.class">
                {{ passwordStrength.text }}
              </span>
            </div>
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
            <span v-if="authStore.isLoading">⏳ Creando cuenta...</span>
            <span v-else>✨ Crear Cuenta</span>
          </button>
        </form>
      </div>

      <div class="card-footer">
        <div class="hr"></div>
        <div style="text-align: center">
          <p style="color: var(--muted); margin: 0">
            ¿Ya tienes cuenta? 
            <RouterLink to="/login" class="link">Iniciar sesión</RouterLink>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// --- Estado Reactivo ---
const email = ref('')
const username = ref('')
const password = ref('')
const error = ref(null)
const showPassword = ref(false)
const emailError = ref('')
const usernameError = ref('')
const passwordError = ref('')

// --- Instancias ---
const router = useRouter()
const authStore = useAuthStore()

// --- Computed ---
const isFormValid = computed(() => {
  return email.value.trim().length > 0 && 
         username.value.trim().length > 0 && 
         password.value.length > 0 && 
         !emailError.value && 
         !usernameError.value && 
         !passwordError.value;
});

const passwordStrength = computed(() => {
  const pwd = password.value;
  if (pwd.length === 0) return { width: '0%', class: '', text: '' };
  
  let score = 0;
  let text = '';
  
  // Length check
  if (pwd.length >= 6) score += 1;
  if (pwd.length >= 8) score += 1;
  
  // Character variety
  if (/[a-z]/.test(pwd)) score += 1;
  if (/[A-Z]/.test(pwd)) score += 1;
  if (/[0-9]/.test(pwd)) score += 1;
  if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
  
  if (score <= 2) {
    return { width: '30%', class: 'weak', text: 'Débil' };
  } else if (score <= 4) {
    return { width: '60%', class: 'medium', text: 'Media' };
  } else {
    return { width: '100%', class: 'strong', text: 'Fuerte' };
  }
});

// --- Métodos de Validación ---
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    emailError.value = 'El email es requerido';
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Ingresa un email válido';
  } else {
    emailError.value = '';
  }
};

const validateUsername = () => {
  if (!username.value.trim()) {
    usernameError.value = 'El nombre de usuario es requerido';
  } else if (username.value.trim().length < 3) {
    usernameError.value = 'Debe tener al menos 3 caracteres';
  } else if (!/^[a-zA-Z0-9_]+$/.test(username.value)) {
    usernameError.value = 'Solo letras, números y guiones bajos';
  } else {
    usernameError.value = '';
  }
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = 'La contraseña es requerida';
  } else if (password.value.length < 6) {
    passwordError.value = 'Debe tener al menos 6 caracteres';
  } else {
    passwordError.value = '';
  }
};

const clearEmailError = () => {
  if (emailError.value) emailError.value = '';
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

// --- Método de Registro ---
const handleRegister = async () => {
  // Validar todos los campos
  validateEmail();
  validateUsername();
  validatePassword();
  
  if (!isFormValid.value) {
    return;
  }

  error.value = null;
  
  try {
    await authStore.register(email.value.trim(), username.value.trim(), password.value);
    // Después del registro exitoso, redirigir al login
    router.push({ path: '/login', query: { message: 'Cuenta creada exitosamente. Inicia sesión.' } });
  } catch (err) {
    console.error('Error en registro:', err);
    // Manejar errores específicos de Djoser
    if (err?.response?.data) {
      const data = err.response.data;
      if (data.email) {
        error.value = `Email: ${data.email[0]}`;
      } else if (data.username) {
        error.value = `Usuario: ${data.username[0]}`;
      } else if (data.password) {
        error.value = `Contraseña: ${data.password[0]}`;
      } else {
        error.value = data.detail || 'Error al crear la cuenta. Verifica los datos.';
      }
    } else {
      error.value = 'Error al crear la cuenta. Inténtalo de nuevo.';
    }
  }
}
</script>
