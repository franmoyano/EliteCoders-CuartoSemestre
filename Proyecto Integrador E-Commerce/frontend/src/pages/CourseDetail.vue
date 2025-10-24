<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getCursoById, getMisCursos, getCursoLecciones } from '../api/cursos'
import { getCarrito, agregarCursoCarrito } from '../api/carrito'

const route = useRoute()
const router = useRouter()

const course = ref(null)
const carrito = ref(null)
const userCourses = ref([])
const courseLessons = ref([])
const lessonsLoading = ref(false)
const pageLoading = ref(true) // Main loading state for the entire page
const authStore = useAuthStore()

// 🔹 Check if user is enrolled in this course
const isEnrolled = computed(() => {
  if (!course.value || !userCourses.value.length) return false
  return userCourses.value.some(c => c.id === course.value.id)
})

// 🔹 Check if course is already in cart
const isInCart = computed(() => {
  if (!course.value || !carrito.value?.items) return false
  return carrito.value.items.some(item => item.curso === course.value.id)
})

// 🔹 Determine button text and state
const cartButtonText = computed(() => {
  if (isEnrolled.value) return 'Ya estás inscripto'
  if (isInCart.value) return 'Ya está en el carrito'
  return 'AGREGAR AL CARRITO'
})

const cartButtonDisabled = computed(() => {
  return isEnrolled.value || isInCart.value
})

// 🔹 Cargar curso
onMounted(async () => {
  const courseId = route.params.id
  pageLoading.value = true
  
  try {
    // Load all initial data in parallel for better performance
    const promises = [
      getCursoById(courseId),
      cargarCarrito(),
    ]
    
    // Add user courses if authenticated
    if (authStore.token) {
      promises.push(cargarCursosUsuario())
    }
    
    // Wait for all initial API calls
    const [courseResponse] = await Promise.all(promises)
    course.value = courseResponse.data
    
    // After we know enrollment status, load lessons if needed
    if (authStore.token && isEnrolled.value) {
      await cargarLecciones(courseId)
    }
    
  } catch (error) {
    console.error("Error al cargar el curso:", error)
  } finally {
    // Only hide loading after everything is complete
    pageLoading.value = false
  }
})

// 🔹 Cargar lecciones del curso
const cargarLecciones = async (courseId) => {
  if (!authStore.token) return
  
  lessonsLoading.value = true
  try {
    const { data } = await getCursoLecciones(courseId)
    courseLessons.value = data
  } catch (error) {
    console.error("Error al cargar lecciones:", error)
    // If there's an error, we could show a message or fallback
  } finally {
    lessonsLoading.value = false
  }
}

// 🔹 Cargar cursos del usuario (para verificar inscripción)
const cargarCursosUsuario = async () => {
  if (!authStore.token) return
  try {
    const { data } = await getMisCursos()
    userCourses.value = data
  } catch (error) {
    console.error("Error al cargar cursos del usuario:", error)
  }
}

