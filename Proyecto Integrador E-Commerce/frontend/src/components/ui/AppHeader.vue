<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const username = computed(() => authStore.user?.username || authStore.user?.email || null)

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="header">
    <nav>
      <RouterLink class="brand" to="/">Nombre E-Commerce</RouterLink>
      <RouterLink to="/about">Acerca de</RouterLink>
      <RouterLink to="/courses">Cursos</RouterLink>
      <RouterLink to="/plans">Planes</RouterLink>
      <RouterLink to="/cart">Carrito</RouterLink>
      <span style="margin-left:auto"></span>

      <template v-if="username">
        <RouterLink :to="'/mis-cursos'" class="tag">{{ username }}</RouterLink>
        <button class="btn secondary" @click="handleLogout" :disabled="authStore.isLoading">Salir</button>
      </template>

      <template v-else>
        <RouterLink to="/login">Entrar</RouterLink>
      </template>

    </nav>
  </header>
</template>
