<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <section>
    <h1>Curso #{{ route.params.id }}</h1>
    <RouterLink to="/courses">← Volver</RouterLink>
  </section>
</template>