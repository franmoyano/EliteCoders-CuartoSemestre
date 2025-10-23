<script setup>
import { useRoute } from 'vue-router'
import { courses } from '@/mocks/courses'
const route = useRoute()
const course = courses.find(c => String(c.id)===route.params.id) || courses[0]
</script>

<template>
  <section class="container">
    <h1 class="h1">Nombre del Curso</h1>
    <div class="sidebar-grid">
      <div>
        <div v-for="(l,idx) in course.lessons" :key="idx" class="list-pill">
          Leccion {{ idx+1 }}
        </div>
      </div>
      <aside class="card" style="min-height:200px">
        <h2 class="h2">Resumen del curso</h2>
        <p>autor<br/>tiempo duracion</p>
      </aside>
    </div>
  </section>
</template>