// 🔹 Cargar carrito
const cargarCarrito = async () => {
  if (!authStore.token) return
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

  // Prevent adding if already enrolled or in cart
  if (isEnrolled.value || isInCart.value) {
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

// 🔹 Ver lección (navegar a la página de lecciones)
function viewLesson(lesson, index) {
  // Navigate to lesson view - using lesson ID from API if available
  const lessonId = lesson.id || (index + 1)
  router.push({
    path: `/courses/${course.value.id}/lessons/${lessonId}`,
    query: { 
      lesson: lesson.id || `lesson-${index + 1}`,
      title: lesson.titulo || lesson.title
    }
  })
}
</script>

<template>
  <!-- Main loading state -->
  <div v-if="pageLoading" class="container">
    <div class="center">
      <div class="card" style="max-width:400px">
        <div class="card-content" style="text-align:center">
          <h2 class="h2">⏳ Cargando curso...</h2>
          <p style="color:var(--muted);margin:1rem 0">Obteniendo información del curso y verificando tu acceso.</p>
          <div style="display:flex;justify-content:center;gap:0.5rem;margin-top:1rem">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Course content -->
  <section v-else-if="course" class="container">
    <h1 class="h1">{{ course.titulo }}</h1>
    
    <!-- Enrolled User View: Show Course Content -->
    <div v-if="isEnrolled" class="sidebar-grid">
      <div>
        <div class="card" style="margin-bottom: 1rem">
          <div class="card-content">
            <h2 class="h2">🎓 Estás inscrito en este curso</h2>
            <p style="color: var(--muted)">Accede a todo el contenido del curso.</p>
          </div>
        </div>

        <div class="card">
          <div class="card-content">
            <h3 class="h2">📚 Lecciones del curso</h3>
            
            <!-- Loading state for lessons -->
            <div v-if="lessonsLoading" style="text-align: center; margin: 1rem 0">
              <p style="color: var(--muted)">⏳ Cargando lecciones...</p>
            </div>
            
            <!-- No lessons available -->
            <div v-else-if="courseLessons.length === 0" style="text-align: center; margin: 1rem 0">
              <p style="color: var(--muted)">📭 No hay lecciones disponibles para este curso.</p>
            </div>
            
            <!-- Lessons list -->
            <div v-else class="grid" style="gap: 0.5rem; margin-top: 1rem">
              <div 
                v-for="(lesson, index) in courseLessons" 
                :key="lesson.id || index"
                class="list-pill lesson-item"
                @click="viewLesson(lesson, index)"
              >
                <span>
                  <strong>Lección {{ index + 1 }}:</strong> {{ lesson.titulo || lesson.title }}
                  <span v-if="lesson.duracion || lesson.duration" style="color: var(--muted); font-weight: normal">
                    ({{ lesson.duracion || lesson.duration }})
                  </span>
                </span>
                <span>▶️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside class="card">
        <div class="card-content">
          <h2 class="h2">Información del curso</h2>
          <p style="color:var(--muted)">{{ course.descripcion }}</p>
          <div style="margin: 1rem 0">
            <p><strong>👨‍🏫 Instructor:</strong> {{ course.instructor.nombre }}</p>
            <p><strong>📂 Categoría:</strong> {{ course.categoria.nombre }}</p>
            <p><strong>💰 Precio:</strong> ${{ course.precio }}</p>
          </div>
        </div>
        <div class="card-footer">
          <div class="hr"></div>
          <RouterLink to="/mis-cursos" class="btn secondary block">
            📋 Ir a Mis Cursos
          </RouterLink>
        </div>
      </aside>
    </div>

    <!-- Non-enrolled User View: Show Purchase Options -->
    <div v-else class="sidebar-grid">
      <div>
        <div class="list-pill">Modalidad</div>
        <div class="list-pill">Programa</div>
        <div class="list-pill">Salida laboral y testimonios</div>
        <div class="list-pill">Preguntas Frecuentes</div>
        <div class="list-pill"><strong>${{ course.precio }}</strong></div>
        <button 
          class="btn block" 
          :class="{ 'btn-disabled': cartButtonDisabled }"
          style="margin-top:0.5rem" 
          @click="agregarAlCarrito"
          :disabled="cartButtonDisabled"
        >
          {{ cartButtonText }}
        </button>
      </div>
      <aside class="card">
        <div class="card-content">
          <h2 class="h2">Resumen del curso</h2>
          <p style="color:var(--muted)">{{ course.descripcion }}</p>
          <p><strong>👨‍🏫 Instructor:</strong> {{ course.instructor.nombre }}</p>
          <p><strong>📂 Categoría:</strong> {{ course.categoria.nombre }}</p>
        </div>
      </aside>
    </div>
  </section>

  <!-- Error state -->
  <div v-else class="container">
    <div class="center">
      <div class="card" style="max-width:400px">
        <div class="card-content" style="text-align:center">
          <h2 class="h2">❌ Error al cargar</h2>
          <p style="color:var(--muted)">No se pudo cargar la información del curso.</p>
        </div>
        <div class="card-footer">
          <button class="btn block" @click="$router.go(-1)">
            ← Volver
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
