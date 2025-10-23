<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getCursoById } from '../api/cursos'
import { getCarrito, agregarCursoCarrito } from '../api/carrito'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const carrito = ref(null)
const authStore = useAuthStore()

// 🔹 Cargar curso
onMounted(async () => {
  const courseId = route.params.id
  try {
    const response = await getCursoById(courseId)
    course.value = response.data
    await cargarCarrito() // también cargamos el carrito al montar
  } catch (error) {
    console.error("Error al cargar el curso:", error)
  }
})

// 🔹 Cargar carrito
const cargarCarrito = async () => {
  try {
    const { data } = await getCarrito()
    carrito.value = data
  } catch (error) {
    console.error("Error al cargar el carrito:", error)
  }
}

// 🔹 Comprar directamente
function comprar() {
  if (!authStore.token) {
    // If not logged, redirect to login
    router.push({ path: '/login', query: { next: `/checkout?course=${course.value?.id}` } })
    return
  }
  if (course.value) {
    router.push(`/checkout?course=${course.value.id}`)
  }
}

// 🔹 Agregar curso al carrito
async function agregarAlCarrito() {
  if (!authStore.token) {
    router.push({ path: '/login', query: { next: route.fullPath } })
    return
  }

  if (!course.value || !carrito.value) return

  try {
    await agregarCursoCarrito(carrito.value.id, course.value.id)
    await cargarCarrito() // refrescar el carrito
    alert(`Curso "${course.value.titulo}" agregado al carrito.`)
  } catch (error) {
    console.error("Error al agregar curso al carrito:", error)
    alert("No se pudo agregar el curso al carrito.")
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
        <button class="btn block" style="margin-top:0.5rem" @click="agregarAlCarrito">
          AGREGAR AL CARRITO
        </button>
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
