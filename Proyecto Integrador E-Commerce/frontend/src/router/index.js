import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('@/pages/Home.vue') },
  { path: '/courses', component: () => import('@/pages/Courses.vue') },
  { path: '/courses/:id', component: () => import('@/pages/CourseDetail.vue') },
  { path: '/courses/:id/lessons', component: () => import('@/pages/CourseLessons.vue') },
  { path: '/checkout', component: () => import('@/pages/Checkout.vue') },
  { path: '/success', component: () => import('@/pages/Success.vue') },
  { path: '/cart', component: () => import('@/pages/Cart.vue') },
  { path: '/login', component: () => import('@/pages/Login.vue') },
  { path: '/register', component: () => import('@/pages/Register.vue') },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/pages/NotFound.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})
