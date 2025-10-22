<script setup>
import { ref, onMounted } from 'vue';
import { getCursos } from '../api/cursos';


const cursos = ref([]);

onMounted(async () => {
  const response = await getCursos();
  cursos.value = response.data;
});

</script>
<template>
  <section>
    <h1>Cursos</h1>
    <p>Listado de cursos (demo).</p>
    <ul>
      <li v-for="c in cursos" :key="c.id">{{ c.titulo }}</li>
    </ul>

  </section>
</template>