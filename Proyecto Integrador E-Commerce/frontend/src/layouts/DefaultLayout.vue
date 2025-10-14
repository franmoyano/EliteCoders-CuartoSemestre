<script setup>
import AppHeader from '@/components/ui/AppHeader.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="container">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.container {
  flex: 1;
  padding: 1rem;
  margin: 0 auto;
  max-width: 1100px;
  width: 100%;
}
</style>