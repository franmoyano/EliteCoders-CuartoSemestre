<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue' // 1. Importar ref y onMounted
import { getCursoById } from '../api/cursos' // 2. Importar la función de la API

// 3. Eliminar la importación del mock
// import { courses } from '@/mocks/courses'

const route = useRoute()
const router = useRouter()

// 4. Crear un 'ref' para almacenar el curso. Lo iniciamos en 'null'
const course = ref(null)

// 5. Usar onMounted para cargar los datos cuando el componente se monte
onMounted(async () => {
  const courseId = route.params.id // Obtenemos el ID de la URL
  try {
    const response = await getCursoById(courseId)
    course.value = response.data // Asignamos los datos de la API al ref
  } catch (error) {
    console.error("Error al cargar el curso:", error)
    // Aquí podrías redirigir a una página 404 si el curso no se encuentra
    // router.push('/404')
  }
})

// 6. Actualizar la función 'comprar' para que use 'course.value'
function comprar() {
  if (course.value) { // Asegurarse de que 'course' ha cargado
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