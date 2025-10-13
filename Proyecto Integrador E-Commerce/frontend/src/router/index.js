import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Courses from '../pages/Courses.vue'
import CourseDetail from '../pages/CourseDetail.vue'
import Cart from '@/pages/Cart.vue'
import Login from '@/pages/Login.vue'
import Register from '@/pages/Register.vue'
import NotFound from '@/pages/NotFound.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/courses', name: 'courses', component: Courses },
  { path: '/courses/:id', name: 'course-detail', component: CourseDetail, props: true },
  { path: '/cart', name: 'cart', component: Cart },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})
