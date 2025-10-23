<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getCursoById } from '../api/cursos'

const route = useRoute()
const router = useRouter()

const course = ref(null)

onMounted(async () => {
  const courseId = route.params.id
  try {
    const response = await getCursoById(courseId)
    course.value = response.data
  } catch (error) {
    console.error("Error al cargar el curso:", error)
  }
})

function comprar() {
  if (course.value) {
    router.push(`/checkout?course=${course.value.id}`)
  }
}
</script>

<template>
  <section class="container" v-if="course">
    <h1 class="h1">{{ course.titulo }}</h1>
    <div class="sidebar-grid">
      <div>
        <div class="list-pill">Modalidad</div>
        <div class="list-pill">Programa</div>
        <div class="list-pill">Salida laboral y testimonios</div>
        <div class="list-pill">Preguntas Frecuentes</div>
        <div class="list-pill"><strong>${{ course.precio }}</strong></div>
        <button class="btn block" style="margin-top:1rem" @click="comprar">COMPRAR</button>
      </div>
      <aside class="card">
        <h2 class="h2">Resumen del curso</h2>
        <p style="color:var(--muted)">{{ course.descripcion }}</p>
        <p><strong>Autor:</strong> {{ course.instructor.nombre }}</p>
        <p><strong>Categoría:</strong> {{ course.categoria.nombre }}</p>
      </aside>
    </div>
  </section>

  <div v-else class="container">
    <p>Cargando...</p>
  </div>
</template>