<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="container mx-auto px-4 py-6 grow">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import AppHeader from '@/components/ui/AppHeader.vue'
import AppFooter from '@/components/ui/AppFooter.vue'
</script>
