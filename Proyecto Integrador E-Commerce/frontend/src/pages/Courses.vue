<script setup>
import { courses } from '@/mocks/courses'
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="container">
    <h1 class="h1" style="margin-bottom:.5rem">Cursos</h1>
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr));">
      <article class="card" v-for="c in courses" :key="c.id">
        <h2 class="h2">{{ c.title }}</h2>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.3rem 0">
          <span class="tag">{{ c.category }}</span>
          <span class="tag">{{ c.duration }}</span>
        </div>
        <p style="color:var(--muted)">{{ c.summary }}</p>
        <div class="hr"></div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${{ c.price.toFixed(2) }}</strong>
          <RouterLink class="btn" :to="`/courses/${c.id}`">Ver curso</RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>
