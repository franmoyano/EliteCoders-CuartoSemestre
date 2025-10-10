import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './styles/tailwind.css' // si usas Tailwind

createApp(App).use(createPinia()).use(router).mount('#app')
