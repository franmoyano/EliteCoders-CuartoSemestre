<template>
  <section class="login-container">
    <h1>Crear cuenta</h1>
    <p>Regístrate para acceder a los cursos.</p>

    <form @submit.prevent="handleRegister" class="login-form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="username">Usuario:</label>
        <input type="text" id="username" v-model="username" required />
      </div>

      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <button type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Creando...' : 'Crear cuenta' }}
      </button>
    </form>

    <p style="margin-top:1rem">¿Ya tienes cuenta? <RouterLink to="/login">Entrar</RouterLink></p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const username = ref('')
const password = ref('')
const error = ref(null)

const router = useRouter()
const authStore = useAuthStore()

const handleRegister = async () => {
  error.value = null
  try {
    await authStore.register(email.value, username.value, password.value)
    // After a successful registration, redirect to login so user can sign in
    router.push('/login')
  } catch (err) {
    // Djoser returns validation errors in err.response.data
    error.value = err?.response?.data?.detail || JSON.stringify(err?.response?.data) || 'Error al registrar'
  }
}
</script>

<style scoped>
/* Reuse simple layout styles from Login page */
.login-container{max-width:420px;margin:3rem auto}
.login-form{display:grid;gap:.8rem}
.form-group{display:flex;flex-direction:column}
.error-message{color:#ff6b6b}
</style>