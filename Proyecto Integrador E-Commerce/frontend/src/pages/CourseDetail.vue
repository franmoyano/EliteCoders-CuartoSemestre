<script setup>
import { useRoute, useRouter } from 'vue-router'
import { courses } from '@/mocks/courses'
const route = useRoute()
const router = useRouter()
const course = courses.find(c => String(c.id)===route.params.id) || courses[0]
function comprar(){ router.push('/checkout?course='+course.id) }
</script>

<template>
  <section class="container">
    <h1 class="h1">Nombre del Curso</h1>
    <div class="sidebar-grid">
      <div>
        <div class="list-pill">Modalidad</div>
        <div class="list-pill">Programa</div>
        <div class="list-pill">Salida laboral y testimonios</div>
        <div class="list-pill">Preguntas Frecuentes</div>
        <div class="list-pill"><strong>$ PRECIO</strong></div>
        <button class="btn block" style="margin-top:1rem" @click="comprar">COMPRAR</button>
      </div>

      <aside class="card">
        <h2 class="h2">Resumen del curso</h2>
        <p style="color:var(--muted)">{{ course.summary }}</p>
        <p><strong>Autor:</strong> {{ course.author }}</p>
        <p><strong>Tiempo:</strong> {{ course.duration }}</p>
      </aside>
    </div>
  </section>
</template>
