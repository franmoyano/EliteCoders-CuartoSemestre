<script setup>
import { RouterLink } from 'vue-router'
import { ref, onMounted } from 'vue';
import { getCursos } from '../api/cursos';

const cursos = ref([]);
onMounted(async () => {
  try {
    const response = await getCursos();
    cursos.value = response.data;
  } catch (error) {
    console.error("Error al cargar los cursos:", error);
  }
});
</script>

<template>
  <section class="container">
    <h1 class="h1" style="margin-bottom:.5rem">Cursos</h1>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
      <article class="card" v-for="c in cursos" :key="c.id">
        <h2 class="h2">{{ c.titulo }}</h2>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.3rem 0">
          <span class="tag">{{ c.categoria }}</span>
          </div>
        <div class="hr"></div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${{ c.precio }}</strong>
          <RouterLink class="btn" :to="`/courses/${c.id}`">Ver curso</RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>